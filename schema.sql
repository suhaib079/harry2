DROP TABLE IF EXISTS rama;
CREATE TABLE IF NOT EXISTS rama(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    house VARCHAR(255),
    image text,
    actor VARCHAR(255)
)