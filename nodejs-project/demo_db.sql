-- delete database if already existing and create a new one;
-- drop schema if exists ecommerce;
-- create schema ecommerce;
-- use ecommerce;

-- create tables;
create table users(
  id smallint auto_increment,
  fullname varchar(255) not null,
  password varchar(255) not null,
  email varchar(255) not null unique,
  role varchar(255) not null,
  profile_pic varchar(255) default "https://ibb.co/r2gbw6d",
constraint pk_user primary key(id),
constraint check_role check(role in('admin', 'employee'))
);

create table customers(
  id smallint auto_increment,
  fullname varchar(255) not null,
  password varchar(255) not null,
  email varchar(255) not null unique,
  address varchar(255),
  zipcode varchar(255),
  country varchar(255),
  phone varchar(255),
  ccnumber varchar(255),
  cvvnumber varchar(255),
constraint pk_customer primary key(id)
);

create table products(
  id smallint auto_increment,
  title varchar(255) not null,
  description varchar(255) not null,
  price real not null,
  stock smallint not null,
constraint pk_product primary key(id)
);

create table images(
  id smallint auto_increment,
  product_id smallint not null,
  path varchar(255) not null,
constraint pk_image primary key(id),
constraint fk_product_image foreign key(product_id) references products(id) on delete cascade
);

create table carts(
  customer_id smallint,
  product_id smallint,
  quantity smallint not null default 1,
constraint pk_cart primary key(customer_id, product_id),
constraint fk_user_cart foreign key(customer_id) references customers(id) on delete cascade,
constraint fk_product_cart foreign key(product_id) references products(id) on delete cascade
);

create table orders(
  id smallint auto_increment,
  order_date datetime default current_timestamp,
  customer_id smallint not null,
  total real not null,
constraint pk_order primary key(id),
constraint fk_customer_order foreign key(customer_id) references customers(id)
);

create table orders_products(
  order_id smallint,
  product_id smallint,
  product_price real not null,
  quantity smallint not null,
constraint pk_order_product primary key(order_id, product_id),
constraint fk_order_product foreign key(order_id) references orders(id) on delete cascade
);

-- insert data;
-- users;
insert into users values(1, "jorge garcía", "$2b$10$dritacz1hhp5bhfkrbgjl.lruxzykhd2rhfabwuvqq2c70ygvazl.", "jorgar@mail.com", "admin", "https://ibb.co/r2gbw6d");
insert into users values(2, "john doe", "$2b$10$dritacz1hhp5bhfkrbgjl.lruxzykhd2rhfabwuvqq2c70ygvazl.", "johndoe@mail.com", "employee", "https://ibb.co/r2gbw6d");

-- products;
insert into products values(1, "4ever gold", "a ring which is actually 4!", 29.95, 10);
insert into products values(2, "midi ring", "elegant and easy to combine.", 14.95, 100);
insert into products values(3, "silver wave", "the spirit of the sea and the beauty of the waves merge on this ring.", 29.95, 100);
insert into products values(4, "world necklace", "for the wanderers and those who love to travel.", 29.95, 0);
insert into products values(5, "sister necklace", "two golden rings which once joined their forces to make the sum of all.", 29.95, 100);
insert into products values(6, "pearl necklace", "this necklace gives a special touch as every pearl is unique.", 39.95, 100);
insert into products values(7, "bungavilla earrings", "fill your ears with airs of spring and flowers.", 39.95, 100);
insert into products values(8, "obbo earrings", "organic lines play with symmetry creating the perfect shape to decorate your ears.", 35.95, 100);

-- images;
insert into images values(1, 1, "https://i.ibb.co/chtcckq/prod-1-1.jpg");
insert into images values(2, 1, "https://i.ibb.co/mng7z2g/prod-1-2.jpg");
insert into images values(3, 1, "https://i.ibb.co/lrrn4kv/prod-1-3.jpg");
insert into images values(4, 2, "https://i.ibb.co/khtxtsf/prod-2-1.jpg");
insert into images values(5, 2, "https://i.ibb.co/0mbnp7h/prod-2-2.jpg");
insert into images values(6, 2, "https://i.ibb.co/htqnfzr/prod-2-3.jpg");
insert into images values(7, 3, "https://i.ibb.co/4vvdkr5/prod-3-1.jpg");
insert into images values(8, 3, "https://i.ibb.co/xfwcwq4/prod-3-2.jpg");
insert into images values(9, 3, "https://i.ibb.co/883wvz1/prod-3-3.jpg");
insert into images values(10, 4, "https://i.ibb.co/yrm40qz/prod-4-1.jpg");
insert into images values(11, 4, "https://i.ibb.co/qvjck5m/prod-4-2.jpg");
insert into images values(12, 5, "https://i.ibb.co/d8byq2x/prod-5-1.jpg");
insert into images values(13, 5, "https://i.ibb.co/jnh5ygv/prod-5-2.jpg");
insert into images values(14, 5, "https://i.ibb.co/bkxkf0w/prod-5-3.jpg");
insert into images values(15, 6, "https://i.ibb.co/mzjxfyc/prod-6-1.jpg");
insert into images values(16, 6, "https://i.ibb.co/j3gdv76/prod-6-2.jpg");
insert into images values(17, 6, "https://i.ibb.co/wxmsbfm/prod-6-3.jpg");
insert into images values(18, 7, "https://i.ibb.co/vmxspg6/prod-7-1.jpg");
insert into images values(19, 7, "https://i.ibb.co/pkpd9jp/prod-7-2.jpg");
insert into images values(20, 8, "https://i.ibb.co/jw2hrtx/prod-8-1.jpg");
insert into images values(21, 8, "https://i.ibb.co/164mwmc/prod-8-2.jpg");