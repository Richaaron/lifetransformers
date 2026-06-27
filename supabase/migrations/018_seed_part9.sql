insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'Who wrote the first five books of the Bible?', 'Moses', '{"Abraham","David","Solomon"}', 'Deuteronomy 31:24', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'How many books are in the Old Testament?', '39', '{"27","46","66"}', null, 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'Which book comes immediately after Genesis?', 'Exodus', '{"Leviticus","Numbers","Deuteronomy"}', null, 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'Which book contains the longest chapter in the Bible?', 'Psalms', '{"Proverbs","Isaiah","Jeremiah"}', 'Psalm 119', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 1), 'Which book is the shortest in the Old Testament?', 'Obadiah', '{"Ruth","Jonah","Joel"}', null, 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'How many books are in the New Testament?', '27', '{"39","46","66"}', null, 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'Which book tells the story of the early church?', 'Acts', '{"Romans","Corinthians","Galatians"}', 'Acts 1:1', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'Which book contains the Sermon on the Mount?', 'Matthew', '{"Mark","Luke","John"}', 'Matthew 5-7', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'Which book is about the end times?', 'Revelation', '{"Daniel","Ezekiel","Isaiah"}', null, 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 2), 'Which book comes last in the Bible?', 'Revelation', '{"Jude","3 John","2 Peter"}', null, 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'What is the central theme of the Bible?', 'Jesus', '{"Law","Prophecy","History"}', null, 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'How many times is love mentioned in the Bible?', 'Over 300', '{"Exactly 100","Under 50","Over 1000"}', null, 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'What does the word Bible mean?', 'Books', '{"Letter","Scroll","Word"}', null, 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'How many chapters are in the Bible?', '1189', '{"666","888","1000"}', null, 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 3), 'What language was most of the Old Testament written in?', 'Hebrew', '{"Greek","Aramaic","Latin"}', null, 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'In what century was the Bible first printed?', '15th century', '{"14th century","16th century","13th century"}', null, 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'Who translated the Bible into Latin?', 'Jerome', '{"Augustine","Origen","Eusebius"}', null, 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'What year was the King James Bible published?', '1611', '{"1511","1711","1411"}', null, 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'Who was the first person to translate the Bible into English?', 'Wycliffe', '{"Tyndale","Cranmer","Coverdale"}', null, 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 4), 'What is the oldest known Bible manuscript?', 'Codex Sinaiticus', '{"Codex Vaticanus","Dead Sea Scrolls","Chester Beatty"}', null, 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'Which book of the Bible has the most chapters?', 'Psalms', '{"Proverbs","Isaiah","Genesis"}', null, 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'Which book contains the genealogy of Jesus?', 'Matthew', '{"Luke","Mark","John"}', null, 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'How many parables did Jesus tell?', 'Around 40', '{"Exactly 12","Exactly 20","Over 100"}', null, 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'Which prophet was swallowed by a whale?', 'Jonah', '{"Elijah","Elisha","Isaiah"}', null, 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000003' and floor_number = 5), 'Who was the mother of Samuel?', 'Hannah', '{"Sarah","Ruth","Esther"}', null, 4);
