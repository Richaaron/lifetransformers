"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const crypto_1 = require("../lib/crypto");
const router = (0, express_1.Router)();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = supabaseUrl && supabaseKey ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey) : null;
router.get('/', async (req, res) => {
    const conversationId = req.query.conversationId;
    if (!conversationId)
        return res.status(400).json({ error: 'conversationId is required' });
    if (!supabase)
        return res.status(500).json({ error: 'Supabase client unavailable' });
    const { data, error } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, content, encrypted_content, message_type, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
    if (error)
        return res.status(500).json({ error: error.message });
    const messages = (data || []).map((message) => ({
        ...message,
        content: message.encrypted_content ? (0, crypto_1.decryptText)(message.encrypted_content) : message.content,
    }));
    return res.json({ success: true, data: messages });
});
router.post('/', async (req, res) => {
    const { conversationId, senderId, content, message_type = 'text' } = req.body;
    if (!conversationId || !senderId || !content) {
        return res.status(400).json({ error: 'conversationId, senderId, and content are required' });
    }
    if (!supabase)
        return res.status(500).json({ error: 'Supabase client unavailable' });
    const encryptedContent = (0, crypto_1.encryptText)(content);
    const { data, error } = await supabase.from('messages').insert([
        {
            conversation_id: conversationId,
            sender_id: senderId,
            content: '',
            encrypted_content: encryptedContent,
            message_type,
        },
    ]);
    if (error)
        return res.status(500).json({ error: error.message });
    return res.status(201).json({ success: true, data });
});
exports.default = router;
