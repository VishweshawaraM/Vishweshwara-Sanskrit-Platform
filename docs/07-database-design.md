# Database Design — Vishweshwara Sanskrit V1

**Version:** 0.1 DRAFT · PostgreSQL

Design rules:
- **UUIDv7** primary keys everywhere (sortable, non-guessable, safe in URLs).
- **Nothing is hard-deleted.** `archived_at` on every user-facing entity.
- **All timestamps `timestamptz`, stored UTC.** Timezone is a display concern except for the
  Acharya's calendar, which is authoritative in IST.
- **Sanskrit is first-class.** Every displayable name has both a Latin/IAST and a Devanagari
  column. Devanagari is stored as verified Unicode NFC — never derived, never transliterated
  automatically for display.
- **The Acharya's judgment is always an explicit column**, never a computed one.

---

## 1. Identity

```
person
  id, role ('acharya'|'student'|'parent'|'assistant')
  email (unique, citext), email_verified_at
  phone, phone_country
  name_latin, name_devanagari, name_preferred
  timezone (IANA, e.g. 'Asia/Kolkata')  NOT NULL
  locale, avatar_url
  status ('invited'|'active'|'paused'|'alumni'|'declined')
  date_of_birth            -- nullable; determines minor status
  created_at, archived_at

auth_credential
  id, person_id, kind ('magic_link'|'google'|'password')
  identifier, secret_hash, last_used_at

session_token
  id, person_id, token_hash, expires_at, user_agent, ip_hash, revoked_at

guardian_link                       -- minors only
  id, guardian_person_id, student_person_id
  relationship, consent_recorded_at, consent_document_url
  can_view_feedback  bool DEFAULT false     -- see PRD §2
  UNIQUE (guardian_person_id, student_person_id)
```

Adults have no `guardian_link` row. Parent access exists only where a link exists — the
relationship is conditional, not a role that pervades the system.

---

## 2. Curriculum

```
path
  id, slug (unique)
  name_latin, name_devanagari          -- 'Sanskrit' / 'संस्कृताध्ययनपरम्परा'
  summary, philosophy_md
  duration_min_months, duration_max_months   -- NULL where open-ended
  sort_order, is_published, archived_at

stage
  id, path_id, stage_number
  name_latin, name_devanagari          -- 'Vākyanirmāṇam' / 'वाक्यनिर्माणम्'
  description_md
  duration_min_months, duration_max_months   -- NULL for Gītā and Yajurveda
  UNIQUE (path_id, stage_number)

syllabus_item
  id, stage_id, sort_order
  title_latin, title_devanagari        -- 'Śrī Rudram' / 'श्रीरुद्रम्'
  kind ('text'|'mantra'|'sukta'|'topic'|'grammar'|'chapter'|'stotra')
  reference                            -- 'Gītā 12.1–20', 'TS 4.5'
  notes_md, archived_at
```

Three levels, because the curricula have three: path → stage → item. Progress is measured
against items, which is why they must exist as rows rather than prose.

---

## 3. Enrollment

```
enrollment
  id, student_id, path_id
  current_stage_id
  status ('active'|'paused'|'completed'|'withdrawn')
  started_on, completed_on, paused_reason
  acharya_notes_md                     -- PRIVATE. Never exposed to student or parent.
  UNIQUE (student_id, path_id) WHERE status <> 'withdrawn'

item_progress
  id, enrollment_id, syllabus_item_id
  status ('not_started'|'in_progress'|'completed'|'mastered')
  marked_by_person_id                  -- always the Acharya
  marked_at, notes_md
  UNIQUE (enrollment_id, syllabus_item_id)

stage_completion
  id, enrollment_id, stage_id
  completed_on
  approved_by_person_id                -- explicit act, never computed
  avalokanam_id                        -- nullable: the assessment that gated it
  remarks_md
```

`item_progress.status = 'mastered'` is set **only** by the Acharya. There is deliberately no
trigger, no rule, and no percentage that advances a student.

---

## 4. Sessions — one-to-one and group in one shape

