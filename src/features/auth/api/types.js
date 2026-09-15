/**
 * Auth API shapes (aligned with Laravel UserResource / OTP responses).
 *
 * @typedef {{
 *   id: number | string,
 *   name: string | null,
 *   email: string | null,
 *   phone: string | null,
 *   avatar: string | null,
 *   profile_complete: boolean,
 *   email_verified_at?: string | null,
 *   phone_verified_at?: string | null,
 * }} AuthApiUser
 *
 * @typedef {{
 *   ok: boolean,
 *   channel: 'email' | 'phone' | string,
 *   expires_in: number,
 * }} OtpRequestResponse
 *
 * @typedef {{
 *   ok: boolean,
 *   token: string,
 *   token_type: string,
 *   user: AuthApiUser,
 *   profile_complete: boolean,
 * }} AuthTokenResponse
 *
 * @typedef {{
 *   ok: boolean,
 *   user: AuthApiUser,
 *   profile_complete: boolean,
 * }} AuthMeResponse
 */

export {}
