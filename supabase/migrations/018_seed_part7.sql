insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'How many days did God take to create the world?', 'Six', '{"Seven","Five","Four"}', 'Genesis 1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'What did God create on the first day?', 'Light', '{"Sky","Land","Animals"}', 'Genesis 1:3', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'Who was the first man?', 'Adam', '{"Noah","Abraham","Moses"}', 'Genesis 2:7', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'What did God create on the fourth day?', 'Sun moon and stars', '{"Animals","Land","Sea creatures"}', 'Genesis 1:14-19', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 1), 'What did God create on the sixth day?', 'Land animals and humans', '{"Fish","Birds","Plants"}', 'Genesis 1:24-31', 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who was called the father of many nations?', 'Abraham', '{"Isaac","Jacob","David"}', 'Genesis 17:4', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who had a coat of many colors?', 'Joseph', '{"Benjamin","Judah","Levi"}', 'Genesis 37:3', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who wrestled with God?', 'Jacob', '{"Moses","Abraham","Isaac"}', 'Genesis 32:24', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who was sacrificed on Mount Moriah?', 'Isaac', '{"Jacob","Joseph","Benjamin"}', 'Genesis 22:1-14', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 2), 'Who did Abraham send away at age 100?', 'Ishmael', '{"Isaac","Jacob","Esau"}', 'Genesis 21:14', 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'What sea did Moses part?', 'Red Sea', '{"Jordan River","Sea of Galilee","Mediterranean"}', 'Exodus 14:21', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'How many plagues did God send on Egypt?', 'Ten', '{"Seven","Three","Five"}', 'Exodus 7-12', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'How many commandments were given?', 'Ten', '{"Seven","Twelve","Five"}', 'Exodus 20', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'What did the Israelites eat in the wilderness?', 'Manna', '{"Bread","Fish","Meat"}', 'Exodus 16', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 3), 'What was the golden idol the Israelites made?', 'Golden Calf', '{"Golden Snake","Golden Lion","Golden Eagle"}', 'Exodus 32', 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who killed the Canaanite general Sisera?', 'Deborah', '{"Ruth","Esther","Hannah"}', 'Judges 4:17-22', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who had a Nazirite vow from birth?', 'Samson', '{"Gideon","Jephthah","Samuel"}', 'Judges 13:5', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who tested God with a fleece?', 'Gideon', '{"Samson","Jephthah","Samuel"}', 'Judges 6:36-40', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who was a judge and the last prophet of the Old Testament era?', 'Samuel', '{"Gideon","Samson","Eli"}', '1 Samuel 3', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 4), 'Who vowed to sacrifice whatever came out of his house?', 'Jephthah', '{"Gideon","Samson","Samuel"}', 'Judges 11:30-31', 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Who was the first king of Israel?', 'Saul', '{"David","Solomon","Samuel"}', '1 Samuel 10:1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Who built the first temple in Jerusalem?', 'Solomon', '{"David","Saul","Ahab"}', '1 Kings 6:1', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Who was the wisest man who ever lived?', 'Solomon', '{"David","Daniel","Isaiah"}', '1 Kings 4:30', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Which king was known for his great fall and repentance?', 'David', '{"Saul","Solomon","Ahab"}', '2 Samuel 12:1-14', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000001' and floor_number = 5), 'Who was the wicked wife of King Ahab?', 'Jezebel', '{"Bathsheba","Esther","Delilah"}', '1 Kings 16:31', 4);
