/**
 * Response utilities for GDPS endpoints
 * GDPS uses specific response formats that the game client expects
 */

/**
 * Generic error response
 */
export const ERROR_GENERIC = '-1';

/**
 * Format a response with separators
 * @param data - Object with key-value pairs
 * @param keySep - Key separator (default: ':')
 * @param itemSep - Item separator (default: '|')
 */
export function formatResponse(
  data: Record<string, any>,
  keySep: string = ':',
  itemSep: string = '|'
): string {
  return Object.entries(data)
    .map(([key, value]) => `${key}${keySep}${value}`)
    .join(itemSep);
}

/**
 * Format a list response with hash
 * @param items - Array of items
 * @param hash - Hash value
 * @param itemSep - Item separator (default: '|')
 * @param blockSep - Block separator (default: '#')
 */
export function formatListResponse(
  items: string[],
  hash: string = '',
  itemSep: string = '|',
  blockSep: string = '#'
): string {
  const itemsStr = items.join(itemSep);
  return hash ? `${itemsStr}${blockSep}${hash}` : itemsStr;
}

/**
 * Parse request body (URL-encoded format from game client)
 * @param body - Request body object
 */
export function parseGDRequest(body: any): Record<string, any> {
  return body;
}

/**
 * Check if required parameters exist
 * @param body - Request body
 * @param required - Array of required parameter names
 */
export function validateRequiredParams(body: any, required: string[]): boolean {
  return required.every((param) => body[param] !== undefined && body[param] !== '');
}

/**
 * Get IP address from request
 * @param req - Express request object
 */
export function getIP(req: any): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    '127.0.0.1'
  );
}
