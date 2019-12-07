CREATE TABLE public.altwatcher_link
(
  id bigint DEFAULT nextval('altwatcher_link_id_seq'::regclass) PRIMARY KEY NOT NULL,
  title varchar(100) NOT NULL,
  link varchar(500) NOT NULL,
  description varchar(2000),
  manga smallint DEFAULT 0,
  anime smallint DEFAULT 0,
  ranobe smallint DEFAULT 0,
  approved boolean DEFAULT false,
  number_of_downloads bigint DEFAULT 1,
  is_default boolean DEFAULT false
);
CREATE UNIQUE INDEX altwatcher_link_pkey ON public.altwatcher_link (id);