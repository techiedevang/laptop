/**
 * LiveKit video meeting integration for NextGen IT Hub.
 * Provides a VideoProvider interface so the implementation can be swapped.
 */

import { AccessToken, RoomServiceClient, VideoGrant } from 'livekit-server-sdk';
import crypto from 'crypto';
import { logger } from './logger';

// ─── Provider Interface ───────────────────────────────────────────────────────

export interface VideoRoomInfo {
  roomId: string;
  roomName: string;
  joinUrl: string;
}

export interface VideoToken {
  token: string;
  wsUrl: string;
}

export interface VideoProvider {
  createRoom(roomName: string, emptyTimeout?: number): Promise<VideoRoomInfo>;
  generateToken(params: {
    roomName: string;
    participantName: string;
    participantIdentity: string;
    isHost: boolean;
    metadata?: string;
  }): Promise<VideoToken>;
  endRoom(roomName: string): Promise<void>;
  listParticipants(roomName: string): Promise<{ identity: string; name: string }[]>;
}

// ─── LiveKit Implementation ───────────────────────────────────────────────────

class LiveKitProvider implements VideoProvider {
  private roomService: RoomServiceClient;
  private apiKey: string;
  private apiSecret: string;
  private wsUrl: string;

  constructor() {
    this.apiKey = process.env.LIVEKIT_API_KEY || '';
    this.apiSecret = process.env.LIVEKIT_API_SECRET || '';
    this.wsUrl = process.env.LIVEKIT_WS_URL || '';

    if (!this.apiKey || !this.apiSecret || !this.wsUrl) {
      throw new Error('LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and LIVEKIT_WS_URL are required');
    }

    this.roomService = new RoomServiceClient(this.wsUrl, this.apiKey, this.apiSecret);
  }

  async createRoom(roomName: string, emptyTimeoutSeconds = 600): Promise<VideoRoomInfo> {
    logger.info('Creating LiveKit room', { roomName });

    const room = await this.roomService.createRoom({
      name: roomName,
      emptyTimeout: emptyTimeoutSeconds,
      maxParticipants: 10,
    });

    return {
      roomId: room.sid,
      roomName: room.name,
      joinUrl: this.wsUrl,
    };
  }

  async generateToken(params: {
    roomName: string;
    participantName: string;
    participantIdentity: string;
    isHost: boolean;
    metadata?: string;
  }): Promise<VideoToken> {
    const videoGrant: VideoGrant = {
      roomJoin: true,
      room: params.roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: params.isHost,
      roomCreate: params.isHost,
      roomRecord: params.isHost,
    };

    const at = new AccessToken(this.apiKey, this.apiSecret, {
      identity: params.participantIdentity,
      name: params.participantName,
      metadata: params.metadata,
      ttl: '2h',
    });

    at.addGrant(videoGrant);

    const token = await at.toJwt();

    logger.info('Generated LiveKit token', {
      roomName: params.roomName,
      identity: params.participantIdentity,
      isHost: params.isHost,
    });

    return { token, wsUrl: this.wsUrl };
  }

  async endRoom(roomName: string): Promise<void> {
    logger.info('Ending LiveKit room', { roomName });
    await this.roomService.deleteRoom(roomName);
  }

  async listParticipants(
    roomName: string,
  ): Promise<{ identity: string; name: string }[]> {
    const participants = await this.roomService.listParticipants(roomName);
    return participants.map((p) => ({ identity: p.identity, name: p.name }));
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _provider: VideoProvider | null = null;

export function getVideoProvider(): VideoProvider {
  if (!_provider) {
    _provider = new LiveKitProvider();
  }
  return _provider;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate a unique, unguessable room ID for a meeting.
 */
export function generateRoomId(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Build the customer-facing join URL for a video meeting.
 */
export function buildCustomerJoinUrl(roomId: string, token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/meeting/join/${roomId}?token=${encodeURIComponent(token)}`;
}

/**
 * Build the host join URL for the admin panel.
 */
export function buildHostJoinUrl(roomId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/admin/meetings/${roomId}/live`;
}
