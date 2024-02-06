-- User table creation
create table user (
id int auto_increment primary key,
username varchar(256) not null,
password text not null,
status text,
unique(username)
);

-- Post table creation
create table post (
id int auto_increment primary key,
message text not null,
category text,
like_count int default 0,
time_created timestamp default CURRENT_TIMESTAMP,
user_id int not null,
foreign key (user_id) references user(id)
);