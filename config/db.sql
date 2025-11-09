CREATE DATABASE TelegramBot1

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    userid BIGINT NOT NULL,
    username VARCHAR(50) NOT NULL,
    phonenumber VARCHAR(13) NOT NULL
)
