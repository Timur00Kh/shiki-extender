ALTER TABLE `altwatcher_link` ADD `stable_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `altwatcher_link_stable_id_unique` ON `altwatcher_link` (`stable_id`);