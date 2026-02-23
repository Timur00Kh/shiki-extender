CREATE TABLE `altwatcher_link` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`description` text,
	`manga` integer DEFAULT 0 NOT NULL,
	`anime` integer DEFAULT 0 NOT NULL,
	`ranobe` integer DEFAULT 0 NOT NULL,
	`approved` integer DEFAULT 0 NOT NULL,
	`number_of_downloads` integer DEFAULT 1 NOT NULL,
	`is_default` integer DEFAULT 0 NOT NULL
);
