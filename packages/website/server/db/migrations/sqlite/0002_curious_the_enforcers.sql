CREATE TABLE `affiliates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`stripe_account_id` text,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`onboarding_completed` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `affiliates_user_id_unique` ON `affiliates` (`user_id`);--> statement-breakpoint
CREATE TABLE `commissions` (
	`id` text PRIMARY KEY NOT NULL,
	`affiliate_id` text NOT NULL,
	`order_id` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'usd' NOT NULL,
	`status` text DEFAULT 'PENDING' NOT NULL,
	`stripe_transfer_id` text,
	`metadata` text,
	`created_at` integer,
	`paid_at` integer
);
