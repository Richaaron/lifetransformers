insert into bookshelf_challenges (id, title, section, xp_reward) values
('c1000000-0000-0000-0000-000000000001', 'First 5 Books of the Bible', 'old_testament', 15),
('c1000000-0000-0000-0000-000000000002', 'Gospels in Order', 'new_testament', 15),
('c1000000-0000-0000-0000-000000000003', 'Major Prophets', 'old_testament', 20),
('c1000000-0000-0000-0000-000000000004', 'Pauline Epistles', 'new_testament', 20),
('c1000000-0000-0000-0000-000000000005', 'Historical Books', 'old_testament', 25);

insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000001', 'Genesis', 1),
('c1000000-0000-0000-0000-000000000001', 'Exodus', 2),
('c1000000-0000-0000-0000-000000000001', 'Leviticus', 3),
('c1000000-0000-0000-0000-000000000001', 'Numbers', 4),
('c1000000-0000-0000-0000-000000000001', 'Deuteronomy', 5);

insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000002', 'Matthew', 1),
('c1000000-0000-0000-0000-000000000002', 'Mark', 2),
('c1000000-0000-0000-0000-000000000002', 'Luke', 3),
('c1000000-0000-0000-0000-000000000002', 'John', 4);

insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000003', 'Isaiah', 1),
('c1000000-0000-0000-0000-000000000003', 'Jeremiah', 2),
('c1000000-0000-0000-0000-000000000003', 'Lamentations', 3),
('c1000000-0000-0000-0000-000000000003', 'Ezekiel', 4),
('c1000000-0000-0000-0000-000000000003', 'Daniel', 5);

insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000004', 'Romans', 1),
('c1000000-0000-0000-0000-000000000004', '1 Corinthians', 2),
('c1000000-0000-0000-0000-000000000004', '2 Corinthians', 3),
('c1000000-0000-0000-0000-000000000004', 'Galatians', 4),
('c1000000-0000-0000-0000-000000000004', 'Ephesians', 5),
('c1000000-0000-0000-0000-000000000004', 'Philippians', 6),
('c1000000-0000-0000-0000-000000000004', 'Colossians', 7);

insert into bookshelf_books (challenge_id, book_name, correct_order) values
('c1000000-0000-0000-0000-000000000005', 'Joshua', 1),
('c1000000-0000-0000-0000-000000000005', 'Judges', 2),
('c1000000-0000-0000-0000-000000000005', 'Ruth', 3),
('c1000000-0000-0000-0000-000000000005', '1 Samuel', 4),
('c1000000-0000-0000-0000-000000000005', '2 Samuel', 5),
('c1000000-0000-0000-0000-000000000005', '1 Kings', 6),
('c1000000-0000-0000-0000-000000000005', '2 Kings', 7),
('c1000000-0000-0000-0000-000000000005', '1 Chronicles', 8),
('c1000000-0000-0000-0000-000000000005', '2 Chronicles', 9);
