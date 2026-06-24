"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const auth_1 = __importDefault(require("./routes/auth"));
const messages_1 = __importDefault(require("./routes/messages"));
const app = (0, express_1.default)();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.warn('Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY is not set in backend environment');
}
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/notifications', notifications_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/messages', messages_1.default);
app.get('/', (_req, res) => {
    res.send({ status: 'ok', version: '1.0.0' });
});
app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
});