```
study_group                           -- optional convenience, not a cohort
  id, name, path_id, notes, archived_at

session_series                        -- a recurring slot
  id, path_id
  title
  study_group_id                       -- NULL => one-to-one series
  rrule                                -- RFC 5545, e.g. FREQ=WEEKLY;BYDAY=TU
  start_time_local, duration_minutes
  timezone DEFAULT 'Asia/Kolkata'      -- the Acharya's calendar is authoritative
  zoom_meeting_id, zoom_join_url, zoom_passcode   -- one recurring meeting per series
  status ('active'|'paused'|'ended'), archived_at

session
  id, series_id                        -- NULL for one-off sessions and orientations
  path_id                              -- NULL for an orientation
  kind ('class'|'orientation'|'avalokanam'|'makeup')
  scheduled_start_utc, scheduled_end_utc
  actual_start_utc, actual_end_utc
  status ('scheduled'|'completed'|'cancelled'|'rescheduled')
  cancellation_reason, rescheduled_to_session_id
  zoom_meeting_id, zoom_join_url
  acharya_notes_md                     -- private
  summary_for_students_md              -- what was covered
  created_at, archived_at

session_participant
  id, session_id, student_id
  attendance ('unknown'|'present'|'absent'|'late'|'excused')
  attendance_source ('zoom'|'manual')
  attendance_confirmed_by              -- the Acharya confirms; Zoom only suggests
  minutes_attended
  UNIQUE (session_id, student_id)

session_recording
  id, session_id
  storage_key, source ('zoom_cloud'|'uploaded'), duration_seconds
  available_to ('all_participants'|'absentees_only'|'none')
  available_until, created_at
```

**One participant makes it a one-to-one session; several make it a group.** Same table, same
screens. Deleting every `study_group` row leaves a fully coherent one-to-one platform.

Attendance from Zoom is a *suggestion*: `attendance_source='zoom'` with
`attendance_confirmed_by IS NULL` renders as "needs review," because Zoom display-name matching
is unreliable.

---

## 5. Abhyāsa and assigned work

Two objects, because the Acharya's philosophy lists them separately. 🔴 Confirm.

```
abhyasa_log                           -- the student's own daily practice
  id, enrollment_id, student_id
  practised_on (date), minutes
  what_md
  audio_key                            -- optional self-recording
  created_at
  UNIQUE (enrollment_id, practised_on)

assignment                            -- set by the Acharya
  id, path_id, stage_id, session_id
  title_latin, title_devanagari, brief_md
  submission_kinds text[]              -- {'audio','handwriting','devanagari_text','text'}
  due_at, allow_late DEFAULT true
  created_by, created_at, archived_at

assignment_target                     -- to a student, or to a group
  id, assignment_id, student_id, study_group_id
  CHECK (num_nonnulls(student_id, study_group_id) = 1)

submission
  id, assignment_id, student_id
  attempt_number DEFAULT 1
  submitted_at, is_late
  body_devanagari, body_text
  status ('draft'|'submitted'|'reviewed'|'resubmission_requested')
  UNIQUE (assignment_id, student_id, attempt_number)

submission_file
  id, submission_id
  kind ('audio'|'image'|'pdf'), storage_key
  mime_type, bytes, duration_seconds

review                                -- the Acharya's response
  id, submission_id, reviewed_by, reviewed_at
  grade ('uttamam'|'madhyamam'|'sadharanam'|'punarabhyasah')   -- 🔴 confirm scale
  feedback_md
  feedback_audio_key                   -- pronunciation correction in the Acharya's voice
  annotated_image_key                  -- marked-up handwriting
  requires_resubmission bool
```

`feedback_audio_key` is not a nice-to-have. Every curriculum names pronunciation correction as
central, and it cannot be delivered in text.

---

## 6. Avalokanam

