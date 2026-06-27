insert into story_quizzes (id, title, description, difficulty, xp_reward) values
('d1000000-0000-0000-0000-000000000001', 'Famous Bible Stories', 'Identify well-known Bible stories from clues.', 'easy', 10),
('d1000000-0000-0000-0000-000000000002', 'Miracles of Jesus', 'Guess the miracle from the description.', 'medium', 15),
('d1000000-0000-0000-0000-000000000003', 'Old Testament Adventures', 'Identify stories from the Old Testament.', 'hard', 20),
('d1000000-0000-0000-0000-000000000004', 'Parables of Jesus', 'Identify the parable from the description.', 'medium', 15),
('d1000000-0000-0000-0000-000000000005', 'Heroes of Faith', 'Identify the hero of faith from the story.', 'hard', 20);

insert into story_questions (quiz_id, emoji_clue, description, correct_story, wrong_stories, reference, order_index) values
('d1000000-0000-0000-0000-000000000001', null, 'A man and woman ate fruit from a forbidden tree and were expelled from a garden.', 'The Fall of Man', '{"Noah Ark","David Goliath","Jonah Whale"}', 'Genesis 3', 0),
('d1000000-0000-0000-0000-000000000001', null, 'God sent a great flood to cleanse the earth; one family was saved on a boat.', 'Noah Ark', '{"Tower of Babel","Sodom Gomorrah","Moses Red Sea"}', 'Genesis 6-9', 1),
('d1000000-0000-0000-0000-000000000001', null, 'Three wise men followed a star to visit a newborn king in Bethlehem.', 'The Nativity', '{"Abraham Sacrifice","Jacob Ladder","Joseph Dreams"}', 'Matthew 2', 2),
('d1000000-0000-0000-0000-000000000001', null, 'A young shepherd defeated a giant warrior with a sling and a stone.', 'David and Goliath', '{"Samson Lion","Joshua Walls","Gideon Fleece"}', '1 Samuel 17', 3),
('d1000000-0000-0000-0000-000000000001', null, 'God spoke to Moses through a burning bush in the desert.', 'The Burning Bush', '{"Tower of Babel","Jacob Ladder","Manna Heaven"}', 'Exodus 3', 4),
('d1000000-0000-0000-0000-000000000001', null, 'A great city walls collapsed when the Israelites marched and blew trumpets.', 'Fall of Jericho', '{"Sodom Gomorrah","Red Sea Crossing","Jordan River"}', 'Joshua 6', 5),
('d1000000-0000-0000-0000-000000000001', null, 'Joseph interpreted the dreams of Pharaoh about seven years of plenty and famine.', 'Joseph Dreams', '{"Daniel Lions","Moses Plagues","Elijah Ravens"}', 'Genesis 41', 6),
('d1000000-0000-0000-0000-000000000001', null, 'Daniel was thrown into a lions den but emerged unharmed.', 'Daniel in Lions Den', '{"Shadrach Fire","Joseph Pit","Moses Bush"}', 'Daniel 6', 7);

insert into story_questions (quiz_id, emoji_clue, description, correct_story, wrong_stories, reference, order_index) values
('d1000000-0000-0000-0000-000000000002', null, 'Jesus fed a huge crowd with just five loaves and two fish.', 'Feeding the 5000', '{"Water to Wine","Walking Water","Healing Blind"}', 'John 6:1-14', 0),
('d1000000-0000-0000-0000-000000000002', null, 'Jesus walked on the Sea of Galilee during a storm.', 'Walking on Water', '{"Calming Storm","Raising Lazarus","Transfiguration"}', 'Matthew 14:22-33', 1),
('d1000000-0000-0000-0000-000000000002', null, 'Jesus turned water into wine at a wedding in Cana.', 'Water to Wine', '{"Feeding 5000","Healing Leper","Cursing Fig Tree"}', 'John 2:1-11', 2),
('d1000000-0000-0000-0000-000000000002', null, 'Jesus restored sight to a man who was born blind.', 'Healing the Blind Man', '{"Healing Deaf","Healing Lame","Cleansing Leper"}', 'John 9:1-7', 3),
('d1000000-0000-0000-0000-000000000002', null, 'Jesus calmed a violent storm on the Sea of Galilee with a word.', 'Calming the Storm', '{"Walking Water","Feeding 5000","Healing Sick"}', 'Mark 4:35-41', 4),
('d1000000-0000-0000-0000-000000000002', null, 'Jesus raised Lazarus from the dead after four days in the tomb.', 'Raising Lazarus', '{"Healing Sick","Cleansing Leper","Transfiguration"}', 'John 11:1-44', 5),
('d1000000-0000-0000-0000-000000000002', null, 'Jesus told Peter to find a coin in the mouth of a fish to pay the temple tax.', 'Coin in Fish Mouth', '{"Feeding 5000","Water to Wine","Walking Water"}', 'Matthew 17:24-27', 6),
('d1000000-0000-0000-0000-000000000002', null, 'Jesus multiplied seven loaves and a few small fish to feed four thousand.', 'Feeding the 4000', '{"Feeding 5000","Water to Wine","Healing Blind"}', 'Matthew 15:32-39', 7);
