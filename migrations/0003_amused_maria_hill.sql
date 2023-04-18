ALTER TABLE properties MODIFY COLUMN `useful_area` float NOT NULL;--> statement-breakpoint
ALTER TABLE properties MODIFY COLUMN `total_area` float NOT NULL;--> statement-breakpoint
ALTER TABLE properties MODIFY COLUMN `price` float NOT NULL;--> statement-breakpoint
ALTER TABLE properties MODIFY COLUMN `condominium` float;--> statement-breakpoint
ALTER TABLE properties MODIFY COLUMN `iptu` float;--> statement-breakpoint
ALTER TABLE properties ADD `photos` json NOT NULL;