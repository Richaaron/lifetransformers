-- Supabase Database Seed Script
-- Generates mock data for local testing of the Life Transformers Network

-- Clean up any existing data
-- (Note: TRUNCATE/DELETE commands are executed in reverse dependency order)
DELETE FROM comment_likes;
DELETE FROM comments;
DELETE FROM likes;
DELETE FROM posts;
DELETE FROM group_members;
DELETE FROM group_invites;
DELETE FROM groups;
DELETE FROM friendships;
DELETE FROM notifications;
DELETE FROM conversation_participants;
DELETE FROM messages;
DELETE FROM conversations;
DELETE FROM user_progress;
DELETE FROM xp_log;
DELETE FROM public.profiles;
DELETE FROM auth.users WHERE email LIKE '%@example.com';

-- ── 1. INSERT AUTH USERS ──────────────────────────────────────────────────────
-- Password for all accounts: password123
INSERT INTO auth.users (
  id, 
  instance_id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_user_meta_data, 
  raw_app_meta_data, 
  aud, 
  role, 
  created_at, 
  updated_at
) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'pastor@example.com', extensions.crypt('password123', extensions.gen_salt('bf')), now(), '{"username": "pastor_tim", "display_name": "Pastor Tim"}', '{"provider": "email", "providers": ["email"]}', 'authenticated', 'authenticated', now() - interval '60 days', now()),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'disciple@example.com', extensions.crypt('password123', extensions.gen_salt('bf')), now(), '{"username": "disciple_john", "display_name": "Disciple John"}', '{"provider": "email", "providers": ["email"]}', 'authenticated', 'authenticated', now() - interval '45 days', now()),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'witness@example.com', extensions.crypt('password123', extensions.gen_salt('bf')), now(), '{"username": "witness_mary", "display_name": "Witness Mary"}', '{"provider": "email", "providers": ["email"]}', 'authenticated', 'authenticated', now() - interval '30 days', now()),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'newcomer@example.com', extensions.crypt('password123', extensions.gen_salt('bf')), now(), '{"username": "newcomer_luke", "display_name": "Newcomer Luke"}', '{"provider": "email", "providers": ["email"]}', 'authenticated', 'authenticated', now() - interval '5 days', now()),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'sarah@example.com', extensions.crypt('password123', extensions.gen_salt('bf')), now(), '{"username": "sarah_k", "display_name": "Sarah Jenkins"}', '{"provider": "email", "providers": ["email"]}', 'authenticated', 'authenticated', now() - interval '20 days', now()),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'david@example.com', extensions.crypt('password123', extensions.gen_salt('bf')), now(), '{"username": "david_singh", "display_name": "David Singh"}', '{"provider": "email", "providers": ["email"]}', 'authenticated', 'authenticated', now() - interval '15 days', now()),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'ruth@example.com', extensions.crypt('password123', extensions.gen_salt('bf')), now(), '{"username": "ruth_bible", "display_name": "Ruth Opara"}', '{"provider": "email", "providers": ["email"]}', 'authenticated', 'authenticated', now() - interval '10 days', now());

-- Triggers handle_new_user and handle_new_user_progress automatically insert rows 
-- into public.profiles and public.user_progress.
-- We will now UPDATE these tables to add customized rich profiles.

-- ── 2. UPDATE PUBLIC PROFILES ─────────────────────────────────────────────────
UPDATE public.profiles SET
  bio = 'Senior Pastor at Life Transformers Ministry. Passionate about community discipleship.',
  location = 'Lagos, Nigeria',
  hobby = 'Reading theological journals, walking',
  date_of_birth = '1975-04-12',
  status = 'active'
WHERE id = '00000000-0000-0000-0000-000000000001';

UPDATE public.profiles SET
  bio = 'Seeking first the Kingdom. Bible study leader.',
  location = 'London, UK',
  hobby = 'Playing guitar, cycling',
  date_of_birth = '1998-08-22',
  status = 'active'
WHERE id = '00000000-0000-0000-0000-000000000002';

UPDATE public.profiles SET
  bio = 'Faith advocate and digital witness. Let your light shine!',
  location = 'Austin, TX',
  hobby = 'Photography, blogging',
  date_of_birth = '1992-11-03',
  status = 'active'
WHERE id = '00000000-0000-0000-0000-000000000003';

