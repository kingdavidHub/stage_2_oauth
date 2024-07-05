
-- USER MODEL
CREATE TABLE users (
  userId VARCHAR(50) PRIMARY KEY NOT NULL UNIQUE,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  phone VARCHAR(50)
);

-- ORGANIZATION MODEL
CREATE TABLE organization (
  orgId VARCHAR(50) PRIMARY KEY NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(50)
)

-- USER ORGANIZATION MODEL
CREATE TABLE user_organization (
  userId VARCHAR(50) NOT NULL,
  orgId VARCHAR(50) NOT NULL,
  PRIMARY KEY (userId, orgId),
  FOREIGN KEY (userId) REFERENCES users(userId),
  FOREIGN KEY (orgId) REFERENCES organization(orgId)
)

INSERT INTO users (userId, firstName, lastName, email, password, phone)
VALUES ('1', 'John', 'Doe', 'a@a.com', '12345', '1234567890');

TRUNCATE TABLE users;
TRUNCATE TABLE organization;

DROP TABLE user_organization;


SELECT * FROM users
SELECT * FROM organization
SELECT * FROM user_organization