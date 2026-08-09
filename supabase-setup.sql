-- =====================================================================
--  Vishweshwara Sanskrit — complete database setup
--
--  Paste this whole file into Supabase → SQL Editor → Run.
--  It creates all 22 tables and loads the curriculum.
--
--  It deliberately creates NO user accounts and contains NO passwords:
--  this file lives in a public repository. The Acharya's account is
--  created once, in the browser, at /setup — see DEPLOYMENT.md.
--
--  Safe to run on an empty database. Running it twice will error on the
--  existing tables, which is harmless — nothing is destroyed.
-- =====================================================================

-- ---------- Schema ----------
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

ALTER TABLE "stage" ADD CONSTRAINT "stage_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "syllabus_item" ADD CONSTRAINT "syllabus_item_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;
CREATE UNIQUE INDEX "path_slug_idx" ON "path" USING btree ("slug");
CREATE UNIQUE INDEX "stage_path_number_idx" ON "stage" USING btree ("path_id","stage_number");CREATE TABLE "guardian_link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guardian_person_id" uuid NOT NULL,
	"student_person_id" uuid NOT NULL,
	"relationship" text,
	"consent_recorded_at" timestamp with time zone,
	"can_view_feedback" boolean DEFAULT false NOT NULL
);

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

CREATE TABLE "session_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

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

CREATE TABLE "item_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"syllabus_item_id" uuid NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"marked_by" uuid,
	"marked_at" timestamp with time zone,
	"notes" text
);

CREATE TABLE "stage_completion" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"stage_id" uuid NOT NULL,
	"completed_on" date NOT NULL,
	"approved_by" uuid NOT NULL,
	"remarks" text
);

CREATE TABLE "series_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"series_id" uuid NOT NULL,
	"student_id" uuid NOT NULL
);

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

CREATE TABLE "session_participant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"attendance" text DEFAULT 'unknown' NOT NULL,
	"attendance_source" text,
	"attendance_confirmed_by" uuid,
	"minutes_attended" integer
);

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

CREATE TABLE "abhyasa_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"practised_on" date NOT NULL,
	"minutes" integer NOT NULL,
	"what" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

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

CREATE TABLE "assignment_target" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"student_id" uuid NOT NULL
);

CREATE TABLE "review" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"reviewed_by" uuid NOT NULL,
	"grade" text,
	"feedback" text NOT NULL,
	"requires_resubmission" boolean DEFAULT false NOT NULL,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL
);

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

CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_person_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"detail" jsonb,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "guardian_link" ADD CONSTRAINT "guardian_link_guardian_person_id_person_id_fk" FOREIGN KEY ("guardian_person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "guardian_link" ADD CONSTRAINT "guardian_link_student_person_id_person_id_fk" FOREIGN KEY ("student_person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "session_token" ADD CONSTRAINT "session_token_person_id_person_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_current_stage_id_stage_id_fk" FOREIGN KEY ("current_stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "item_progress" ADD CONSTRAINT "item_progress_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "item_progress" ADD CONSTRAINT "item_progress_syllabus_item_id_syllabus_item_id_fk" FOREIGN KEY ("syllabus_item_id") REFERENCES "public"."syllabus_item"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "item_progress" ADD CONSTRAINT "item_progress_marked_by_person_id_fk" FOREIGN KEY ("marked_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "stage_completion" ADD CONSTRAINT "stage_completion_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "stage_completion" ADD CONSTRAINT "stage_completion_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "stage_completion" ADD CONSTRAINT "stage_completion_approved_by_person_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "series_member" ADD CONSTRAINT "series_member_series_id_session_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."session_series"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "series_member" ADD CONSTRAINT "series_member_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "session" ADD CONSTRAINT "session_series_id_session_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."session_series"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "session" ADD CONSTRAINT "session_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "session" ADD CONSTRAINT "session_taught_by_person_id_fk" FOREIGN KEY ("taught_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "session_participant" ADD CONSTRAINT "session_participant_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "session_participant" ADD CONSTRAINT "session_participant_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "session_participant" ADD CONSTRAINT "session_participant_attendance_confirmed_by_person_id_fk" FOREIGN KEY ("attendance_confirmed_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "session_series" ADD CONSTRAINT "session_series_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "session_series" ADD CONSTRAINT "session_series_taught_by_person_id_fk" FOREIGN KEY ("taught_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "abhyasa_log" ADD CONSTRAINT "abhyasa_log_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "abhyasa_log" ADD CONSTRAINT "abhyasa_log_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_created_by_person_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "assignment_target" ADD CONSTRAINT "assignment_target_assignment_id_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "assignment_target" ADD CONSTRAINT "assignment_target_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "review" ADD CONSTRAINT "review_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submission"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "review" ADD CONSTRAINT "review_reviewed_by_person_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "submission" ADD CONSTRAINT "submission_assignment_id_assignment_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignment"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "submission" ADD CONSTRAINT "submission_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "avalokanam" ADD CONSTRAINT "avalokanam_enrollment_id_enrollment_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."enrollment"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "avalokanam" ADD CONSTRAINT "avalokanam_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "avalokanam" ADD CONSTRAINT "avalokanam_decided_by_person_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_student_id_person_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_path_id_path_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."path"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_stage_id_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "certificate" ADD CONSTRAINT "certificate_issued_by_person_id_fk" FOREIGN KEY ("issued_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "application" ADD CONSTRAINT "application_decided_by_person_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "application" ADD CONSTRAINT "application_created_person_id_person_id_fk" FOREIGN KEY ("created_person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_person_id_person_id_fk" FOREIGN KEY ("actor_person_id") REFERENCES "public"."person"("id") ON DELETE no action ON UPDATE no action;
CREATE UNIQUE INDEX "guardian_pair_idx" ON "guardian_link" USING btree ("guardian_person_id","student_person_id");
CREATE UNIQUE INDEX "person_email_idx" ON "person" USING btree ("email");
CREATE UNIQUE INDEX "session_token_hash_idx" ON "session_token" USING btree ("token_hash");
CREATE UNIQUE INDEX "enrollment_student_path_idx" ON "enrollment" USING btree ("student_id","path_id");
CREATE UNIQUE INDEX "item_progress_idx" ON "item_progress" USING btree ("enrollment_id","syllabus_item_id");
CREATE UNIQUE INDEX "series_member_idx" ON "series_member" USING btree ("series_id","student_id");
CREATE UNIQUE INDEX "session_participant_idx" ON "session_participant" USING btree ("session_id","student_id");
CREATE UNIQUE INDEX "abhyasa_day_idx" ON "abhyasa_log" USING btree ("enrollment_id","practised_on");
CREATE UNIQUE INDEX "assignment_target_idx" ON "assignment_target" USING btree ("assignment_id","student_id");
CREATE UNIQUE INDEX "submission_attempt_idx" ON "submission" USING btree ("assignment_id","student_id","attempt_number");
CREATE UNIQUE INDEX "certificate_public_id_idx" ON "certificate" USING btree ("public_id");
-- ---------- Curriculum data ----------
INSERT INTO path VALUES ('e9cb5f41-124b-4488-a1d0-013640f9e053', 'sanskrit', 'Sanskrit', 'संस्कृताध्ययनपरम्परा', 'From the first sound to the independent reading of Sanskrit texts. Six stages.', 18, 24, 0, true, '2026-08-09 14:57:19.336013+00', NULL);
INSERT INTO path VALUES ('6d532b77-975f-4cb7-a53c-ec29822c9320', 'bhagavad-gita', 'Bhagavad Gītā', 'भगवद्गीताध्ययनपरम्परा', 'From correct recitation to word-by-word understanding and practical application.', NULL, NULL, 1, true, '2026-08-09 14:57:19.361792+00', NULL);
INSERT INTO path VALUES ('ecfe2d6e-bc8d-4bd9-9dd6-e090f13d87a2', 'krishna-yajurveda', 'Krishna Yajurveda', 'कृष्णयजुर्वेदाध्ययनपरम्परा', 'Authentic Vedic transmission in the Taittirīya śākhā, with pronunciation purity as the priority.', NULL, NULL, 2, true, '2026-08-09 14:57:19.374395+00', NULL);
INSERT INTO path VALUES ('8848b376-7508-4f7d-a764-ff1b1bdbb42c', 'advaita-vedanta', 'Advaita Vedānta', 'अद्वैतवेदान्ताध्ययनपरम्परा', 'Prakaraṇa granthas and the commentarial tradition.', NULL, NULL, 3, false, '2026-08-09 14:57:19.411887+00', NULL);
INSERT INTO path VALUES ('731be1be-5e73-4572-893c-bcd18e861b30', 'stotras-and-suktas', 'Stotras & Sūktas', 'स्तोत्रसूक्ताध्ययनपरम्परा', 'Recitation of stotras and sūktas.', NULL, NULL, 4, false, '2026-08-09 14:57:19.413544+00', NULL);
INSERT INTO stage VALUES ('9e91faae-e1f9-434e-933e-9b913a92eb7c', 'e9cb5f41-124b-4488-a1d0-013640f9e053', 1, 'Saṁskṛtapraveśaḥ', 'संस्कृतप्रवेशः', 'Foundation, phonetics and vocabulary', 2, 3, '2026-08-09 14:57:19.341921+00', NULL);
INSERT INTO stage VALUES ('f0d3c1fc-a5c3-4dcb-9260-1c3a8a8172f8', 'e9cb5f41-124b-4488-a1d0-013640f9e053', 2, 'Vākyanirmāṇam', 'वाक्यनिर्माणम्', 'Sentence formation', 3, 4, '2026-08-09 14:57:19.345235+00', NULL);
INSERT INTO stage VALUES ('17df5ed6-0843-4d5f-b385-00fa52869185', 'e9cb5f41-124b-4488-a1d0-013640f9e053', 3, 'Śabdarūpādhyayanam', 'शब्दरूपाध्ययनम्', 'Noun declension', 3, 4, '2026-08-09 14:57:19.347131+00', NULL);
INSERT INTO stage VALUES ('b458733a-1327-412c-89b4-d3060ee1a936', 'e9cb5f41-124b-4488-a1d0-013640f9e053', 4, 'Dhāturūpādhyayanam', 'धातुरूपाध्ययनम्', 'Verb structure', 3, 4, '2026-08-09 14:57:19.348785+00', NULL);
INSERT INTO stage VALUES ('f05378d4-b6ad-40a6-ae43-ff03a4786c13', 'e9cb5f41-124b-4488-a1d0-013640f9e053', 5, 'Vyākaraṇapraveśaḥ', 'व्याकरणप्रवेशः', 'Structured grammar — sandhi, samāsa, kāraka', 3, 4, '2026-08-09 14:57:19.350424+00', NULL);
INSERT INTO stage VALUES ('8ae28880-9ad6-4a8d-b912-74192e9bb48d', 'e9cb5f41-124b-4488-a1d0-013640f9e053', 6, 'Śāstrasaṁskṛtam', 'शास्त्रसंस्कृतम्', 'Advanced traditional Sanskrit', 4, 5, '2026-08-09 14:57:19.359059+00', NULL);
INSERT INTO stage VALUES ('6bda9adf-7a80-4402-8913-5e92b1b3bdee', '6d532b77-975f-4cb7-a53c-ec29822c9320', 1, 'Ślokapraveśaḥ', 'श्लोकप्रवेशः', 'Foundation of Gītā learning', NULL, NULL, '2026-08-09 14:57:19.363314+00', NULL);
INSERT INTO stage VALUES ('892ed12f-89ff-4b46-affe-b1eedad48a34', '6d532b77-975f-4cb7-a53c-ec29822c9320', 2, 'Ślokakaṇṭhapāṭhaḥ', 'श्लोककण्ठपाठः', 'Memorisation and recitation', NULL, NULL, '2026-08-09 14:57:19.366743+00', NULL);
INSERT INTO stage VALUES ('0a812263-98b9-4d8e-86f3-185259844970', '6d532b77-975f-4cb7-a53c-ec29822c9320', 3, 'Padacchedaḥ evaṁ śabdārthaḥ', 'पदच्छेदः एवं शब्दार्थः', 'Word separation and meaning', NULL, NULL, '2026-08-09 14:57:19.369829+00', NULL);
INSERT INTO stage VALUES ('56458821-7f09-4307-ab8e-512fcb2ddccd', '6d532b77-975f-4cb7-a53c-ec29822c9320', 4, 'Tātparyavicāraḥ', 'तात्पर्यविचारः', 'Philosophical understanding', NULL, NULL, '2026-08-09 14:57:19.371222+00', NULL);
INSERT INTO stage VALUES ('f2659358-2678-431a-875a-07fe409ec9c1', '6d532b77-975f-4cb7-a53c-ec29822c9320', 5, 'Jīvanopayogigītā', 'जीवनोपयोगिगीता', 'Practical application of Gītā wisdom', NULL, NULL, '2026-08-09 14:57:19.372874+00', NULL);
INSERT INTO stage VALUES ('279f4be2-1c25-4d55-8777-2224d62b2553', 'ecfe2d6e-bc8d-4bd9-9dd6-e090f13d87a2', 1, 'Mantrapraveśaḥ', 'मन्त्रप्रवेशः', 'Foundational Vedic learning', NULL, NULL, '2026-08-09 14:57:19.375712+00', NULL);
INSERT INTO stage VALUES ('c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 'ecfe2d6e-bc8d-4bd9-9dd6-e090f13d87a2', 2, 'Sūktādhyayanam', 'सूक्ताध्ययनम्', 'Sacred hymn learning', NULL, NULL, '2026-08-09 14:57:19.380149+00', NULL);
INSERT INTO stage VALUES ('e9b139bc-38cf-4e97-8344-08bc19a88599', 'ecfe2d6e-bc8d-4bd9-9dd6-e090f13d87a2', 3, 'Vaidikānuṣṭhānam', 'वैदिकानुष्ठानम्', 'Ritual and practical Vedic learning', NULL, NULL, '2026-08-09 14:57:19.391292+00', NULL);
INSERT INTO stage VALUES ('7716e389-3180-4f81-ac7b-3d536fc84479', 'ecfe2d6e-bc8d-4bd9-9dd6-e090f13d87a2', 4, 'Mukhyayajurvedādhyayanam', 'मुख्ययजुर्वेदाध्ययनम्', 'Core Krishna Yajurveda learning', NULL, NULL, '2026-08-09 14:57:19.399056+00', NULL);
INSERT INTO stage VALUES ('992a5ee2-8c47-4f9e-a1ce-7bda0c5d03d6', 'ecfe2d6e-bc8d-4bd9-9dd6-e090f13d87a2', 5, 'Upaniṣadadhyayanam', 'उपनिषदध्ययनम्', 'Advanced sacred knowledge learning', NULL, NULL, '2026-08-09 14:57:19.406774+00', NULL);
INSERT INTO syllabus_item VALUES ('33dfd56d-b11e-4da6-ad28-d6f5a8142255', 'f05378d4-b6ad-40a6-ae43-ff03a4786c13', 0, 'Sandhiprakaraṇam', 'सन्धिप्रकरणम्', 'grammar', NULL, '2026-08-09 14:57:19.354112+00', NULL);
INSERT INTO syllabus_item VALUES ('0255d549-b708-4159-a21b-ae5f1f6eee3f', 'f05378d4-b6ad-40a6-ae43-ff03a4786c13', 1, 'Samāsaprakaraṇam', 'समासप्रकरणम्', 'grammar', NULL, '2026-08-09 14:57:19.35619+00', NULL);
INSERT INTO syllabus_item VALUES ('cc163713-6134-477b-b55e-f26796a540af', 'f05378d4-b6ad-40a6-ae43-ff03a4786c13', 2, 'Kārakaprakaraṇam', 'कारकप्रकरणम्', 'grammar', NULL, '2026-08-09 14:57:19.357649+00', NULL);
INSERT INTO syllabus_item VALUES ('d0a8ab9e-a9ca-48bf-b8bd-3ae1029eb63e', '8ae28880-9ad6-4a8d-b912-74192e9bb48d', 0, 'Laghusiddhāntakaumudī', 'लघुसिद्धान्तकौमुदी', 'text', NULL, '2026-08-09 14:57:19.360555+00', NULL);
INSERT INTO syllabus_item VALUES ('7120e0fc-667e-420e-9a10-cc3f303f89a7', '6bda9adf-7a80-4402-8913-5e92b1b3bdee', 0, 'Dhyānaślokāḥ', 'ध्यानश्लोकाः', 'sloka', NULL, '2026-08-09 14:57:19.364556+00', NULL);
INSERT INTO syllabus_item VALUES ('4f1b479f-d166-40a9-b549-89ab7ee1326b', '6bda9adf-7a80-4402-8913-5e92b1b3bdee', 1, 'Gurustotram', 'गुरुस्तोत्रम्', 'stotra', NULL, '2026-08-09 14:57:19.365606+00', NULL);
INSERT INTO syllabus_item VALUES ('2a5323ea-f1ba-4b38-ad97-bde6b88a4f1a', '892ed12f-89ff-4b46-affe-b1eedad48a34', 0, 'Chapter 12 — Bhakti Yoga', NULL, 'chapter', NULL, '2026-08-09 14:57:19.3678+00', NULL);
INSERT INTO syllabus_item VALUES ('fb9a64fc-ff32-4bff-8277-1e0ffa902e7c', '892ed12f-89ff-4b46-affe-b1eedad48a34', 1, 'Chapter 15 — Puruṣottama Yoga', NULL, 'chapter', NULL, '2026-08-09 14:57:19.368793+00', NULL);
INSERT INTO syllabus_item VALUES ('5c16f850-793f-458e-8905-a5341a14ce4f', '279f4be2-1c25-4d55-8777-2224d62b2553', 0, 'Daśaśāntimantrāḥ', 'दशशान्तिमन्त्राः', 'mantra', NULL, '2026-08-09 14:57:19.376981+00', NULL);
INSERT INTO syllabus_item VALUES ('ba038fc4-55a5-4dfe-86a4-a0002be22d00', '279f4be2-1c25-4d55-8777-2224d62b2553', 1, 'Gaṇeśātharvaśīrṣam', 'गणेशाथर्वशीर्षम्', 'mantra', NULL, '2026-08-09 14:57:19.377978+00', NULL);
INSERT INTO syllabus_item VALUES ('7e6683df-083b-4dac-a57e-4a2fa45f8d01', '279f4be2-1c25-4d55-8777-2224d62b2553', 2, 'Gaṇapatisūktam', 'गणपतिसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.379079+00', NULL);
INSERT INTO syllabus_item VALUES ('8b6e4fbd-6242-4338-84df-146ca02670d4', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 0, 'Śrīsūktam', 'श्रीसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.381278+00', NULL);
INSERT INTO syllabus_item VALUES ('192e09a1-ff53-4770-9b55-c66ce226e381', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 1, 'Medhāsūktam', 'मेधासूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.382562+00', NULL);
INSERT INTO syllabus_item VALUES ('79fdb1e5-a3be-487b-b9a2-c86f4ac960e4', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 2, 'Durgāsūktam', 'दुर्गासूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.383444+00', NULL);
INSERT INTO syllabus_item VALUES ('dd8e12e3-b480-4d51-92aa-137abecadd46', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 3, 'Puruṣasūktam', 'पुरुषसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.38424+00', NULL);
INSERT INTO syllabus_item VALUES ('73ae3d55-e494-4b77-91bd-9f380e5abd30', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 4, 'Viṣṇusūktam', 'विष्णुसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.385197+00', NULL);
INSERT INTO syllabus_item VALUES ('3c3f7c72-c67e-4e47-b8bc-35cf5e70d139', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 5, 'Sarasvatīsūktam', 'सरस्वतीसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.386049+00', NULL);
INSERT INTO syllabus_item VALUES ('0bd25534-8b0d-42d4-aaad-5ff0badc465b', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 6, 'Devīsūktam', 'देवीसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.386928+00', NULL);
INSERT INTO syllabus_item VALUES ('e2ca1d95-1161-4172-805d-984a7a3edf2a', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 7, 'Saurasūktam', 'सौरसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.387833+00', NULL);
INSERT INTO syllabus_item VALUES ('7ce25419-f1de-4849-869c-2ce5fe45a802', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 8, 'Prātaḥsūktam', 'प्रातःसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.388676+00', NULL);
INSERT INTO syllabus_item VALUES ('efb6c52c-3cf4-436a-a0c0-408c52849ef4', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 9, 'Gosūktam', 'गोसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.389504+00', NULL);
INSERT INTO syllabus_item VALUES ('dab547a5-29e3-43ce-8b86-94ec82f4d730', 'c20b69c9-1659-47f8-9da5-6fa55cdf90b0', 10, 'Brahmasūktam', 'ब्रह्मसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.390328+00', NULL);
INSERT INTO syllabus_item VALUES ('1723cead-8488-43bf-8573-7c42eecf075d', 'e9b139bc-38cf-4e97-8344-08bc19a88599', 0, 'Mantrapuṣpam', 'मन्त्रपुष्पम्', 'mantra', NULL, '2026-08-09 14:57:19.392746+00', NULL);
INSERT INTO syllabus_item VALUES ('62fdd20a-f33b-4cca-a265-871509a63314', 'e9b139bc-38cf-4e97-8344-08bc19a88599', 1, 'Navagrahasūktam', 'नवग्रहसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.393884+00', NULL);
INSERT INTO syllabus_item VALUES ('fadbb4e5-cfbc-4421-843f-4e1ece87b4ec', 'e9b139bc-38cf-4e97-8344-08bc19a88599', 2, 'Udakaśāntiḥ', 'उदकशान्तिः', 'mantra', NULL, '2026-08-09 14:57:19.394802+00', NULL);
INSERT INTO syllabus_item VALUES ('09018404-6ddf-4f45-9485-f332ab78302f', 'e9b139bc-38cf-4e97-8344-08bc19a88599', 3, 'Śrāddhasūktam', 'श्राद्धसूक्तम्', 'sukta', NULL, '2026-08-09 14:57:19.39575+00', NULL);
INSERT INTO syllabus_item VALUES ('42cc4fde-fc95-42bb-81e3-807536dfbb91', 'e9b139bc-38cf-4e97-8344-08bc19a88599', 4, 'Vaidikarāṣṭragānam', 'वैदिकराष्ट्रगानम्', 'mantra', NULL, '2026-08-09 14:57:19.397084+00', NULL);
INSERT INTO syllabus_item VALUES ('d9708d2f-4f66-45f6-b3e6-72cd2d81a1fb', '7716e389-3180-4f81-ac7b-3d536fc84479', 0, 'Śrī Rudram', 'श्रीरुद्रम्', 'text', NULL, '2026-08-09 14:57:19.400612+00', NULL);
INSERT INTO syllabus_item VALUES ('bc54654c-37d6-4218-ad38-408a78294e93', '7716e389-3180-4f81-ac7b-3d536fc84479', 1, 'Chamakam', 'चमकम्', 'text', NULL, '2026-08-09 14:57:19.402086+00', NULL);
INSERT INTO syllabus_item VALUES ('f27b7e84-375c-4f10-a7dd-55bf180b26d4', '7716e389-3180-4f81-ac7b-3d536fc84479', 2, 'Dvitīyapraśnaḥ', 'द्वितीयप्रश्नः', 'text', NULL, '2026-08-09 14:57:19.403982+00', NULL);
INSERT INTO syllabus_item VALUES ('3ad3fe8c-a2a3-456f-b996-a1691953bba1', '7716e389-3180-4f81-ac7b-3d536fc84479', 3, 'Aruṇapraśnaḥ', 'अरुणप्रश्नः', 'text', NULL, '2026-08-09 14:57:19.405369+00', NULL);
INSERT INTO syllabus_item VALUES ('da445684-0042-41d2-b5e1-1642dd4d3384', '992a5ee2-8c47-4f9e-a1ce-7bda0c5d03d6', 0, 'Mahānārāyaṇopaniṣad', 'महानारायणोपनिषद्', 'text', NULL, '2026-08-09 14:57:19.407865+00', NULL);
INSERT INTO syllabus_item VALUES ('499aaba6-fa19-4b79-be71-35d89c18aa35', '992a5ee2-8c47-4f9e-a1ce-7bda0c5d03d6', 1, 'Śikṣāvallī', 'शिक्षावल्ली', 'text', NULL, '2026-08-09 14:57:19.408775+00', NULL);
INSERT INTO syllabus_item VALUES ('241f673d-4791-4eed-b8b4-cb53173b74c4', '992a5ee2-8c47-4f9e-a1ce-7bda0c5d03d6', 2, 'Brahmānandavallī', 'ब्रह्मानन्दवल्ली', 'text', NULL, '2026-08-09 14:57:19.409724+00', NULL);
INSERT INTO syllabus_item VALUES ('9a694474-4a02-4e11-bdca-ddfc3e795ad1', '992a5ee2-8c47-4f9e-a1ce-7bda0c5d03d6', 3, 'Bhṛguvallī', 'भृगुवल्ली', 'text', NULL, '2026-08-09 14:57:19.410629+00', NULL);

-- ---------- Record the migrations as applied ----------
-- so drizzle-kit does not try to re-create these tables later.
CREATE SCHEMA IF NOT EXISTS drizzle;
CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
  id SERIAL PRIMARY KEY,
  hash text NOT NULL,
  created_at bigint
);
INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ('0000_white_praxagora', 1786269897084);
INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ('0001_chunky_ego', 1786273653719);

-- Done. Next: deploy on Vercel, then visit /setup to create your account.
