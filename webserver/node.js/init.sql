create table users(id int, name varchar(256), password varchar(32));
insert into users (id, name) values (0, 'root',  sha256('superSecretPassword'));