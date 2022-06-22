DELETE FROM fitness;
DELETE FROM sports;
DELETE FROM address;
DELETE FROM users;
DELETE FROM notifications;
DELETE FROM matchs;
DELETE FROM participant;


-- --- Populate fitness table ------------
ALTER SEQUENCE fitness_id_seq RESTART;
INSERT INTO fitness (type) VALUES
('Beginner'),
('Intermediate'),
('Advanced');

-- --- Populate sports table ------------
ALTER SEQUENCE sports_id_seq RESTART;
INSERT INTO sports (name) VALUES
('Football'),
('Tennis'),
('Golf');

-- --- Populate address table for match ------------
ALTER SEQUENCE address_id_seq RESTART;
INSERT INTO address (name, street, city, postal_code) VALUES
('Stade du Moulin Boisseau', 'Rue du Moulin Boisseau','Carquefou' , 44470),
('Stade de la Beaujoire', 'Route de Saint-Joseph','Nantes' , 44300),
('Stade municipal', '31bis Rue du Stade','Sainte-Luce-sur-Loire' , 44980);


-- --- Populate address table for users ------------
-- INSERT INTO address (city, postal_code) VALUES
-- ('Sainte-Luce-sur-Loire', 44980),
-- ('Carquefou', 44470);

-- --- Populate users table ------------
ALTER SEQUENCE users_id_seq RESTART;
INSERT INTO users (firstname, lastname, age, email, password, nb_match, fitness_id, address_id) VALUES
('Mark', 'Couty', 35, 'mc@test.fr', '$2y$10$Ns7fLvA0z4obW3naPmnS5epzde7DCwNQ.FGWSgH5t8B0cqi0xVmXy', 4, 3, 1),
('Robert', 'Pater', 75, 'rp@test.fr', '$2y$10$Ns7fLvA0z4obW3naPmnS5epzde7DCwNQ.FGWSgH5t8B0cqi0xVmXy', 5, 2, 2);

-- --- Populate notifications table ------------
ALTER SEQUENCE notifications_id_seq RESTART;
INSERT INTO notifications (description, status, user_id) VALUES
(' à refusé votre demande d incription', false , 1),
(' à accepté votre demande d incription', true, 2);

-- --- Populate score_app table ------------
INSERT INTO score_app (user_id, score) VALUES
(1, 3),
(2, 2);

--- Populate match table ------------
ALTER SEQUENCE matchs_id_seq RESTART;
INSERT INTO matchs (name, score, organization_id, sport_id, address_id, nb_player_min, nb_player_max, date_time, duration, price, best_player_id) VALUES
('Football U8', NULL, 1, 1, 1, 1, 10,'2022-09-15 10:00', '2022-1-1 2:00', 15, NULL);

--- Populate participant table ------------
INSERT INTO participant (match_id, user_id, status) VALUES
(1 , 1 , 1),
(1, 2 , 1),
(1, 2 , 1),
(1, 2 , 2),
(1, 2 , 2),
(1, 2 , 3),
(1, 2 , 3);