UPDATE public.profiles SET
  bio = 'Just joined! Happy to connect with other believers.',
  location = 'Toronto, Canada',
  hobby = 'Cooking, playing chess',
  date_of_birth = '2001-01-15',
  status = 'active'
WHERE id = '00000000-0000-0000-0000-000000000004';

UPDATE public.profiles SET
  bio = 'Worship team member. Singing praises always.',
  location = 'Sydney, Australia',
  hobby = 'Vocal coaching, songwriting',
  date_of_birth = '1995-09-30',
  status = 'active'
WHERE id = '00000000-0000-0000-0000-000000000005';

UPDATE public.profiles SET
  bio = 'Software developer by day, bible study explorer by night.',
  location = 'San Francisco, CA',
  hobby = 'Coding open source, hiking',
  date_of_birth = '1989-06-18',
  status = 'active'
WHERE id = '00000000-0000-0000-0000-000000000006';

UPDATE public.profiles SET
  bio = 'A daughter of the King. Prayer warrior.',
  location = 'Nairobi, Kenya',
  hobby = 'Intercession, gardening',
  date_of_birth = '1982-02-14',
  status = 'active'
WHERE id = '00000000-0000-0000-0000-000000000007';


-- ── 3. UPDATE USER PROGRESS (Levels & XP) ─────────────────────────────────────
-- Setup levels and XP according to LEVEL_NAMES brackets
UPDATE public.user_progress SET
  xp = 3500,  -- Level 8: Pastor (3200 min XP)
  level = 8,
  posts_count = 12,
  comments_count = 34,
  likes_received = 48
WHERE user_id = '00000000-0000-0000-0000-000000000001';

UPDATE public.user_progress SET
  xp = 220,   -- Level 3: Disciple (150 min XP)
  level = 3,
  posts_count = 3,
  comments_count = 14,
  likes_received = 8
WHERE user_id = '00000000-0000-0000-0000-000000000002';

UPDATE public.user_progress SET
  xp = 450,   -- Level 4: Witness (350 min XP)
  level = 4,
  posts_count = 5,
  comments_count = 19,
  likes_received = 15
WHERE user_id = '00000000-0000-0000-0000-000000000003';

UPDATE public.user_progress SET
  xp = 15,    -- Level 1: Follower (0 min XP)
  level = 1,
  posts_count = 0,
  comments_count = 2,
  likes_received = 0
WHERE user_id = '00000000-0000-0000-0000-000000000004';

UPDATE public.user_progress SET
  xp = 780,   -- Level 5: Minister (700 min XP)
  level = 5,
  posts_count = 8,
  comments_count = 22,
  likes_received = 27
WHERE user_id = '00000000-0000-0000-0000-000000000005';

UPDATE public.user_progress SET
  xp = 1280,  -- Level 6: Elder (1200 min XP)
  level = 6,
  posts_count = 10,
  comments_count = 41,
  likes_received = 32
WHERE user_id = '00000000-0000-0000-0000-000000000006';

UPDATE public.user_progress SET
  xp = 2100,  -- Level 7: Deacon (2000 min XP)
  level = 7,
  posts_count = 9,
  comments_count = 28,
  likes_received = 42
WHERE user_id = '00000000-0000-0000-0000-000000000007';


-- ── 4. INSERT FRIENDSHIPS ────────────────────────────────────────────────────
INSERT INTO friendships (id, user_id, friend_id, status, created_at) VALUES
  -- Accepted friendships
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'accepted', now() - interval '40 days'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'accepted', now() - interval '25 days'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'accepted', now() - interval '20 days'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000005', 'accepted', now() - interval '18 days'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000006', 'accepted', now() - interval '10 days'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007', 'accepted', now() - interval '5 days'),
  
  -- Pending friendships (Incoming to Pastor Tim, Sent by Newcomer Luke)
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'pending', now() - interval '2 days'),
  -- Pending friendships (Incoming to Disciple John, Sent by Sarah Jenkins)
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'pending', now() - interval '1 day');


