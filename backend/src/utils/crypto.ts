import crypto from 'crypto';

/**
 * XOR cipher for Geometry Dash
 * @param data - Data to encrypt/decrypt
 * @param key - XOR key
 */
export function xor(data: string, key: string): string {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

/**
 * Generate GJP (Geometry Juke Password) - used for account authentication
 * @param password - Plain text password
 */
export function generateGJP(password: string): string {
  return crypto.createHash('sha1').update(password + 'mI29fmAnxgTs').digest('hex');
}

/**
 * Generate GJP2 (newer version) - used for account authentication
 * @param password - Plain text password
 */
export function generateGJP2(password: string): string {
  return crypto.createHash('sha1').update(password + 'mI29fmAnxgTs').digest('hex');
}

/**
 * Encode level string (simple base64 with URL encoding)
 * @param data - Level data to encode
 */
export function encodeLevelString(data: string): string {
  return Buffer.from(data).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Decode level string (simple base64 with URL encoding)
 * @param data - Encoded level data
 */
export function decodeLevelString(data: string): string {
  const normalized = data.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64').toString('utf8');
}

/**
 * Generate level seed for verification (CHK)
 * @param values - Array of values to hash
 */
export function generateChk(values: (string | number)[]): string {
  const combined = values.join('') + 'xPT6iUrtws0J';
  return crypto.createHash('sha1').update(combined).digest('hex');
}

/**
 * Generate random string for secrets
 * @param length - Length of random string
 */
export function generateRandomString(length: number = 5): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate account password hash (bcrypt-based for storage)
 * @param password - Plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcrypt');
  return bcrypt.hash(password, 10);
}

/**
 * Verify account password
 * @param password - Plain text password
 * @param hash - Stored hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(password, hash);
}
