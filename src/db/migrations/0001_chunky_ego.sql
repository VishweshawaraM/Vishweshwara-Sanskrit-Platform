CREATE TABLE "guardian_link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guardian_person_id" uuid NOT NULL,
	"student_person_id" uuid NOT NULL,
	"relationship" text,
	"consent_recorded_at" timestamp with time zone,
	"can_view_feedback" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "person" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" text DEFAULT 'student' NOT NULL,
	"email" text NOT NULL,
	"name_latin" text NOT NULL,
	"name_devanagari" text,
	"phone" text,
	"country" text,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"date_of_birth" date,
	"status" text DEFAULT 'active' NOT NULL,
	"password_hash" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "session_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enrollment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"path_id" uuid NOT NULL,
	"current_stage_id" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"started_on" date,
	"completed_on" date,
	"acharya_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"syllabus_item_id" uuid NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"marked_by" uuid,
	"marked_at" timestamp with time zone,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "stage_completion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"stage_id" uuid NOT NULL,
	"completed_on" date NOT NULL,
	"approved_by" uuid NOT NULL,
	"remarks" text
);
--> statement-breakpoint
CREATE TABLE "series_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"series_id" uuid NOT NULL,
	"student_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"series_id" uuid,
	"path_id" uuid,
	"kind" text DEFAULT 'class' NOT NULL,
	"scheduled_start_utc" timestamp with time zone NOT NULL,
	"scheduled_end_utc" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"zoom_join_url" text,
	"acharya_notes" text,
	"summary_for_students" text,
	"taught_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_participant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"attendance" text DEFAULT 'unknown' NOT NULL,
	"attendance_source" text,
	"attendance_confirmed_by" uuid,
	"minutes_attended" integer
);
--> statement-breakpoint
CREATE TABLE "session_series" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path_id" uuid,
	"title" text NOT NULL,
	"rrule" text,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"duration_minutes" integer DEFAULT 60 NOT NULL,
	"zoom_join_url" text,
	"taught_by" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "abhyasa_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"practised_on" date NOT NULL,
	"minutes" integer NOT NULL,
	"what" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path_id" uuid,
	"stage_id" uuid,
	"session_id" uuid,
	"title" text NOT NULL,
	"brief" text NOT NULL,
	"due_at" timestamp with time zone,
	"allow_late" boolean DEFAULT true NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archived_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "assignment_target" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"student_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"reviewed_by" uuid NOT NULL,
	"grade" text,
	"feedback" text NOT NULL,
	"requires_resubmission" boolean DEFAULT false NOT NULL,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"attempt_number" integer DEFAULT 1 NOT NULL,
	"body_text" text,
	"body_devanagari" text,
	"is_late" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "avalokanam" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"stage_id" uuid,
	"kind" text DEFAULT 'continuous' NOT NULL,
	"title" text NOT NULL,
	"attempt_number" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'planned' NOT NULL,
	"outcome" text,
	"remarks" text,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"declared_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_id" text NOT NULL,
	"student_id" uuid NOT NULL,
	"path_id" uuid NOT NULL,
	"stage_id" uuid,
	"kind" text NOT NULL,
	"holder_name_latin" text NOT NULL,
	"holder_name_devanagari" text,
	"path_name_latin" text NOT NULL,
	"path_name_devanagari" text,
	"stage_name_latin" text,
	"acharya_name" text NOT NULL,
	"institution_name" text NOT NULL,
	"issued_on_gregorian" date NOT NULL,
	"issued_panchanga" text,
	"issued_by" uuid NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"location" text,
	"interested_path" text,
	"motivation" text NOT NULL,
	"prior_study" text,
	"weekly_hours" text,
	"can_attend_live" boolean DEFAULT true NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"acharya_notes" text,
	"decided_by" uuid,
	"decided_at" timestamp with time zone,
	"created_person_id" uuid,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_person_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"detail" jsonb,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "guardian_link" ADD CONSTRAINT "guardian_link_guardian_person_id_person_id_fk" FOREIGN KEY ("guardian_person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guardian_link" ADD CONSTRAINT "guardian_link_student_person_id_person_id_fk" FOREIGN KEY ("student_person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_token" ADD CONSTRAINT "session_token_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_current_stage_id_stage_id_fk" FOREIGN KEY ("current_stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_progress" ADD CONSTRAINT "item_progress_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_progress" ADD CONSTRAINT "item_progress_syllabus_item_id_syllabus_item_id_fk" FOREIGN KEY ("syllabus_item_id") REFERENCES "public"."syllabus_item"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_progress" ADD CONSTRAINT "item_progress_marked_by_person_id_fk" FOREIGN KEY ("marked_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_completion" ADD CONSTRAINT "stage_completion_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_completion" ADD CONSTRAINT "stage_completion_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stage_completion" ADD CONSTRAINT "stage_completion_approved_by_person_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "series_member" ADD CONSTRAINT "series_member_series_id_session_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."session_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "series_member" ADD CONSTRAINT "series_member_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_series_id_session_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."session_series"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_taught_by_person_id_fk" FOREIGN KEY ("taught_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_participant" ADD CONSTRAINT "session_participant_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_participant" ADD CONSTRAINT "session_participant_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_participant" ADD CONSTRAINT "session_participant_attendance_confirmed_by_person_id_fk" FOREIGN KEY ("attendance_confirmed_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_series" ADD CONSTRAINT "session_series_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_series" ADD CONSTRAINT "session_series_taught_by_person_id_fk" FOREIGN KEY ("taught_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "abhyasa_log" ADD CONSTRAINT "abhyasa_log_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "abhyasa_log" ADD CONSTRAINT "abhyasa_log_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_created_by_person_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_target" ADD CONSTRAINT "assignment_target_assignment_id_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignment_target" ADD CONSTRAINT "assignment_target_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_reviewed_by_person_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_assignment_id_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avalokanam" ADD CONSTRAINT "avalokanam_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avalokanam" ADD CONSTRAINT "avalokanam_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avalokanam" ADD CONSTRAINT "avalokanam_decided_by_person_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_issued_by_person_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_decided_by_person_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_created_person_id_person_id_fk" FOREIGN KEY ("created_person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_person_id_person_id_fk" FOREIGN KEY ("actor_person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "guardian_pair_idx" ON "guardian_link" USING btree ("guardian_person_id","student_person_id");--> statement-breakpoint
CREATE UNIQUE INDEX "person_email_idx" ON "person" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_hash_idx" ON "session_token" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollment_student_path_idx" ON "enrollment" USING btree ("student_id","path_id");--> statement-breakpoint
CREATE UNIQUE INDEX "item_progress_idx" ON "item_progress" USING btree ("enrollment_id","syllabus_item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "series_member_idx" ON "series_member" USING btree ("series_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "session_participant_idx" ON "session_participant" USING btree ("session_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "abhyasa_day_idx" ON "abhyasa_log" USING btree ("enrollment_id","practised_on");--> statement-breakpoint
CREATE UNIQUE INDEX "assignment_target_idx" ON "assignment_target" USING btree ("assignment_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "submission_attempt_idx" ON "submission" USING btree ("assignment_id","student_id","attempt_number");--> statement-breakpoint
CREATE UNIQUE INDEX "certificate_public_id_idx" ON "certificate" USING btree ("public_id");