-- ── 5. INSERT GROUPS ─────────────────────────────────────────────────────────
INSERT INTO groups (id, name, description, privacy, created_by, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Morning Devotionals', 'Daily bible scriptures, encouragements, and prayer to start the day.', 'public', '00000000-0000-0000-0000-000000000001', now() - interval '50 days'),
  ('22222222-2222-2222-2222-222222222222', 'Worship & Choirs', 'Coordination group for musicians and singers of the church team.', 'private', '00000000-0000-0000-0000-000000000005', now() - interval '30 days'),
  ('33333333-3333-3333-3333-333333333333', 'Bible Study Explorers', 'A deep dive study group studying the New Testament.', 'public', '00000000-0000-0000-0000-000000000002', now() - interval '20 days');


-- ── 6. INSERT GROUP MEMBERS ──────────────────────────────────────────────────
INSERT INTO group_members (id, group_id, user_id, role, joined_at) VALUES
  -- Morning Devotionals (Public - Many members)
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'admin', now() - interval '50 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'member', now() - interval '40 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', 'member', now() - interval '28 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000005', 'member', now() - interval '20 days'),
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000006', 'member', now() - interval '12 days'),

  -- Worship & Choirs (Private - Limited members)
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000005', 'admin', now() - interval '30 days'),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000007', 'member', now() - interval '25 days'),

  -- Bible Study Explorers (Public)
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000002', 'admin', now() - interval '20 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'member', now() - interval '18 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000003', 'member', now() - interval '15 days'),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000006', 'member', now() - interval '10 days');


