DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) UNIQUE NOT NULL,
    total_score INT DEFAULT 0,
    isAdmin BOOLEAN DEFAULT FALSE,
    session_ids INT[] DEFAULT '{}',
    PRIMARY KEY (id)
);

INSERT INTO users (username, email, password, total_score, isAdmin, session_ids)
VALUES
    ('john_doe', 'john.doe@example.com', 'password123', 150, FALSE, '{}'),
    ('jane_smith', 'jane.smith@example.com', 'securepass456', 200, TRUE, '{}'),
    ('alice_wonder', 'alice.wonder@example.com', 'alicepass789', 120, FALSE, '{}'),
    ('bob_builder', 'bob.builder@example.com', 'buildit123', 180, FALSE, '{}'),
    ('charlie_brown', 'charlie.brown@example.com', 'charliepass321', 90, FALSE, '{}'),
    ('diana_prince', 'diana.prince@example.com', 'wonderwoman', 250, TRUE, '{}'),
    ('tony_stark', 'tony.stark@example.com', 'ironman123', 300, TRUE, '{}'),
    ('bruce_wayne', 'bruce.wayne@example.com', 'batman456', 275, TRUE, '{}'),
    ('clark_kent', 'clark.kent@example.com', 'superman789', 220, TRUE, '{}'),
    ('lois_lane', 'lois.lane@example.com', 'reporter123', 130, FALSE, '{}');


CREATE TABLE sessions (
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    session_type VARCHAR(255),
    session_score INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO sessions (user_id, session_type, session_score)
VALUES
    (1, 'country-guess', 50),
    (1, 'flag-guess', 100),
    (2, 'capital-guess', 80),
    (2, 'country-guess', 120),
    (3, 'flag-guess', 40),
    (3, 'capital-guess', 80),
    (4, 'country-guess', 90),
    (4, 'flag-guess', 90),
    (5, 'capital-guess', 30),
    (5, 'country-guess', 60),
    (6, 'flag-guess', 100),
    (6, 'capital-guess', 150),
    (7, 'country-guess', 120),
    (7, 'flag-guess', 180),
    (8, 'capital-guess', 110),
    (8, 'country-guess', 165),
    (9, 'flag-guess', 95),
    (9, 'capital-guess', 125),
    (10, 'country-guess', 70),
    (10, 'flag-guess', 60);