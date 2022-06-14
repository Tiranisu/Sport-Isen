DELETE FROM users;
DELETE FROM matchs;
DELETE FROM fitness;
DELETE FROM notifications;
DELETE FROM sports;
DELETE FROM address_match;

ALTER SEQUENCE users_id_seq RESTART;
INSERT INTO users (id, fistname, lastname, age, email, passwd, city, link_image, nb_match, fitness_id, notifications, notifications_list) VALUES
(),
();


ALTER SEQUENCE fitness_id_seq RESTART;
INSERT INTO fitness (type) VALUES
("Begenner"),
("Intermediate"),
("Advenced");




