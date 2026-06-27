ALTER TABLE verse_memory_challenges ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE who_said_it_quizzes ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE story_quizzes ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE promise_match_challenges ADD COLUMN IF NOT EXISTS description text;

insert into verse_memory_challenges (id, title, description, difficulty, xp_reward) values
('a1000000-0000-0000-0000-000000000001', 'Psalm 23 Memory', 'Memorize the beloved Psalm 23 verses.', 'easy', 10),
('a1000000-0000-0000-0000-000000000002', 'Proverbs Wisdom', 'Recall key Proverbs verses about wisdom.', 'medium', 15),
('a1000000-0000-0000-0000-000000000003', 'New Testament Promises', 'Remember powerful New Testament promises.', 'hard', 20),
('a1000000-0000-0000-0000-000000000004', 'Psalms of Comfort', 'Find peace in comforting Psalm verses.', 'medium', 15),
('a1000000-0000-0000-0000-000000000005', 'Words of Jesus', 'Memorize direct quotes from Jesus Christ.', 'hard', 20);

insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000001', 'The Lord is my shepherd; I shall not want.', 'Psalm 23:1', '{"shepherd","want"}', 0),
('a1000000-0000-0000-0000-000000000001', 'He makes me lie down in green pastures.', 'Psalm 23:2', '{"green","pastures"}', 1),
('a1000000-0000-0000-0000-000000000001', 'He leads me beside still waters.', 'Psalm 23:2', '{"still","waters"}', 2),
('a1000000-0000-0000-0000-000000000001', 'He restores my soul.', 'Psalm 23:3', '{"restores","soul"}', 3),
('a1000000-0000-0000-0000-000000000001', 'He leads me in paths of righteousness for his name sake.', 'Psalm 23:3', '{"paths","righteousness"}', 4),
('a1000000-0000-0000-0000-000000000001', 'Even though I walk through the valley of the shadow of death, I will fear no evil.', 'Psalm 23:4', '{"valley","shadow","death","fear"}', 5),
('a1000000-0000-0000-0000-000000000001', 'For you are with me; your rod and your staff, they comfort me.', 'Psalm 23:4', '{"rod","staff","comfort"}', 6),
('a1000000-0000-0000-0000-000000000001', 'You prepare a table before me in the presence of my enemies.', 'Psalm 23:5', '{"prepare","table","enemies"}', 7),
('a1000000-0000-0000-0000-000000000001', 'You anoint my head with oil; my cup overflows.', 'Psalm 23:5', '{"anoint","oil","overflows"}', 8),
('a1000000-0000-0000-0000-000000000001', 'Surely goodness and mercy shall follow me all the days of my life.', 'Psalm 23:6', '{"goodness","mercy","follow"}', 9);

insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000002', 'Trust in the Lord with all your heart, and do not lean on your own understanding.', 'Proverbs 3:5', '{"trust","heart","understanding"}', 0),
('a1000000-0000-0000-0000-000000000002', 'In all your ways acknowledge him, and he will make straight your paths.', 'Proverbs 3:6', '{"acknowledge","straight","paths"}', 1),
('a1000000-0000-0000-0000-000000000002', 'The fear of the Lord is the beginning of wisdom.', 'Proverbs 9:10', '{"fear","beginning","wisdom"}', 2),
('a1000000-0000-0000-0000-000000000002', 'A gentle answer turns away wrath, but a harsh word stirs up anger.', 'Proverbs 15:1', '{"gentle","wrath","harsh"}', 3),
('a1000000-0000-0000-0000-000000000002', 'The tongue of the wise adorns knowledge, but the mouth of the fool gushes folly.', 'Proverbs 15:2', '{"tongue","wise","adorns"}', 4),
('a1000000-0000-0000-0000-000000000002', 'Plans are established by seeking advice; so if you wage war, obtain guidance.', 'Proverbs 20:18', '{"plans","advice","guidance"}', 5),
('a1000000-0000-0000-0000-000000000002', 'The wise in heart are called discerning, and pleasant words promote instruction.', 'Proverbs 16:21', '{"wise","discerning","pleasant"}', 6),
('a1000000-0000-0000-0000-000000000002', 'Iron sharpens iron, and one person sharpens another.', 'Proverbs 27:17', '{"iron","sharpens","another"}', 7),
('a1000000-0000-0000-0000-000000000002', 'Above all else, guard your heart, for everything you do flows from it.', 'Proverbs 4:23', '{"guard","heart","flows"}', 8),
('a1000000-0000-0000-0000-000000000002', 'Commit to the Lord whatever you do, and he will establish your plans.', 'Proverbs 16:3', '{"commit","establish","plans"}', 9);

insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000003', 'For God so loved the world that he gave his only Son.', 'John 3:16', '{"loved","world","only Son"}', 0),
('a1000000-0000-0000-0000-000000000003', 'I can do all things through him who strengthens me.', 'Philippians 4:13', '{"all things","strengthens"}', 1),
('a1000000-0000-0000-0000-000000000003', 'And we know that in all things God works for the good of those who love him.', 'Romans 8:28', '{"works","good","love"}', 2),
('a1000000-0000-0000-0000-000000000003', 'But those who hope in the Lord will renew their strength.', 'Isaiah 40:31', '{"hope","renew","strength"}', 3),
('a1000000-0000-0000-0000-000000000003', 'The Lord is my light and my salvation; whom shall I fear?', 'Psalm 27:1', '{"light","salvation","fear"}', 4),
('a1000000-0000-0000-0000-000000000003', 'Be strong and courageous. Do not be afraid; do not be discouraged.', 'Joshua 1:9', '{"strong","courageous","afraid"}', 5),
('a1000000-0000-0000-0000-000000000003', 'No weapon formed against you shall prosper.', 'Isaiah 54:17', '{"weapon","formed","prosper"}', 6),
('a1000000-0000-0000-0000-000000000003', 'I will never leave you nor forsake you.', 'Hebrews 13:5', '{"never","leave","forsake"}', 7),
('a1000000-0000-0000-0000-000000000003', 'Come to me, all you who are weary and burdened, and I will give you rest.', 'Matthew 11:28', '{"weary","burdened","rest"}', 8),
('a1000000-0000-0000-0000-000000000003', 'And my God will meet all your needs according to the riches of his glory.', 'Philippians 4:19', '{"meet","needs","riches"}', 9);

insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000004', 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.', 'Psalm 34:18', '{"close","brokenhearted","saves"}', 0),
('a1000000-0000-0000-0000-000000000004', 'Cast your cares on the Lord and he will sustain you.', 'Psalm 55:22', '{"cast","cares","sustain"}', 1),
('a1000000-0000-0000-0000-000000000004', 'He heals the brokenhearted and binds up their wounds.', 'Psalm 147:3', '{"heals","brokenhearted","binds"}', 2),
('a1000000-0000-0000-0000-000000000004', 'The Lord is my refuge and my fortress; my God, in whom I trust.', 'Psalm 91:2', '{"refuge","fortress","trust"}', 3),
('a1000000-0000-0000-0000-000000000004', 'When I am afraid, I put my trust in you.', 'Psalm 56:3', '{"afraid","trust"}', 4),
('a1000000-0000-0000-0000-000000000004', 'You will keep in perfect peace those whose minds are steadfast.', 'Isaiah 26:3', '{"perfect","peace","steadfast"}', 5),
('a1000000-0000-0000-0000-000000000004', 'The Lord is my strength and my shield; my heart trusts in him.', 'Psalm 28:7', '{"strength","shield","trusts"}', 6),
('a1000000-0000-0000-0000-000000000004', 'God is our refuge and strength, an ever-present help in trouble.', 'Psalm 46:1', '{"refuge","strength","help"}', 7),
('a1000000-0000-0000-0000-000000000004', 'I will lie down and sleep in peace, for you alone, Lord, make me dwell in safety.', 'Psalm 4:8', '{"lie","sleep","peace","safety"}', 8),
('a1000000-0000-0000-0000-000000000004', 'The Lord is my shepherd; I shall not want. He makes me lie down in green pastures.', 'Psalm 23:1-2', '{"shepherd","want","green","pastures"}', 9);

insert into verse_memory_questions (challenge_id, verse_text, reference, missing_words, order_index) values
('a1000000-0000-0000-0000-000000000005', 'I am the way, the truth, and the life.', 'John 14:6', '{"way","truth","life"}', 0),
('a1000000-0000-0000-0000-000000000005', 'Love your neighbor as yourself.', 'Matthew 22:39', '{"love","neighbor","yourself"}', 1),
('a1000000-0000-0000-0000-000000000005', 'For where your treasure is, there your heart will be also.', 'Matthew 6:21', '{"treasure","heart"}', 2),
('a1000000-0000-0000-0000-000000000005', 'I am the light of the world. Whoever follows me will never walk in darkness.', 'John 8:12', '{"light","world","follows","darkness"}', 3),
('a1000000-0000-0000-0000-000000000005', 'Let the little children come to me, and do not hinder them.', 'Matthew 19:14', '{"little","children","hinder"}', 4),
('a1000000-0000-0000-0000-000000000005', 'I am the resurrection and the life.', 'John 11:25', '{"resurrection","life"}', 5),
('a1000000-0000-0000-0000-000000000005', 'Do not let your hearts be troubled. You believe in God; believe also in me.', 'John 14:1', '{"troubled","believe","God"}', 6),
('a1000000-0000-0000-0000-000000000005', 'Peace I leave with you; my peace I give you.', 'John 14:27', '{"peace","leave","give"}', 7),
('a1000000-0000-0000-0000-000000000005', 'I am the vine; you are the branches.', 'John 15:5', '{"vine","branches"}', 8),
('a1000000-0000-0000-0000-000000000005', 'By this everyone will know that you are my disciples, if you love one another.', 'John 13:35', '{"know","disciples","love"}', 9);
