"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base32Encode = base32Encode;
exports.base32Decode = base32Decode;
exports.generateSecret = generateSecret;
exports.generateTotp = generateTotp;
exports.verifyTotp = verifyTotp;
const crypto_1 = __importDefault(require("crypto"));
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const CHAR_MAP = ALPHABET.split('').reduce((map, char, index) => {
    map[char] = index;
    return map;
}, {});
function base32Encode(buffer) {
    let bits = 0;
    let value = 0;
    let output = '';
    for (const byte of buffer) {
        value = (value << 8) | byte;
        bits += 8;
        while (bits >= 5) {
            output += ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) {
        output += ALPHABET[(value << (5 - bits)) & 31];
    }
    while (output.length % 8 !== 0) {
        output += '=';
    }
    return output;
}
function base32Decode(encoded) {
    const cleaned = encoded.replace(/=+$/g, '').toUpperCase();
    let bits = 0;
    let value = 0;
    const bytes = [];
    for (const char of cleaned) {
        const digit = CHAR_MAP[char];
        if (digit === undefined)
            throw new Error(`Invalid base32 character: ${char}`);
        value = (value << 5) | digit;
        bits += 5;
        if (bits >= 8) {
            bytes.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return Buffer.from(bytes);
}
function generateSecret() {
    const secretBuffer = crypto_1.default.randomBytes(20);
    return base32Encode(secretBuffer).replace(/=+$/g, '');
}
function generateTotp(secret) {
    const key = base32Decode(secret);
    const step = Math.floor(Date.now() / 1000 / 30);
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeUInt32BE(Math.floor(step / 2 ** 32), 0);
    counterBuffer.writeUInt32BE(step % 2 ** 32, 4);
    const hmac = crypto_1.default.createHmac('sha1', key).update(counterBuffer).digest();
    const offset = hmac[hmac.length - 1] & 0xf;
    const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 10000000;
    return code.toString().padStart(6, '0');
}
function verifyTotp(secret, token) {
    const normalized = token.trim();
    for (let delta = -1; delta <= 1; delta += 1) {
        const key = base32Decode(secret);
        const step = Math.floor(Date.now() / 1000 / 30) + delta;
        const counterBuffer = Buffer.alloc(8);
        counterBuffer.writeUInt32BE(Math.floor(step / 2 ** 32), 0);
        counterBuffer.writeUInt32BE(step % 2 ** 32, 4);
        const hmac = crypto_1.default.createHmac('sha1', key).update(counterBuffer).digest();
        const offset = hmac[hmac.length - 1] & 0xf;
        const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 10000000;
        if (code.toString().padStart(6, '0') === normalized) {
            return true;
        }
    }
    return false;
}