-- ── 7. INSERT MOCK POSTS ─────────────────────────────────────────────────────
-- Global feed posts
INSERT INTO posts (id, author_id, content, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Welcome to the Life Transformers online community! It is wonderful to have a space where we can encourage one another, share prayer requests, and build our faith together. Feel free to say hi below.', now() - interval '10 days'),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Had an amazing quiet time this morning reading Romans 8. "There is therefore now no condemnation for those who are in Christ Jesus." What a powerful promise to carry through the week!', now() - interval '7 days'),
  ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'Please remember to pray for our upcoming community outreach project this weekend. We want to be a blessing to the families in our local neighborhood. 🙏', now() - interval '5 days'),
  ('a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'Singing praises during rehearsal tonight. "Great is Thy faithfulness, O God my Father!" Excited for Sunday worship.', now() - interval '3 days');

-- Group posts
INSERT INTO posts (id, author_id, content, group_id, created_at) VALUES
  -- Posts in Morning Devotionals
  ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Good morning! Today''s scripture focus is Matthew 5:14: "You are the light of the world. A city set on a hill cannot be hidden." Let''s shine bright in our workplaces today.', '11111111-1111-1111-1111-111111111111', now() - interval '4 days'),
  ('b0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Morning devotion scripture really encouraged me. Sharing a snapshot of my journal notes from this morning!', '11111111-1111-1111-1111-111111111111', now() - interval '2 days'),
  
  -- Posts in Worship & Choirs (Private)
  ('b0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'Reminder team: We have soundcheck at 7:30 AM this Sunday. Please review the vocal splits sent earlier.', '22222222-2222-2222-2222-222222222222', now() - interval '1 day'),

  -- Posts in Bible Study Explorers
  ('b0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'Welcome explorers! Let''s start our study in Acts 1. Please post your thoughts on the significance of the ascension.', '33333333-3333-3333-3333-333333333333', now() - interval '12 days');


-- ── 8. INSERT MOCK COMMENTS ──────────────────────────────────────────────────
-- Comments on Pastor Tim's welcome post
INSERT INTO comments (id, post_id, author_id, content, created_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Thank you, Pastor Tim! Happy to be here and grow with everyone.', now() - interval '9 days'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Amen! So excited for what God is doing through this digital network.', now() - interval '9 days'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 'This looks beautiful! Great layout.', now() - interval '8 days');

-- Nested replies (Comments on comments)
-- In migration 008_comment_engagement.sql parent_id was added
INSERT INTO comments (id, post_id, author_id, content, parent_id, created_at) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Welcome, John! Looking forward to your insights.', 'c0000000-0000-0000-0000-000000000001', now() - interval '8 days'),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'Hello John, hope we can study together sometime!', 'c0000000-0000-0000-0000-000000000001', now() - interval '4 days');


-- ── 9. INSERT LIKES ──────────────────────────────────────────────────────────
INSERT INTO likes (post_id, user_id, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', now()),
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', now()),
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', now()),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', now()),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', now()),
  ('a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', now()),
  ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', now());


-- ── 10. INSERT CONVERSATIONS & DMs ────────────────────────────────────────────
-- Convo 1: Pastor Tim and Disciple John
INSERT INTO conversations (id, created_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', now() - interval '30 days');

INSERT INTO conversation_participants (conversation_id, user_id, last_read_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', now()),
  ('f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', now());

INSERT INTO messages (id, conversation_id, sender_id, content, message_type, created_at) VALUES
  (gen_random_uuid(), 'f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Hello Pastor, do you have some time for a quick question about Acts 2?', 'text', now() - interval '2 hours'),
  (gen_random_uuid(), 'f0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Of course John, feel free to send it here or we can hop on a voice call.', 'text', now() - interval '1 hour');


-- ── 11. INSERT MOCK NOTIFICATIONS ────────────────────────────────────────────
INSERT INTO notifications (id, user_id, type, actor_id, resource_id, resource_type, read, created_at) VALUES
  -- Notification to Pastor Tim (User 1) for the pending friend request from Luke
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'friend_request', '00000000-0000-0000-0000-000000000004', NULL, NULL, false, now() - interval '2 days'),
  
  -- Notification to Pastor Tim for Luke liking his welcome post
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'post_like', '00000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'post', true, now() - interval '9 days'),

  -- Notification to Disciple John for Sarah's pending friend request
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000002', 'friend_request', '00000000-0000-0000-0000-000000000005', NULL, NULL, false, now() - interval '1 day'),

  -- Notification to Pastor Tim for John replying to his comment
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'comment_reply', '00000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'post', false, now() - interval '8 days');


-- ── 12. INSERT BIBLE QUIZZES ─────────────────────────────────────────────────
INSERT INTO bible_quizzes (id, title, description, difficulty, xp_reward) VALUES
  ('10000000-0000-0000-0000-000000000001', 'New Testament Basics', 'Test your knowledge of foundational New Testament stories and teachings.', 'easy', 15),
  ('10000000-0000-0000-0000-000000000002', 'Old Testament Heroes', 'Learn about the great men and women of faith in the Old Testament.', 'medium', 25),
  ('10000000-0000-0000-0000-000000000003', 'Psalms & Wisdom', 'Explore the wisdom literature and prayers of the Bible.', 'medium', 25),
  ('10000000-0000-0000-0000-000000000004', 'Gospels Challenge', 'Deep dive into the life and ministry of Jesus Christ.', 'hard', 40);

-- Insert Bible quiz questions
INSERT INTO bible_quiz_questions (id, quiz_id, question, correct_answer, wrong_answers, reference, order_index) VALUES
  -- New Testament Basics
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'Who was the first person to see Jesus after His resurrection?', 'Mary Magdalene', ARRAY['Peter', 'John', 'The disciples'], 'John 20:11-18', 0),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'What is the first book of the New Testament?', 'Matthew', ARRAY['Mark', 'Luke', 'John'], 'Matthew 1:1', 1),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'How many apostles did Jesus choose?', '12', ARRAY['10', '13', '7'], 'Luke 6:13-16', 2),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'Where was Jesus born?', 'Bethlehem', ARRAY['Nazareth', 'Jerusalem', 'Egypt'], 'Matthew 2:1', 3),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000001', 'Who wrote the most letters in the New Testament?', 'Paul', ARRAY['Peter', 'John', 'James'], '2 Timothy 4:11', 4),
  -- Old Testament Heroes
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'Who was sold into slavery by his brothers?', 'Joseph', ARRAY['Moses', 'David', 'Solomon'], 'Genesis 37:28', 0),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'Who led the Israelites out of Egypt?', 'Moses', ARRAY['Joshua', 'Aaron', 'Samuel'], 'Exodus 14:21', 1),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'How many days did it rain during Noah''s flood?', '40', ARRAY['20', '365', '100'], 'Genesis 7:12', 2),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'Who killed Goliath?', 'David', ARRAY['Saul', 'Jonathan', 'Samuel'], '1 Samuel 17:50', 3),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000002', 'What was Samson''s source of strength?', 'His hair', ARRAY['His sword', 'His shield', 'His prayer', 'His family'], 'Judges 16:17', 4),
  -- Psalms & Wisdom
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'The Lord is my shepherd; I shall not want.', 'Psalm 23', ARRAY['Psalm 1', 'Psalm 100', 'Psalm 150'], 'Psalm 23:1', 0),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'Which book says, "Trust in the Lord with all your heart"?', 'Proverbs', ARRAY['Psalms', 'Ecclesiastes', 'Song of Solomon'], 'Proverbs 3:5', 1),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'Who was known for his wisdom?', 'Solomon', ARRAY['David', 'Moses', 'Abraham'], '1 Kings 3:9', 2),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'How many Psalms are in the book of Psalms?', '150', ARRAY['100', '119', '175'], 'Psalm 150', 3),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000003', 'Who wrote most of the Psalms?', 'David', ARRAY['Solomon', 'Moses', 'Asaph'], 'Psalm 3:1', 4),
  -- Gospels Challenge
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'What was Jesus'' first miracle?', 'Turning water to wine', ARRAY['Healing the blind', 'Feeding 5000', 'Walking on water'], 'John 2:1-11', 0),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'Who denied Jesus three times?', 'Peter', ARRAY['Judas', 'Thomas', 'John'], 'Matthew 26:69-75', 1),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'What is the last book of the New Testament?', 'Revelation', ARRAY['1 Peter', '1 John', 'Acts'], 'Revelation 1:1', 2),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'How many loaves of bread did Jesus use to feed 5000?', '5', ARRAY['2', '7', '10'], 'Matthew 14:19', 3),
  (gen_random_uuid(), '10000000-0000-0000-0000-000000000004', 'Who was the tax collector that climbed a tree to see Jesus?', 'Zacchaeus', ARRAY['Matthew', 'Levi', 'Peter'], 'Luke 19:1-10', 4);

