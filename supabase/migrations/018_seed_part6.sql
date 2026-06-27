insert into trivia_towers (id, title, xp_reward_per_floor, total_floors) values
('e1000000-0000-0000-0000-000000000001', 'Beginner Tower', 10, 5),
('e1000000-0000-0000-0000-000000000002', 'Advanced Tower', 15, 5),
('e1000000-0000-0000-0000-000000000003', 'Master Tower', 20, 5);

insert into trivia_floors (tower_id, floor_number, floor_title, difficulty, xp_bonus) values
('e1000000-0000-0000-0000-000000000001', 1, 'Creation Floor', 'easy', 5),
('e1000000-0000-0000-0000-000000000001', 2, 'Patriarchs Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000001', 3, 'Exodus Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000001', 4, 'Judges Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000001', 5, 'Kings Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000002', 1, 'Gospels Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000002', 2, 'Acts Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000002', 3, 'Epistles Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000002', 4, 'Letters Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000002', 5, 'Prophecy Floor', 'expert', 20),
('e1000000-0000-0000-0000-000000000003', 1, 'OT Survey Floor', 'medium', 10),
('e1000000-0000-0000-0000-000000000003', 2, 'NT Survey Floor', 'hard', 15),
('e1000000-0000-0000-0000-000000000003', 3, 'Theology Floor', 'expert', 20),
('e1000000-0000-0000-0000-000000000003', 4, 'Church History Floor', 'expert', 20),
('e1000000-0000-0000-0000-000000000003', 5, 'Masters Challenge', 'master', 25);
