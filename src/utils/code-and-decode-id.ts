import crypto from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';

const key = process.env.KEY_ENCODE_AND_DECODE_AES ?? 'key_encode_decode_aes';

const SECRET_KEY = crypto
    .createHash('sha256')
    .update(key)
    .digest();

const toBase64Url = (buffer: Buffer): string =>
    buffer
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

export const encodeId = (id: number | string): string => {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);

    const encrypted = Buffer.concat([
        cipher.update(id.toString(), 'utf8'),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return toBase64Url(Buffer.concat([iv, authTag, encrypted]));
};


const fromBase64Url = (str: string): Buffer => {
    const base64 = str
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(str.length + (4 - (str.length % 4)) % 4, '=');

    return Buffer.from(base64, 'base64');
};

export const decodeId = (encoded: string): string => {
    const buffer = fromBase64Url(encoded);

    const iv = buffer.subarray(0, 12);
    const authTag = buffer.subarray(12, 28);
    const encrypted = buffer.subarray(28);

    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(authTag);

    try {
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    } catch (error) {
        return '';
    }
};

export const getObfuscatedCookieName = (cookieName: string): string => {
    const hash = crypto
        .createHash('sha256')
        .update(cookieName)
        .digest('hex');

    return `_${hash.substring(0, 16)}`;
};