-- ── 13. INSERT BIBLE GAME CHALLENGES ─────────────────────────────────────────
INSERT INTO verse_memory_challenges (id, title, description, difficulty, xp_reward) VALUES
  (gen_random_uuid(), 'Scripture Memory Sprint', 'Fill in the missing words from key Bible verses.', 'easy', 20);

INSERT INTO verse_memory_questions (id, challenge_id, verse_text, reference, missing_words, order_index) VALUES
  (gen_random_uuid(), (SELECT id FROM verse_memory_challenges LIMIT 1), 'The LORD is my shepherd; I shall not want.', 'Psalm 23:1', ARRAY['LORD', 'shepherd', 'want'], 0),
  (gen_random_uuid(), (SELECT id FROM verse_memory_challenges LIMIT 1), 'Trust in the LORD with all your heart and lean not on your own understanding.', 'Proverbs 3:5', ARRAY['Trust', 'heart', 'understanding'], 1);

INSERT INTO who_said_it_quizzes (id, title, description, difficulty, xp_reward) VALUES
  (gen_random_uuid(), 'Who Said It? Gospel Edition', 'Match Bible quotes to the speaker in the Gospels.', 'medium', 25);

INSERT INTO who_said_it_questions (id, quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) VALUES
  (gen_random_uuid(), (SELECT id FROM who_said_it_quizzes LIMIT 1), 'Father, forgive them, for they know not what they do.', 'Jesus', ARRAY['Peter', 'Pilate', 'John'], 'Luke 23:34', 0),
  (gen_random_uuid(), (SELECT id FROM who_said_it_quizzes LIMIT 1), 'I am the way, and the truth, and the life.', 'Jesus', ARRAY['Paul', 'Peter', 'Moses'], 'John 14:6', 1);

INSERT INTO bookshelf_challenges (id, title, section, xp_reward) VALUES
  (gen_random_uuid(), 'Bible Bookshelf Basics', 'both', 20);

INSERT INTO bookshelf_books (id, challenge_id, book_name, correct_order) VALUES
  (gen_random_uuid(), (SELECT id FROM bookshelf_challenges LIMIT 1), 'Genesis', 1),
  (gen_random_uuid(), (SELECT id FROM bookshelf_challenges LIMIT 1), 'Matthew', 40),
  (gen_random_uuid(), (SELECT id FROM bookshelf_challenges LIMIT 1), 'Revelation', 66);

INSERT INTO story_quizzes (id, title, description, difficulty, xp_reward) VALUES
  (gen_random_uuid(), 'Name That Bible Story', 'Identify the story from short descriptions.', 'easy', 20);

