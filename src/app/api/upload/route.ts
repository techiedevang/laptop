import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { uploadLimiter } from '@/lib/rate-limit';
import { getClientIp, enforceRateLimit, handleApiError, successResponse, errorResponse } from '@/lib/api-utils';
import { requireAdmin } from '@/lib/server-auth';
import sharp from 'sharp';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
]);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB

// Configure Cloudinary if env vars are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const ip = getClientIp(req);
    const rateLimitError = await enforceRateLimit(uploadLimiter, ip);
    if (rateLimitError) return rateLimitError;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return errorResponse('Invalid file type. Allowed formats: JPG, PNG, WebP, GIF, MP4, WebM', 400);
    }

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (file.size > maxSize) {
      return errorResponse(
        `File too large. Maximum size is ${isVideo ? '50MB for video' : '5MB for images'}`,
        400,
      );
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const randomHex = crypto.randomBytes(16).toString('hex');

    let processedBuffer = rawBuffer;
    let extension = file.name.split('.').pop() || 'bin';
    let mimeType = file.type;

    // Convert images to WebP
    if (!isVideo && file.type !== 'image/gif') {
      processedBuffer = await sharp(rawBuffer)
        .webp({ quality: 85 })
        .toBuffer();
      extension = 'webp';
      mimeType = 'image/webp';
    }

    const filename = `${randomHex}.${extension}`;
    let finalUrl = '';
    let publicId = `${folder}/${randomHex}`;

    // Upload to Cloudinary if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `nextgen/${folder}`,
            resource_type: isVideo ? 'video' : 'image',
            public_id: randomHex,
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          },
        );
        uploadStream.end(processedBuffer);
      });

      finalUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    } else {
      // Local storage fallback for development / testing
      const publicDir = path.join(process.cwd(), 'public', 'uploads', folder);
      await fs.mkdir(publicDir, { recursive: true });
      const filePath = path.join(publicDir, filename);
      await fs.writeFile(filePath, processedBuffer);
      finalUrl = `/uploads/${folder}/${filename}`;
    }

    // Save media asset in DB
    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        url: finalUrl,
        publicId,
        altText: file.name,
        fileType: mimeType,
        fileSize: processedBuffer.length,
      },
    });

    return successResponse({
      id: mediaAsset.id,
      url: finalUrl,
      publicId,
      filename,
      sizeBytes: processedBuffer.length,
      mimeType,
    }, 201);
  } catch (error) {
    return handleApiError(error, 'POST /api/upload');
  }
}
