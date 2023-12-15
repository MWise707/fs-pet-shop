DROP TABLE IF EXISTS petshop;

CREATE TABLE petshop (
  pet_id serial PRIMARY KEY,
  name VARCHAR(30),
  age integer,
  kind VARCHAR(50),
  CONSTRAINT positive_num_age CHECK (age > 0)
)