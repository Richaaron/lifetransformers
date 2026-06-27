insert into promise_match_challenges (id, title, description, difficulty, xp_reward_per_match) values
('h1000000-0000-0000-0000-000000000001', 'Old Testament Promises', 'Match promises from the Old Testament to their references.', 'easy', 5),
('h1000000-0000-0000-0000-000000000002', 'New Testament Promises', 'Match promises from the New Testament to their references.', 'medium', 8),
('h1000000-0000-0000-0000-000000000003', 'Comfort Promises', 'Find comfort in these Bible promises.', 'hard', 10),
('h1000000-0000-0000-0000-000000000004', 'Protection Promises', 'God promises to protect his people.', 'medium', 8),
('h1000000-0000-0000-0000-000000000005', 'Provision Promises', 'God promises to provide for his people.', 'hard', 10);

insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000001', 'I will make you a great nation.', 'Genesis 12:2', '{"Genesis 15:1","Genesis 17:6","Genesis 28:14"}', 0),
('h1000000-0000-0000-0000-000000000001', 'I will never leave you nor forsake you.', 'Deuteronomy 31:6', '{"Joshua 1:5","Hebrews 13:5","Psalm 37:28"}', 1),
('h1000000-0000-0000-0000-000000000001', 'The Lord will fight for you; you need only to be still.', 'Exodus 14:14', '{"Numbers 14:14","Deuteronomy 20:4","Isaiah 30:15"}', 2),
('h1000000-0000-0000-0000-000000000001', 'You shall be my treasured possession.', 'Exodus 19:5', '{"Deuteronomy 7:6","1 Peter 2:9","Malachi 3:17"}', 3),
('h1000000-0000-0000-0000-000000000001', 'I will give you rest.', 'Exodus 33:14', '{"Matthew 11:28","Joshua 1:13","2 Chronicles 15:2"}', 4),
('h1000000-0000-0000-0000-000000000001', 'A land flowing with milk and honey.', 'Exodus 3:8', '{"Leviticus 20:24","Numbers 14:8","Deuteronomy 6:3"}', 5);

insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000002', 'All things work together for good.', 'Romans 8:28', '{"Philippians 1:6","2 Corinthians 4:17","James 1:2"}', 0),
('h1000000-0000-0000-0000-000000000002', 'My grace is sufficient for you.', '2 Corinthians 12:9', '{"Philippians 4:13","2 Timothy 1:12","Hebrews 4:16"}', 1),
('h1000000-0000-0000-0000-000000000002', 'God will supply every need.', 'Philippians 4:19', '{"Matthew 6:31-33","Luke 12:30","Psalm 84:11"}', 2),
('h1000000-0000-0000-0000-000000000002', 'No temptation has overtaken you except what is common.', '1 Corinthians 10:13', '{"James 1:2","2 Peter 2:9","Hebrews 2:18"}', 3),
('h1000000-0000-0000-0000-000000000002', 'I can do all things through him who strengthens me.', 'Philippians 4:13', '{"2 Corinthians 12:9","Isaiah 40:31","Psalm 37:4"}', 4),
('h1000000-0000-0000-0000-000000000002', 'He who began a good work in you will carry it on to completion.', 'Philippians 1:6', '{"2 Corinthians 5:17","Romans 8:28","Ephesians 2:10"}', 5);

insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000003', 'Come to me, all you who are weary and burdened.', 'Matthew 11:28', '{"Psalm 55:22","1 Peter 5:7","Isaiah 40:31"}', 0),
('h1000000-0000-0000-0000-000000000003', 'Cast all your anxiety on him because he cares for you.', '1 Peter 5:7', '{"Philippians 4:6-7","Psalm 37:5","Proverbs 3:5-6"}', 1),
('h1000000-0000-0000-0000-000000000003', 'He gives strength to the weary.', 'Isaiah 40:29', '{"Psalm 73:26","2 Corinthians 12:9","Isaiah 41:10"}', 2),
('h1000000-0000-0000-0000-000000000003', 'The Lord is close to the brokenhearted.', 'Psalm 34:18', '{"Psalm 147:3","Psalm 55:22","Isaiah 61:1"}', 3),
('h1000000-0000-0000-0000-000000000003', 'He heals the brokenhearted and binds up their wounds.', 'Psalm 147:3', '{"Psalm 34:18","Isaiah 61:1","Jeremiah 30:17"}', 4),
('h1000000-0000-0000-0000-000000000003', 'You will keep in perfect peace those whose minds are steadfast.', 'Isaiah 26:3', '{"Psalm 119:165","John 14:27","Philippians 4:7"}', 5);

insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000004', 'He will cover you with his feathers.', 'Psalm 91:4', '{"Psalm 91:1","Psalm 121:7","Isaiah 54:17"}', 0),
('h1000000-0000-0000-0000-000000000004', 'No weapon formed against you shall prosper.', 'Isaiah 54:17', '{"Psalm 91:4","Romans 8:31","2 Timothy 1:7"}', 1),
('h1000000-0000-0000-0000-000000000004', 'The Lord is my refuge and my fortress.', 'Psalm 91:2', '{"Psalm 46:1","Psalm 121:7","Isaiah 41:10"}', 2),
('h1000000-0000-0000-0000-000000000004', 'He will command his angels concerning you.', 'Psalm 91:11', '{"Psalm 91:4","Hebrews 1:14","Daniel 6:22"}', 3),
('h1000000-0000-0000-0000-000000000004', 'I will be with you when you pass through the waters.', 'Isaiah 43:2', '{"Psalm 23:4","Joshua 1:9","Deuteronomy 31:6"}', 4),
('h1000000-0000-0000-0000-000000000004', 'The Lord will keep you from all harm.', 'Psalm 121:7', '{"Psalm 91:3","Proverbs 2:8","2 Thessalonians 3:3"}', 5);

insert into promise_match_pairs (challenge_id, promise_text, correct_reference, wrong_references, order_index) values
('h1000000-0000-0000-0000-000000000005', 'My God will meet all your needs.', 'Philippians 4:19', '{"Matthew 6:31-33","2 Corinthians 9:8","Psalm 23:1"}', 0),
('h1000000-0000-0000-0000-000000000005', 'The Lord is my shepherd; I shall not want.', 'Psalm 23:1', '{"Psalm 34:10","Isaiah 55:2","John 10:10"}', 1),
('h1000000-0000-0000-0000-000000000005', 'Seek first his kingdom and his righteousness.', 'Matthew 6:33', '{"Psalm 37:4","Proverbs 3:9-10","Malachi 3:10"}', 2),
('h1000000-0000-0000-0000-000000000005', 'Honor the Lord with your wealth.', 'Proverbs 3:9', '{"Malachi 3:10","2 Corinthians 9:6","Deuteronomy 8:18"}', 3),
('h1000000-0000-0000-0000-000000000005', 'Bring the whole tithe into the storehouse.', 'Malachi 3:10', '{"Proverbs 3:9","2 Corinthians 9:7","Deuteronomy 14:23"}', 4),
('h1000000-0000-0000-0000-000000000005', 'God is able to bless you abundantly.', '2 Corinthians 9:8', '{"Philippians 4:19","Ephesians 3:20","Romans 8:32"}', 5);
