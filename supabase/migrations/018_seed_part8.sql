insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'Which gospel is known as the Synoptic Gospel?', 'Mark', '{"John","James","Peter"}', 'Mark 1:1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'Who was the tax collector called by Jesus?', 'Matthew', '{"Mark","Luke","Peter"}', 'Matthew 9:9', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'Who betrayed Jesus?', 'Judas', '{"Peter","John","Thomas"}', 'Matthew 26:14-16', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'How many disciples did Jesus choose?', 'Twelve', '{"Ten","Seven","Thirteen"}', 'Mark 3:14', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 1), 'Where was Jesus born?', 'Bethlehem', '{"Nazareth","Jerusalem","Capernaum"}', 'Luke 2:4-7', 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Who preached the first sermon in Acts?', 'Peter', '{"Paul","John","James"}', 'Acts 2:14', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Who was converted on the road to Damascus?', 'Paul', '{"Peter","Barnabas","Silas"}', 'Acts 9:1-19', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Who was the first Christian martyr?', 'Stephen', '{"Paul","Peter","James"}', 'Acts 7:54-60', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Who was the first Gentile convert?', 'Cornelius', '{"Lydia","Sergius","Dionysius"}', 'Acts 10:1-48', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 2), 'Who accompanied Paul on his first missionary journey?', 'Barnabas', '{"Silas","Timothy","Luke"}', 'Acts 13:2-3', 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'Which epistle is known as the epistle of joy?', 'Philippians', '{"Ephesians","Colossians","Galatians"}', 'Philippians 1:1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'Which epistle discusses the armor of God?', 'Ephesians', '{"Philippians","Colossians","Thessalonians"}', 'Ephesians 6:10-18', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'Who wrote the book of Romans?', 'Paul', '{"Peter","John","James"}', 'Romans 1:1', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'Which epistle was written to correct false teachings?', 'Colossians', '{"Philippians","Ephesians","Galatians"}', 'Colossians 2:8', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 3), 'Which epistle contains the love chapter?', '1 Corinthians', '{"1 Thessalonians","1 Timothy","Hebrews"}', '1 Corinthians 13', 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'Which letter was written to Philemon?', 'Paul', '{"Peter","John","James"}', 'Philemon 1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'Which letter addresses church discipline?', '1 Corinthians', '{"Galatians","Ephesians","Philippians"}', '1 Corinthians 5', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'Which letter discusses spiritual gifts?', '1 Corinthians', '{"1 Romans","Ephesians","1 Thessalonians"}', '1 Corinthians 12', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'Which letter was written from prison?', 'Ephesians', '{"Romans","1 Thessalonians","2 Thessalonians"}', 'Ephesians 3:1', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 4), 'Which letter discusses the second coming of Christ?', '1 Thessalonians', '{"2 Thessalonians","Hebrews","James"}', '1 Thessalonians 4:13-18', 4);

insert into trivia_floor_questions (floor_id, question, correct_answer, wrong_answers, reference, order_index) values
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'Who wrote the book of Revelation?', 'John', '{"Paul","Peter","James"}', 'Revelation 1:1', 0),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'How many churches are addressed in Revelation?', 'Seven', '{"Five","Twelve","Ten"}', 'Revelation 1:4', 1),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'What is the new name of Jerusalem in Revelation?', 'New Jerusalem', '{"Holy City","City of God","Heavenly City"}', 'Revelation 21:2', 2),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'Who opens the seven seals?', 'The Lamb', '{"The Father","The Spirit","An Angel"}', 'Revelation 5:5-7', 3),
((select id from trivia_floors where tower_id = 'e1000000-0000-0000-0000-000000000002' and floor_number = 5), 'What is the final battle called?', 'Armageddon', '{"Great Tribulation","Judgment Day","Millennium"}', 'Revelation 16:16', 4);
