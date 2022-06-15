DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS matchs CASCADE;
DROP TABLE IF EXISTS fitness CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS sports CASCADE;
DROP TABLE IF EXISTS address_match CASCADE;
DROP TABLE IF EXISTS note_app CASCADE;

-- Table fitness
CREATE TABLE fitness (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL
);

-- Table notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    text_notification VARCHAR(50) NOT NULL
);

-- Table sports
CREATE TABLE sports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Table address
CREATE TABLE address_match (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50), -- name of the place
    num_street VARCHAR(50),
    city VARCHAR(50) NOT NULL,
    postal_code NUMERIC(5,0) NOT NULL
);

 -- Table note_app
CREATE TABLE note_app(
    id SERIAL PRIMARY KEY,
    score INTEGER
);

-- Table users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fistname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(50) NOT NULL,
    passwd VARCHAR(50) NOT NULL,
    address_id INTEGER NOT NULL,
    link_image VARCHAR(50),
    nb_match INTEGER NOT NULL,
    fitness_id INTEGER NOT NULL,
    notifications INTEGER NOT NULL,
    notifications_list INTEGER[],
    access_token VARCHAR(50),

    FOREIGN KEY (fitness_id) REFERENCES fitness(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- Table matchs
CREATE TABLE matchs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    organization_id INTEGER,
    sport_id INTEGER,
    address_id INTEGER,
    nb_player_min INTEGER,
    nb_player_max INTEGER,
    date_time TIMESTAMP,
    duration TIMESTAMP,
    price FLOAT,
    best_player INTEGER,
    list_player_accepted INTEGER[],
    list_player_waiting INTEGER[],

    FOREIGN KEY(organization_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(sport_id) REFERENCES sports(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(address_id) REFERENCES address_match(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);
