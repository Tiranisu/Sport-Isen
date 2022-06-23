/*******************************************************************************
Create Date:    2022-06-24
Author:         Enzo Peigne <enzo.peigne@isen-ouest.yncrea.fr>
Author:         Maël Grellier Neau <mael.grellier-neau@isen-ouest.yncrea.fr>
Description:    Populates the tables of the database.
*******************************************************************************/

DELETE FROM fitness;
DELETE FROM sports;
DELETE FROM address;
DELETE FROM users;
DELETE FROM matchs;
DELETE FROM participant;


-- --- Populate fitness table ------------
ALTER SEQUENCE fitness_id_seq RESTART;
INSERT INTO fitness (type) VALUES
('Débutant'),
('Intermédiaire'),
('Avancé');

-- --- Populate sports table ------------
ALTER SEQUENCE sports_id_seq RESTART;
INSERT INTO sports (name) VALUES
('Football'),
('Tennis'),
('Basketball'),
('Handball'),
('Golf');

-- --- Populate address table for match ------------
ALTER SEQUENCE address_id_seq RESTART;
INSERT INTO address (name, street, city, postal_code) VALUES
('Stade du Moulin Boisseau', 'Rue du Moulin Boisseau','Carquefou' , 44470),
('Stade de la Beaujoire', 'Route de Saint-Joseph','Nantes' , 44300),
('UrbanSoccer', '18 Rue Marie Curie', 'Saint-Sébastien-sur-Loire', 44230),
('Complexe Sportif Jean Gauvrit', '6 Rue Louis Armand', 'Carquefou', 44470),
('Stade municipal', '31bis Rue du Stade','Sainte-Luce-sur-Loire' , 44980);


-- --- Populate users table ------------
ALTER SEQUENCE users_id_seq RESTART;
INSERT INTO users (firstname, lastname, age, email, password, nb_match, fitness_id, address_id) VALUES
('Mark', 'Couty', 35, 'mc@test.fr', '$2y$10$Ns7fLvA0z4obW3naPmnS5epzde7DCwNQ.FGWSgH5t8B0cqi0xVmXy', 4, 3, 1),
('Robert', 'Pater', 75, 'rp@test.fr', '$2y$10$Ns7fLvA0z4obW3naPmnS5epzde7DCwNQ.FGWSgH5t8B0cqi0xVmXy', 5, 2, 2),
('Samuel', 'Dubois', NULL, 'sd@test.fr', '$2y$10$Ns7fLvA0z4obW3naPmnS5epzde7DCwNQ.FGWSgH5t8B0cqi0xVmXy', 2, 1, 5),
('Colin', 'Martin', 22, 'cm@test.fr', '$2y$10$Ns7fLvA0z4obW3naPmnS5epzde7DCwNQ.FGWSgH5t8B0cqi0xVmXy', 0, 2, 4),
('Remy', 'Conos', 34, 'rc@test.fr', '$2y$10$Ns7fLvA0z4obW3naPmnS5epzde7DCwNQ.FGWSgH5t8B0cqi0xVmXy', 1, 2, 2);

-- --- Populate score_app table ------------
INSERT INTO score_app (user_id, score) VALUES
(1, 3),
(2, 2),
(3,4),
(4,3),
(5,5);

--- Populate match table ------------
ALTER SEQUENCE matchs_id_seq RESTART;
INSERT INTO matchs (name, score, organization_id, sport_id, address_id, nb_player_min, nb_player_max, date_time, duration, price, best_player_id) VALUES
('Football U8', NULL, 1, 1, 1, 1, 10,'2022-09-15 10:00', '2022-1-1 2:00', 15, NULL),
('Tournoi Tennis', NULL, 2, 2, 4, 1, 10,'2022-6-28 20:00', '2022-1-1 2:00', 15, NULL),
('Concours de Golf', NULL, 2, 3, 1, 1, 10,'2022-07-8 10:00', '2022-1-1 2:00', 15, NULL),
('Futsal', NULL, 2, 1, 3, 1, 10,'2022-07-9 10:00', '2022-1-1 2:00', 15, NULL);


--- Populate participant table ------------
INSERT INTO participant (match_id, user_id, status) VALUES
(1 , 1 , 1),
(1, 2 , 1),
(2, 1 , 1),
(2, 2 , 0),
(3, 2 , 0),
(4, 2 , 2);
