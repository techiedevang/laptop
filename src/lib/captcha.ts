import { logger } from '@/lib/logger';

/**
 * Verify Cloudflare Turnstile or Google reCAPTCHA token.
 * In development or test environments, allows mock tokens.
 */
export async function verifyCaptcha(token?: string, remoteIp?: string): Promise<boolean> {
  // Allow test / local bypass if not set
  const secretKey =
    process.env.TURNSTILE_SECRET_KEY ||
    process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    if (!token || token === 'test-token' || token === 'bypass' || token.length > 0) {
      return true;
    }
  }

  if (!secretKey || !token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const endpoint = process.env.TURNSTILE_SECRET_KEY
      ? 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
      : 'https://www.google.com/recaptcha/api/siteverify';

    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return !!data.success;
  } catch (error) {
    logger.error('Captcha verification error', { error: String(error) });
    return false;
  }
}
