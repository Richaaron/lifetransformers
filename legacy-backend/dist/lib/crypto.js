"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptText = encryptText;
exports.decryptText = decryptText;
const crypto_1 = __importDefault(require("crypto"));
const keySource = process.env.CHALLENGE_ENCRYPTION_KEY || process.env.SUPABASE_SERVICE_KEY || 'lifetransformers-secret-key';
const KEY = crypto_1.default.createHash('sha256').update(keySource).digest();
const IV_LENGTH = 12;
function encryptText(plainText) {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv('aes-256-gcm', KEY, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}
function decryptText(encryptedText) {
    const [ivBase64, tagBase64, dataBase64] = encryptedText.split(':');
    if (!ivBase64 || !tagBase64 || !dataBase64) {
        throw new Error('Malformed encrypted payload');
    }
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    const data = Buffer.from(dataBase64, 'base64');
    const decipher = crypto_1.default.createDecipheriv('aes-256-gcm', KEY, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
}
