insert into who_said_it_quizzes (id, title, description, difficulty, xp_reward) values
('b1000000-0000-0000-0000-000000000001', 'Old Testament Speakers', 'Identify who spoke famous Old Testament quotes.', 'easy', 10),
('b1000000-0000-0000-0000-000000000002', 'New Testament Speakers', 'Match New Testament quotes to their speakers.', 'medium', 15),
('b1000000-0000-0000-0000-000000000003', 'Prophets and Kings', 'Test your knowledge of prophetic and royal speeches.', 'hard', 20),
('b1000000-0000-0000-0000-000000000004', 'Women of the Bible', 'Identify quotes from remarkable women of the Bible.', 'medium', 15),
('b1000000-0000-0000-0000-000000000005', 'Famous Last Words', 'Match the final words of biblical figures.', 'hard', 20);

insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000001', 'I am the Lord your God, who brought you out of Egypt.', 'God', '{"Moses","Abraham","David"}', 'Exodus 20:2', 0),
('b1000000-0000-0000-0000-000000000001', 'Here I am; send me.', 'Isaiah', '{"Jeremiah","Elijah","Moses"}', 'Isaiah 6:8', 1),
('b1000000-0000-0000-0000-000000000001', 'The Lord is my rock, my fortress, and my deliverer.', 'David', '{"Solomon","Moses","Joshua"}', 'Psalm 18:2', 2),
('b1000000-0000-0000-0000-000000000001', 'I can do all things through God who gives me strength.', 'Samson', '{"David","Gideon","Joshua"}', 'Judges 16:30', 3),
('b1000000-0000-0000-0000-000000000001', 'Before I formed you in the womb I knew you.', 'God', '{"Jeremiah","Isaiah","Moses"}', 'Jeremiah 1:5', 4),
('b1000000-0000-0000-0000-000000000001', 'The Lord will fight for you; you need only to be still.', 'Moses', '{"Aaron","Joshua","Caleb"}', 'Exodus 14:14', 5),
('b1000000-0000-0000-0000-000000000001', 'As for me and my household, we will serve the Lord.', 'Joshua', '{"Moses","David","Solomon"}', 'Joshua 24:15', 6),
('b1000000-0000-0000-0000-000000000001', 'The Lord is my shepherd; I shall not want.', 'David', '{"Solomon","Moses","Asaph"}', 'Psalm 23:1', 7);

insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000002', 'I am the way, the truth, and the life.', 'Jesus', '{"Paul","Peter","John"}', 'John 14:6', 0),
('b1000000-0000-0000-0000-000000000002', 'Love is patient, love is kind.', 'Paul', '{"Peter","John","James"}', '1 Corinthians 13:4', 1),
('b1000000-0000-0000-0000-000000000002', 'For by grace you have been saved through faith.', 'Paul', '{"Peter","James","Jesus"}', 'Ephesians 2:8', 2),
('b1000000-0000-0000-0000-000000000002', 'You are the Christ, the Son of the living God.', 'Peter', '{"John","Andrew","Thomas"}', 'Matthew 16:16', 3),
('b1000000-0000-0000-0000-000000000002', 'In the beginning was the Word, and the Word was with God.', 'John', '{"Paul","Peter","Luke"}', 'John 1:1', 4),
('b1000000-0000-0000-0000-000000000002', 'Repent and be baptized, every one of you.', 'Peter', '{"Paul","John","James"}', 'Acts 2:38', 5),
('b1000000-0000-0000-0000-000000000002', 'I have been crucified with Christ and I no longer live.', 'Paul', '{"Peter","John","Barnabas"}', 'Galatians 2:20', 6),
('b1000000-0000-0000-0000-000000000002', 'My grace is sufficient for you, for my power is made perfect in weakness.', 'Paul', '{"Peter","Timothy","Silas"}', '2 Corinthians 12:9', 7);

insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000003', 'Behold, I am doing a new thing; now it springs forth.', 'Isaiah', '{"Jeremiah","Ezekiel","Daniel"}', 'Isaiah 43:19', 0),
('b1000000-0000-0000-0000-000000000003', 'For I know the plans I have for you, declares the Lord.', 'God', '{"Jeremiah","Isaiah","Ezekiel"}', 'Jeremiah 29:11', 1),
('b1000000-0000-0000-0000-000000000003', 'He has told you, O man, what is good.', 'Micah', '{"Isaiah","Hosea","Amos"}', 'Micah 6:8', 2),
('b1000000-0000-0000-0000-000000000003', 'Write the vision and make it plain on tablets.', 'Habakkuk', '{"Haggai","Zechariah","Malachi"}', 'Habakkuk 2:2', 3),
('b1000000-0000-0000-0000-000000000003', 'I will raise up for them a prophet like you from among their brothers.', 'God', '{"Moses","Joshua","Samuel"}', 'Deuteronomy 18:18', 4),
('b1000000-0000-0000-0000-000000000003', 'The Lord is my strength and my song; he has become my salvation.', 'Moses', '{"Miriam","Deborah","Hannah"}', 'Exodus 15:2', 5),
('b1000000-0000-0000-0000-000000000003', 'Is there no balm in Gilead? Is there no physician there?', 'Jeremiah', '{"Ezekiel","Hosea","Joel"}', 'Jeremiah 8:22', 6),
('b1000000-0000-0000-0000-000000000003', 'But let justice roll on like a river, righteousness like a never-failing stream.', 'Amos', '{"Micah","Hosea","Isaiah"}', 'Amos 5:24', 7);

insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000004', 'Where you go I will go, and where you stay I will stay.', 'Ruth', '{"Naomi","Esther","Hannah"}', 'Ruth 1:16', 0),
('b1000000-0000-0000-0000-000000000004', 'If I perish, I perish.', 'Esther', '{"Ruth","Deborah","Abigail"}', 'Esther 4:16', 1),
('b1000000-0000-0000-0000-000000000004', 'The Lord has done remarkable things for me.', 'Hannah', '{"Mary","Elizabeth","Sarah"}', '1 Samuel 2:1', 2),
('b1000000-0000-0000-0000-000000000004', 'My soul glorifies the Lord and my spirit rejoices in God my Savior.', 'Mary', '{"Elizabeth","Hannah","Ruth"}', 'Luke 1:46-47', 3),
('b1000000-0000-0000-0000-000000000004', 'Blessed are you among women, and blessed is the child you will bear!', 'Elizabeth', '{"Mary","Sarah","Rebecca"}', 'Luke 1:42', 4),
('b1000000-0000-0000-0000-000000000004', 'Speak, for your servant is listening.', 'Hannah', '{"Deborah","Ruth","Esther"}', '1 Samuel 3:10', 5),
('b1000000-0000-0000-0000-000000000004', 'The Lord has vindicated me; he has shown his justice on my behalf.', 'Hannah', '{"Mary","Ruth","Abigail"}', '1 Samuel 2:1', 6),
('b1000000-0000-0000-0000-000000000004', 'Do not be afraid. You will not be put to shame.', 'Isaiah', '{"Mary","Deborah","Ruth"}', 'Isaiah 54:4', 7);

insert into who_said_it_questions (quiz_id, quote, correct_speaker, wrong_speakers, reference, order_index) values
('b1000000-0000-0000-0000-000000000005', 'I have fought the good fight, I have finished the race, I have kept the faith.', 'Paul', '{"Peter","John","James"}', '2 Timothy 4:7', 0),
('b1000000-0000-0000-0000-000000000005', 'Father, into your hands I commit my spirit.', 'Jesus', '{"Stephen","Paul","Peter"}', 'Luke 23:46', 1),
('b1000000-0000-0000-0000-000000000005', 'It is finished.', 'Jesus', '{"Paul","Peter","John"}', 'John 19:30', 2),
('b1000000-0000-0000-0000-000000000005', 'Lord Jesus, receive my spirit.', 'Stephen', '{"Paul","Peter","James"}', 'Acts 7:59', 3),
('b1000000-0000-0000-0000-000000000005', 'See, I am coming soon; my reward is with me.', 'Jesus', '{"John","Paul","Peter"}', 'Revelation 22:12', 4),
('b1000000-0000-0000-0000-000000000005', 'Now I commit you to God and to the word of his grace.', 'Paul', '{"Peter","Barnabas","Timothy"}', 'Acts 20:32', 5),
('b1000000-0000-0000-0000-000000000005', 'The time of my departure has come.', 'Paul', '{"Peter","John","Timothy"}', '2 Timothy 4:6', 6),
('b1000000-0000-0000-0000-000000000005', 'Truly, I tell you, today you will be with me in paradise.', 'Jesus', '{"Peter","Paul","John"}', 'Luke 23:43', 7);
