import * as crypto from 'crypto';

export const getTimeSeedHash = (
  secretKey: string,
  timestamp: number,
): string => {
  // const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const timeSeed = Math.floor(timestamp / 30); // Divide by 30 seconds to generate time-based seed
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(timeSeed.toString());
  const hashValue = hmac.digest('hex');
  return `${hashValue}.${timeSeed}`;
};
