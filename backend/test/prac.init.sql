CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create database prac
    with owner prac;

create table public.films
(
    id          uuid default uuid_generate_v4() not null
        constraint "PK_697487ada088902377482c970d1"
            primary key,
    rating      double precision                not null,
    director    varchar                         not null,
    tags        text                            not null,
    image       varchar                         not null,
    cover       varchar                         not null,
    title       varchar                         not null,
    about       varchar                         not null,
    description varchar                         not null
);

alter table public.films
    owner to prac;

create table public.schedules
(
    id       uuid default uuid_generate_v4() not null
        constraint "PK_7e33fc2ea755a5765e3564e66dd"
            primary key,
    daytime  varchar                         not null,
    hall     integer                         not null,
    rows     integer                         not null,
    seats    integer                         not null,
    price    double precision                not null,
    taken    text                            not null,
    "filmId" uuid
        constraint "FK_1c2f5e637713a429f4854024a76"
            references public.films
);

alter table public.schedules
    owner to prac;


