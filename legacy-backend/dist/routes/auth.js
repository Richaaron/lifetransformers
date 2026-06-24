"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const totp_1 = require("../lib/totp");
const router = (0, express_1.Router)();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = supabaseUrl && supabaseKey ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey) : null;
router.post('/enable-2fa', async (req, res) => {
    const { userId } = req.body;
    if (!userId)
        return res.status(400).json({ error: 'userId is required' });
    if (!supabase)
        return res.status(500).json({ error: 'Supabase client unavailable' });
    const secret = (0, totp_1.generateSecret)();
    const { error } = await supabase.from('profiles').update({ totp_secret: secret }).eq('id', userId);
    if (error)
        return res.status(500).json({ error: error.message });
    return res.json({ success: true, secret });
});
router.post('/validate-2fa', async (req, res) => {
    const { userId, token } = req.body;
    if (!userId || !token)
        return res.status(400).json({ error: 'userId and token are required' });
    if (!supabase)
        return res.status(500).json({ error: 'Supabase client unavailable' });
    const { data, error } = await supabase.from('profiles').select('totp_secret').eq('id', userId).single();
    if (error)
        return res.status(500).json({ error: error.message });
    if (!data?.totp_secret)
        return res.status(400).json({ error: '2FA not enabled for this user' });
    const isValid = (0, totp_1.verifyTotp)(data.totp_secret, token);
    return res.json({ success: isValid });
});
router.get('/2fa-status', async (req, res) => {
    const userId = req.query.userId;
    if (!userId)
        return res.status(400).json({ error: 'userId is required' });
    if (!supabase)
        return res.status(500).json({ error: 'Supabase client unavailable' });
    const { data, error } = await supabase.from('profiles').select('totp_secret').eq('id', userId).single();
    if (error)
        return res.status(500).json({ error: error.message });
    return res.json({ success: true, enabled: Boolean(data?.totp_secret) });
});
router.post('/disable-2fa', async (req, res) => {
    const { userId, token } = req.body;
    if (!userId || !token)
        return res.status(400).json({ error: 'userId and token are required' });
    if (!supabase)
        return res.status(500).json({ error: 'Supabase client unavailable' });
    const { data, error } = await supabase.from('profiles').select('totp_secret').eq('id', userId).single();
    if (error)
        return res.status(500).json({ error: error.message });
    if (!data?.totp_secret)
        return res.status(400).json({ error: '2FA not enabled for this user' });
    const isValid = (0, totp_1.verifyTotp)(data.totp_secret, token);
    if (!isValid)
        return res.status(400).json({ error: 'Invalid 2FA code' });
    const { error: updateError } = await supabase.from('profiles').update({ totp_secret: null }).eq('id', userId);
    if (updateError)
        return res.status(500).json({ error: updateError.message });
    return res.json({ success: true });
});
exports.default = router;
