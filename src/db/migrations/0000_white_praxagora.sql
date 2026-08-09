CREATE TABLE "path" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name_latin" text NOT NULL,
	"name_devanagari" text,
	"summary" text,
	"duration_min_months" integer,
	"duration_max_months" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "stage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path_id" uuid NOT NULL,
	"stage_number" integer NOT NULL,
	"name_latin" text NOT NULL,
	"name_devanagari" text,
	"description" text,
	"duration_min_months" integer,
	"duration_max_months" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "syllabus_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stage_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"title_latin" text NOT NULL,
	"title_devanagari" text,
	"kind" text DEFAULT 'topic' NOT NULL,
	"reference" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "stage" ADD CONSTRAINT "stage_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "syllabus_item" ADD CONSTRAINT "syllabus_item_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "path_slug_idx" ON "path" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "stage_path_number_idx" ON "stage" USING btree ("path_id","stage_number");