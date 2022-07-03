-- 테스트용
CREATE DATABASE IF NOT EXISTS ex_test;

use ex_test;

-- 유저
create table if not exists user
(
    id   varchar(255) not null comment 'ID'
    primary key,
    name varchar(255) not null comment '사용자이름'
);


-- 장소
create table if not exists place
(
    id   varchar(255) not null comment 'ID'
    primary key,
    name varchar(255) not null comment '장소이름'
);

-- 리뷰
create table if not exists review
(
    id         varchar(255)                         not null comment 'ID'
    primary key,
    user_id    varchar(255)                         not null comment '리뷰 작성자 ID',
    place_id   varchar(255)                         not null comment '장소 ID',
    content    varchar(255)                         not null comment '리뷰내용',
    is_used    tinyint(1) default 1                 not null,
    is_deleted tinyint(1) default 0                 not null,
    created_at datetime   default CURRENT_TIMESTAMP not null comment '등록일시',
    updated_at datetime   default CURRENT_TIMESTAMP not null comment '수정일시',
    constraint IDX_c05b7419cb9cd6c6db23edd475
    unique (user_id, place_id, is_used),
    constraint FK_81446f2ee100305f42645d4d6c2
    foreign key (user_id) references user (id),
    constraint FK_d11650864e93b23444d1634d766
    foreign key (place_id) references place (id)
);

-- 포인트 기록
create table if not exists point_log
(
    id         int auto_increment comment 'ID'
    primary key,
    user_id    varchar(255)                       not null comment '리뷰 작성자 ID',
    review_id  varchar(255)                       not null comment '리뷰 ID',
    point      int                                not null comment '점수',
    point_type varchar(20)                        not null comment '점수유형 (CONTENT, PHOTO, BONUS)',
    created_at datetime default CURRENT_TIMESTAMP not null comment '등록일시',
    constraint FK_8ce2da8731e1b9dab01de77068d
    foreign key (review_id) references review (id),
    constraint FK_ef3c1e40584ff834ea1400cdf09
    foreign key (user_id) references user (id)
);

-- 사진
create table if not exists photo
(
    id         varchar(255)         not null comment 'ID'
    primary key,
    user_id    varchar(255)         not null comment '리뷰 작성자 ID',
    review_id  varchar(255)         not null comment '리뷰 ID',
    is_deleted tinyint(1) default 0 not null,
    created_at datetime   default CURRENT_TIMESTAMP not null comment '등록일시',
    updated_at datetime   default CURRENT_TIMESTAMP not null comment '수정일시',
    constraint FK_809dc43491aa27a555fe9a2247c
    foreign key (review_id) references review (id),
    constraint FK_c8c60110b38af9f778106552c39
    foreign key (user_id) references user (id)
);

-- INSERT INTO user(id, name) VALUES('f4902e09-2609-4087-a18e-38f9e15495c2', '하나');
-- INSERT INTO user(id, name) VALUES('52a21165-1de2-4703-aa87-a06ed41cec69', '두울');
-- INSERT INTO user(id, name) VALUES('1c8d2591-83d6-4d26-96b3-260183e3010e', '세엣');
-- INSERT INTO user(id, name) VALUES('14d231c3-797c-4b35-bcc1-ebb8b73f9fe2', '네엣');
-- INSERT INTO user(id, name) VALUES('bc965dc3-fd2b-4257-8fc1-53d22ca7fe7a', '다섯');
--
-- INSERT INTO place(id, name) VALUES('0d9b0c6c-3df6-48e4-9fba-6708e2c35a51', '서울');
-- INSERT INTO place(id, name) VALUES('a4a0cce2-e058-4e4c-abd6-251cb63d95ee', '부산');
-- INSERT INTO place(id, name) VALUES('dcc50084-78b9-49ae-a370-5c285e70ff30', '대구');
-- INSERT INTO place(id, name) VALUES('0d5e2327-09a7-402d-9b12-f518263d7f05', '울산');
-- INSERT INTO place(id, name) VALUES('14d748df-2847-4304-b90c-21a15b5226f7', '경기');