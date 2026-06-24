"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const router = (0, express_1.Router)();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
let supabase = null;
if (supabaseUrl && supabaseKey) {
    supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
}
else {
    console.warn('SUPABASE_URL or SUPABASE_SERVICE_KEY is not set. Notifications routes will return 500 until configured.');
}
router.get('/', async (req, res) => {
    try {
        if (!supabase)
            return res.status(500).json({ error: 'Supabase not configured on server' });
        const userId = req.query.userId;
        if (!userId) {
            return res.json({ status: 'ok', data: [] });
        }
        const { data, error } = await supabase
            .from('notifications')
            .select('id, user_id, type, actor_id, resource_id, resource_type, read, created_at, actor:actor_id(username, display_name)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ status: 'ok', data });
    }
    catch (err) {
        res.status(500).json({ error: 'Unexpected server error' });
    }
});
router.post('/', async (req, res) => {
    const { targetUserId, type, actorId, resourceId, resourceType } = req.body;
    if (!targetUserId || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
        if (!supabase)
            return res.status(500).json({ error: 'Supabase not configured on server' });
        const { data, error } = await supabase.from('notifications').insert([
            {
                user_id: targetUserId,
                type,
                actor_id: actorId || null,
                resource_id: resourceId || null,
                resource_type: resourceType || null,
            },
        ]);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ error: 'Unexpected server error' });
    }
});
exports.default = router;
