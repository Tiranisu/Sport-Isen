DELETE FROM users;
DELETE FROM matchs;
DELETE FROM fitness;
DELETE FROM notifications;
DELETE FROM sports;
DELETE FROM address_match;


-- --- Populate users table ------------
ALTER SEQUENCE users_id_seq RESTART;
INSERT INTO users (fistname, lastname, age, email, passwd, city, nb_match, fitness_id, notifications, notifications_list) VALUES
('Mark', 'Couty', 35, 'mark.couty@test.fr', '1234', 'Sainte-Luce-sur-Loire', 3, 2, 2, {0,1}),
('Robert', 'Pater', 75, 'robert.pater@test.fr', '1234', 'Carquefou', 28, 2, 1, {0});

-- --- Populate match table ------------
ALTER SEQUENCE match_id_seq RESTART;
INSERT INTO match (name, organization_id, sport_id, address_id, nb_player_min, nb_player_max, date_time, duration, price) VALUES
('Football U8', 0, 0, 0, 0, 10, ("2022-09-15", "10:00"), ("", "2:00"), 15);



-- --- Populate fitness table ------------
ALTER SEQUENCE fitness_id_seq RESTART;
INSERT INTO fitness (type) VALUES
('Begenner'),
('Intermediate'),
('Advenced');

-- --- Populate notifications table ------------
ALTER SEQUENCE notifications_id_seq RESTART;
INSERT INTO notifications (text_notification) VALUES
(" à refusé votre demande d'incription"),
(" à accepté votre demande d'incription");

-- --- Populate sports table ------------
ALTER SEQUENCE sports_id_seq RESTART;
INSERT INTO sports (name) VALUES
('football'),
('golf');

-- --- Populate address_match table ------------
ALTER SEQUENCE address_match_id_seq RESTART;
INSERT INTO address_match (name, street, city, postal_code) VALUES
('Stade du Moulin Boisseau', 'Rue du Moulin Boisseau','Carquefou' , 44470),
('Stade de la Beaujoire', 'Route de Saint-Joseph','Nantes' , 44300),
("Stade municipal", '31bis Rue du Stade','Sainte-Luce-sur-Loire' , 44980);

-- --- Populate note_app table ------------
ALTER SEQUENCE note_app_id_seq RESTART;
INSERT INTO note_app (score) VALUES
(3),
(2),
(5);