```
avalokanam
  id, enrollment_id, student_id, path_id, stage_id
  kind ('continuous'|'stage')
  title, scheduled_for, session_id      -- for oral/viva conducted live
  status ('planned'|'in_progress'|'awaiting_declaration'|'declared')
  attempt_number DEFAULT 1
  previous_avalokanam_id                -- retake chain
  created_by, created_at

avalokanam_component
  id, avalokanam_id
  kind ('recitation'|'oral'|'written'|'objective')
  title, prompt_md, max_marks           -- marks optional; may be NULL throughout
  sort_order

avalokanam_response
  id, component_id, student_id
  body_devanagari, body_text, audio_key
  submitted_at

avalokanam_component_result
  id, component_id
  marks, grade, remarks_md
  assessed_by, assessed_at

avalokanam_result                       -- the Acharya's final judgment
  id, avalokanam_id
  outcome ('passed'|'not_yet'|'passed_with_distinction')
  overall_grade, remarks_md
  decided_by, decided_at
  declared_at                           -- NULL until the Acharya publishes
```

`outcome` is a stored decision, never derived from component marks. `declared_at` separates
*deciding* from *telling* — the result declaration moment.

The value `'not_yet'` rather than `'failed'` is deliberate: in this tradition a student who has
not yet reached the standard continues, they are not marked a failure.

---

## 7. Certificates

```
certificate
  id
  public_id (unique)                    -- opaque, non-sequential, never reused
  student_id, path_id, stage_id         -- stage_id NULL => whole-path certificate
  kind ('stage_completion'|'path_completion'|'participation')

  holder_name_latin, holder_name_devanagari   -- SNAPSHOT at issue; never re-read
  path_name_latin, path_name_devanagari
  benediction_devanagari, benediction_translation
  acharya_name, acharya_title, institution_name

  issued_on_gregorian (date)
  issued_samvatsara, issued_masa, issued_paksha, issued_tithi, issued_vara

  issued_by, issued_at
  pdf_key
  revoked_at, revoked_reason, revoked_by
  created_at
```

Every displayed value is **snapshotted at issue**. A certificate is a historical record; if the
Acharya's title changes in 2030, a 2026 certificate must still read as it did when granted.

`/verify/<public_id>` reads only this table. Permanent, unauthenticated, cached.

The pañcāṅga columns follow the model of the Acharya's own dīkṣānta certificate, which is dated
in both calendars.

---

## 8. Admissions

```
application
  id, submitted_at
  name_latin, email, phone, country, timezone
  date_of_birth, is_minor, guardian_name, guardian_email
  interested_path_ids uuid[]
  motivation_md, prior_study_md
  weekly_hours_available
  can_attend_live_fixed_time bool
  referral_source
  status ('new'|'orientation_scheduled'|'orientation_done'|'enrolled'|'waitlisted'|'declined')
  orientation_session_id
  acharya_notes_md                      -- private
  decided_by, decided_at
  created_person_id                     -- set when converted to a student
```

No amount, no fee, no payment field anywhere. Guru Dakṣiṇā is discussed personally and
recorded nowhere. *(See PRD §9 ruling 13.)*

---

## 9. Communications and operations

```
announcement
  id, audience ('all'|'path'|'group'|'student')
  path_id, study_group_id, student_id
  title, body_md, published_at, created_by

notification
  id, person_id
  kind, subject, body_md
  channel ('email'|'in_app')
  entity_type, entity_id
  scheduled_for, sent_at, read_at, failed_reason

audit_log                               -- immutable
  id, actor_person_id, action
  entity_type, entity_id
  before jsonb, after jsonb
  at, ip_hash

stored_file
  id, storage_key (unique), bucket
  owner_person_id, kind, mime_type, bytes
  sha256, uploaded_at, archived_at
```

`audit_log` is append-only and covers grade changes, mastery marks, result declarations,
certificate issue and revocation.

---

## 10. Notes on scale and integrity

At 150 students the largest tables are `submission` (~20k/yr), `session_participant` (~5k/yr),
and `abhyasa_log` (~50k/yr). This is small; correctness matters far more than optimisation.

Indexes that matter from day one: `session(scheduled_start_utc) WHERE status='scheduled'` ·
`submission(status) WHERE status='submitted'` (the review queue) · `certificate(public_id)` ·
`item_progress(enrollment_id)` · `notification(scheduled_for) WHERE sent_at IS NULL`.

Constraints worth enforcing in the database rather than the application: a student cannot hold
two active enrollments on one path · a session participant cannot be duplicated · a certificate's
`public_id` is immutable once written · `avalokanam_result.declared_at` cannot precede
`decided_at`.