INSERT INTO story_questions (id, quiz_id, emoji_clue, description, correct_story, wrong_stories, reference, order_index) VALUES
  (gen_random_uuid(), (SELECT id FROM story_quizzes LIMIT 1), '🕊️🔥', 'The Holy Spirit came down in tongues of fire while believers were gathered together.', 'Pentecost', ARRAY['Ascension', 'Transfiguration', 'Baptism'], 'Acts 2:1-4', 0),
  (gen_random_uuid(), (SELECT id FROM story_quizzes LIMIT 1), '🐂⚡', 'A prophet called fire down from heaven to show God is the true Lord.', 'Elijah on Mount Carmel', ARRAY['Elijah fed by ravens', 'Moses parting the sea', 'Daniel in the lions'' den'], '1 Kings 18:38', 1);

INSERT INTO trivia_towers (id, title, xp_reward_per_floor, total_floors) VALUES
  (gen_random_uuid(), 'Bible Trivia Tower', 10, 3);

INSERT INTO trivia_floors (id, tower_id, floor_number, floor_title, difficulty, xp_bonus) VALUES
  (gen_random_uuid(), (SELECT id FROM trivia_towers LIMIT 1), 1, 'Foundational Faith', 'easy', 5),
  (gen_random_uuid(), (SELECT id FROM trivia_towers LIMIT 1), 2, 'Prophets & Promises', 'medium', 10),
  (gen_random_uuid(), (SELECT id FROM trivia_towers LIMIT 1), 3, 'Kingdom Challenges', 'hard', 15);

INSERT INTO trivia_floor_questions (id, floor_id, question, correct_answer, wrong_answers, reference, order_index) VALUES
  (gen_random_uuid(), (SELECT id FROM trivia_floors ORDER BY floor_number LIMIT 1), 'What city did Jonah run away to before being swallowed by a great fish?', 'Nineveh', ARRAY['Jerusalem', 'Babylon', 'Capernaum'], 'Jonah 1:2-3', 0),
  (gen_random_uuid(), (SELECT id FROM trivia_floors ORDER BY floor_number LIMIT 1), 'Who led the Israelites into the Promised Land after Moses?', 'Joshua', ARRAY['Caleb', 'Aaron', 'Gideon'], 'Joshua 1:1-2', 1);

INSERT INTO bible_bee_challenges (id, title, difficulty, xp_reward_per_word) VALUES
  (gen_random_uuid(), 'Bible Bee Buzz', 'easy', 10);

INSERT INTO bible_bee_words (id, challenge_id, word, hint, order_index) VALUES
  (gen_random_uuid(), (SELECT id FROM bible_bee_challenges LIMIT 1), 'Disciple', 'One who follows and learns from Jesus.', 0),
  (gen_random_uuid(), (SELECT id FROM bible_bee_challenges LIMIT 1), 'Apostle', 'Sent one who spreads the gospel message.', 1);

INSERT INTO family_tree_challenges (id, title, xp_reward_per_connection) VALUES
  (gen_random_uuid(), 'Family Tree Builder', 5);

INSERT INTO family_tree_connections (id, challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) VALUES
  (gen_random_uuid(), (SELECT id FROM family_tree_challenges LIMIT 1), 'Abraham', 'father', 'Isaac', ARRAY['Jacob', 'Esau', 'Noah'], 'Genesis 21:3', 0),
  (gen_random_uuid(), (SELECT id FROM family_tree_challenges LIMIT 1), 'David', 'father', 'Solomon', ARRAY['Jonathan', 'Nathan', 'Samuel'], '1 Kings 1:11', 1);

INSERT INTO promise_match_challenges (id, title, description, difficulty, xp_reward_per_match) VALUES
  (gen_random_uuid(), 'Bible Promise Match', 'Pair promises with their Scripture references.', 'medium', 10);

INSERT INTO promise_match_pairs (id, challenge_id, promise_text, correct_reference, wrong_references, order_index) VALUES
  (gen_random_uuid(), (SELECT id FROM promise_match_challenges LIMIT 1), 'The Lord is my shepherd; I shall not want.', 'Psalm 23:1', ARRAY['Psalm 1:1', 'John 3:16', 'Romans 8:28'], 0),
  (gen_random_uuid(), (SELECT id FROM promise_match_challenges LIMIT 1), 'I can do all things through him who strengthens me.', 'Philippians 4:13', ARRAY['Hebrews 11:1', 'Matthew 11:28', 'Psalm 46:1'], 1);
