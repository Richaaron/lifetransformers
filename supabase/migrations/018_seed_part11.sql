insert into family_tree_challenges (id, title, xp_reward_per_connection) values
('g1000000-0000-0000-0000-000000000001', 'Abrahams Family', 5),
('g1000000-0000-0000-0000-000000000002', 'Davids Family', 5),
('g1000000-0000-0000-0000-000000000003', 'Jacobs Twelve Sons', 5),
('g1000000-0000-0000-0000-000000000004', 'Jesus Lineage', 5);

insert into family_tree_connections (challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) values
('g1000000-0000-0000-0000-000000000001', 'Abraham', 'father of', 'Isaac', '{"Ishmael","Jacob","Esau"}', 'Genesis 21:3', 0),
('g1000000-0000-0000-0000-000000000001', 'Abraham', 'father of', 'Ishmael', '{"Isaac","Jacob","Esau"}', 'Genesis 16:15', 1),
('g1000000-0000-0000-0000-000000000001', 'Isaac', 'father of', 'Jacob', '{"Esau","Ishmael","Joseph"}', 'Genesis 25:26', 2),
('g1000000-0000-0000-0000-000000000001', 'Isaac', 'father of', 'Esau', '{"Jacob","Joseph","Benjamin"}', 'Genesis 25:25', 3),
('g1000000-0000-0000-0000-000000000001', 'Jacob', 'father of', 'Joseph', '{"Benjamin","Judah","Levi"}', 'Genesis 30:24', 4),
('g1000000-0000-0000-0000-000000000001', 'Jacob', 'father of', 'Judah', '{"Joseph","Levi","Reuben"}', 'Genesis 29:35', 5),
('g1000000-0000-0000-0000-000000000001', 'Sarah', 'mother of', 'Isaac', '{"Ishmael","Jacob","Esau"}', 'Genesis 21:2', 6),
('g1000000-0000-0000-0000-000000000001', 'Hagar', 'mother of', 'Ishmael', '{"Isaac","Jacob","Esau"}', 'Genesis 16:15', 7);

insert into family_tree_connections (challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) values
('g1000000-0000-0000-0000-000000000002', 'Jesse', 'father of', 'David', '{"Saul","Jonathan","Samuel"}', '1 Samuel 16:10', 0),
('g1000000-0000-0000-0000-000000000002', 'David', 'father of', 'Solomon', '{"Absalom","Adonijah","Amnon"}', '2 Samuel 12:24', 1),
('g1000000-0000-0000-0000-000000000002', 'David', 'father of', 'Absalom', '{"Solomon","Adonijah","Amnon"}', '2 Samuel 3:3', 2),
('g1000000-0000-0000-0000-000000000002', 'Solomon', 'father of', 'Rehoboam', '{"Abijah","Asa","Jehoshaphat"}', '1 Kings 11:43', 3),
('g1000000-0000-0000-0000-000000000002', 'David', 'husband of', 'Bathsheba', '{"Michal","Abigail","Ahinoam"}', '2 Samuel 11:27', 4),
('g1000000-0000-0000-0000-000000000002', 'Saul', 'father of', 'Jonathan', '{"David","Solomon","Absalom"}', '1 Samuel 14:1', 5),
('g1000000-0000-0000-0000-000000000002', 'Rehoboam', 'father of', 'Abijah', '{"Asa","Jehoshaphat","Joram"}', '1 Kings 14:31', 6),
('g1000000-0000-0000-0000-000000000002', 'Abijah', 'father of', 'Asa', '{"Jehoshaphat","Joram","Ahaziah"}', '1 Kings 15:1', 7);

insert into family_tree_connections (challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) values
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Reuben', '{"Simeon","Levi","Judah"}', 'Genesis 29:32', 0),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Simeon', '{"Reuben","Levi","Judah"}', 'Genesis 29:33', 1),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Levi', '{"Reuben","Simeon","Judah"}', 'Genesis 29:34', 2),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Judah', '{"Reuben","Simeon","Levi"}', 'Genesis 29:35', 3),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Joseph', '{"Benjamin","Dan","Naphtali"}', 'Genesis 30:24', 4),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Benjamin', '{"Joseph","Dan","Naphtali"}', 'Genesis 35:18', 5),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Dan', '{"Naphtali","Gad","Asher"}', 'Genesis 30:6', 6),
('g1000000-0000-0000-0000-000000000003', 'Jacob', 'father of', 'Gad', '{"Asher","Dan","Naphtali"}', 'Genesis 30:11', 7);

insert into family_tree_connections (challenge_id, character1, relationship, character2, wrong_character2, reference, order_index) values
('g1000000-0000-0000-0000-000000000004', 'Abraham', 'ancestor of', 'David', '{"Moses","Joshua","Solomon"}', 'Matthew 1:1-6', 0),
('g1000000-0000-0000-0000-000000000004', 'David', 'ancestor of', 'Joseph', '{"Peter","James","John"}', 'Matthew 1:1-16', 1),
('g1000000-0000-0000-0000-000000000004', 'Joseph', 'father of', 'Jesus', '{"Peter","James","John"}', 'Matthew 1:16', 2),
('g1000000-0000-0000-0000-000000000004', 'Mary', 'mother of', 'Jesus', '{"Elizabeth","Hannah","Ruth"}', 'Luke 1:30-35', 3),
('g1000000-0000-0000-0000-000000000004', 'Jesse', 'ancestor of', 'David', '{"Saul","Solomon","Jonathan"}', 'Ruth 4:17-22', 4),
('g1000000-0000-0000-0000-000000000004', 'Jacob', 'ancestor of', 'Joseph', '{"Abraham","Isaac","Moses"}', 'Matthew 1:16', 5),
('g1000000-0000-0000-0000-000000000004', 'Boaz', 'ancestor of', 'Jesse', '{"Saul","Solomon","Jonathan"}', 'Ruth 4:17-22', 6),
('g1000000-0000-0000-0000-000000000004', 'Obed', 'ancestor of', 'Jesse', '{"Ruth","Naomi","Samuel"}', 'Ruth 4:17-22', 7);
