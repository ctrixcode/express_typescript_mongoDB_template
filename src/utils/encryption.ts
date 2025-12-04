import * as crypto from 'crypto';
import { appConfig } from '../config';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = appConfig.encryptionKey; // Get key from centralized config

export function encrypt(
  text: string,
  iv?: string
): { iv: string; encryptedData: string } {
  const encryptionIv = iv ? Buffer.from(iv, 'hex') : crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    encryptionIv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: encryptionIv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
}

export function decrypt(encryptedData: string, iv: string): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
