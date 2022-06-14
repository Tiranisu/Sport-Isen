

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fistname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(50) NOT NULL,
    passwd VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    link_image VARCHAR(50),
    nb_match INTEGER,
    fitness_id INTEGER,
    notifications INTEGER,
    notifications_list INTEGER[],
    access_token VARCHAR(50),

    FOREIGN KEY (fitness_id) REFERENCES fitness(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE matchs (
    id SERIAL PRIMARY KEY,
    name_match VARCHAR(50),
    organization_id INTEGER,
    sport_id INTEGER,
    address_id INTEGER,
    nb_player_min INTEGER,
    nb_player_max INTEGER,
    date_time TIMESTAMP,
    start_hour TIMESTAMP,
    duration TIMESTAMP,
    price FLOAT,
    best_player INTEGER,
    list_player_accepted INTEGER[],
    list_player_waiting INTEGER[],

    FOREIGN KEY (organization_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE CASCADE
    FOREIGN KEY (sport_id) REFERENCES sports(id)
        ON UPDATE CASCADE ON DELETE CASCADE
    FOREIGN KEY (address_id) REFERENCES address(id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE fitness (
    id SERIAL PRIMARY KEY,
    type_fitness VARCHAR(50);
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    text_notification VARCHAR(50);
);

CREATE TABLE sports (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50);
);

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    numero INTEGER,
    street INTEGER,
    city VARCHAR(50),
    postal_code NUMERIC(5,0) NOT NULL
);