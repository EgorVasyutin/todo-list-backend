-- CREATE database "calendar-app";

-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   username VARCHAR(255),
--   email VARCHAR(255),
--   password VARCHAR(63)
-- );
--
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  "isDone" BOOLEAN,
  "priority" VARCHAR (20),
  "type" VARCHAR (20),
  "startDate" VARCHAR(255),
  "endDate" VARCHAR(255),
  userId INTEGER REFERENCES users (id)
);
--


--
-- CREATE TABLE user_token (
--  "userId" INTEGER REFERENCES users (id),
--  "refreshToken" VARCHAR(255)
-- );
--


ALTER TABLE cards ADD COLUMN "startDate" VARCHAR(255);
ALTER TABLE cards ADD COLUMN status VARCHAR(255);

--
--  ALTER TABLE todo RENAME COLUMN is_done TO isDone;
--
--
--
--
--
-- ALTER TABLE todo ADD userId INTEGER;
--
-- INSERT INTO todos (title, "isDone", userId) VALUES ('Egor',false, 1);
-- INSERT INTO users (username, email, password) VALUES ('Egor','egit@mail.ru', 123456);
--
-- ALTER TABLE users
-- ALTER COLUMN status TYPE VARCHAR(255);
--
-- ALTER TABLE users ADD COLUMN email VARCHAR(255)
--
-- ALTER TABLE todo ADD  INTEGER SET DEFAULT 1;
--
--
-- ALTER TABLE todo DROP COLUMN userId;
--
-- ALTER TABLE todo ALTER COLUMN userId SET DEFAULT 1;
--
-- FOREIGN KEY (userId) REFERENCES users (id)

--
-- FOREIGN KEY (userId) REFERENCES users (id)

-- ALTER TABLE todo DROP COLUMN userId;
-- ALTER TABLE todo ADD COLUMN userId SET DEFAULT 1;

-- ALTER TABLE todo ADD COLUMN userId INT NOT NULL
--     CONSTRAINT user REFERENCES x (a)   -- if x (a) doens't exist, this will fail!
--         ON UPDATE CASCADE ON DELETE CASCADE

-- ALTER TABLE todo ADD FOREIGN KEY (userId) REFERENCES users (id) SET DEFAULT 1

-- ALTER TABLE todo ADD COLUMN "userId" INT;
--
-- ALTER TABLE todo ALTER COLUMN "userId" SET DEFAULT 1;



-- SELECT todo.title, todo."isDone", users.username, users.password, users.email FROM users INNER JOIN todo ON users.id = todo."userId";


