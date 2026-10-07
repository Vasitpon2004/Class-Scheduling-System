CREATE TYPE user_role          AS ENUM ('นิสิต','อาจารย์','แอดมิน');
CREATE TYPE study_plan_type    AS ENUM ('ภาคปกติ','ภาคพิเศษ');
CREATE TYPE weekday            AS ENUM ('จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์');
CREATE TYPE appointment_type   AS ENUM ('นัดสอบ','นัดเรียนชดเชย');
CREATE TYPE appointment_status AS ENUM ('รอ','ยืนยัน','ยกเลิก');
CREATE TYPE response_status    AS ENUM ('รอ','ยืนยัน','ปฏิเสธ');
CREATE TYPE backup_status      AS ENUM ('สำเร็จ','เกิดข้อผิดพลาด');

CREATE TYPE log_action AS ENUM(
	'อนุมัติอาจารย์','ปฏิเสธอาจารย์','เตะนิสิต','สร้างวิชา','สร้างนัดหมาย',
	'ยืนยันนัดหมาย','ยกเลิกนัดหมาย','รีเซ็ตภาคการเรียน','สร้างบัญชีแอดมิน'
);

CREATE TABLE faculties(
	id           SERIAL PRIMARY KEY,
	faculty_name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE majors(
	id           SERIAL PRIMARY KEY,
	major_name   VARCHAR(150) NOT NULL,
	faculty_id   INT NOT NULL REFERENCES faculties(id),

	CONSTRAINT uq_major UNIQUE (faculty_id, major_name)
);

CREATE INDEX idx_majors_faculty ON majors(faculty_id);

CREATE TABLE semesters(
	id                 SERIAL PRIMARY KEY,
	semester_name      VARCHAR(20) NOT NULL UNIQUE,
	start_date         DATE NOT NULL,
	end_date           DATE NOT NULL,
	midterm_start_date DATE,
	midterm_end_date   DATE,
	final_start_date   DATE,
	final_end_date     DATE,
	is_active          BOOLEAN NOT NULL DEFAULT FALSE,

	CONSTRAINT chk_semester_range CHECK (end_date > start_date)
);

CREATE UNIQUE INDEX idx_one_active_semester
	ON semesters (is_active) WHERE is_active = TRUE;

CREATE TABLE users(
	id                SERIAL PRIMARY KEY,
	first_name        VARCHAR(100) NOT NULL,
	last_name         VARCHAR(100) NOT NULL,
	user_code         VARCHAR(20) UNIQUE,
	email             VARCHAR(150) NOT NULL UNIQUE,
	password_hash     VARCHAR(255) NOT NULL,
	role              user_role NOT NULL,
	major_id          INT REFERENCES majors(id),
	year              SMALLINT,
	study_plan        study_plan_type,
	is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
	is_approved       BOOLEAN NOT NULL DEFAULT FALSE,
	is_active         BOOLEAN NOT NULL DEFAULT TRUE,
	discord_id        VARCHAR(50) UNIQUE,
	discord_in_server BOOLEAN NOT NULL DEFAULT FALSE,
	created_at        TIMESTAMP NOT NULL DEFAULT NOW(),

	CONSTRAINT chk_ku_email CHECK (email LIKE '%@ku.th'),

	CONSTRAINT chk_nisit_fields CHECK(
		role = 'นิสิต' OR (year IS NULL AND study_plan IS NULL)
	),

	CONSTRAINT chk_year_range CHECK (year IS NULL OR year BETWEEN 1 AND 8),

	CONSTRAINT chk_nisit_required CHECK (
		role <> 'นิสิต' OR (
			year IS NOT NULL AND study_plan IS NOT NULL
			AND user_code IS NOT NULL AND major_id IS NOT NULL
		)
	)
);
CREATE INDEX idx_users_role    ON users(role);
CREATE INDEX idx_users_major   ON users(major_id);
CREATE INDEX idx_users_discord ON users(discord_id) WHERE discord_id IS NOT NULL;

CREATE TABLE otp_verify(
	id         SERIAL PRIMARY KEY,
	user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	otp_code   VARCHAR(6) NOT NULL,
	attempts   SMALLINT NOT NULL DEFAULT 0,
	is_used    BOOLEAN NOT NULL DEFAULT FALSE,      
	expires_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),

	CONSTRAINT chk_attempts CHECK (attempts >= 0 AND attempts <= 5)
);
CREATE INDEX idx_otp_user ON otp_verify(user_id);

CREATE TABLE password_reset_tokens(
	id         SERIAL PRIMARY KEY,
	user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	token      VARCHAR(255) NOT NULL UNIQUE,
	expires_at TIMESTAMP NOT NULL,
	is_used    BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_reset_user  ON password_reset_tokens(user_id);

CREATE TABLE courses(
	id             SERIAL PRIMARY KEY,
	course_code    VARCHAR(20) NOT NULL UNIQUE,
	course_name    VARCHAR(200) NOT NULL,
	created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE course_sections(
	id             SERIAL PRIMARY KEY,
	course_id      INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
	semester_id    INT NOT NULL REFERENCES semesters(id),
	course_section VARCHAR(10) NOT NULL,
	max_students   INT,
	created_at     TIMESTAMP NOT NULL DEFAULT NOW(),

	CONSTRAINT uq_course_section UNIQUE (course_id, course_section, semester_id)
);

CREATE TABLE course_schedules(
	id         SERIAL PRIMARY KEY,
	section_id INT NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
	course_day weekday NOT NULL,
	start_time TIME NOT NULL,
	end_time   TIME NOT NULL,
	room       VARCHAR(50),
	building   VARCHAR(50),

	CONSTRAINT uq_course_schedule UNIQUE (section_id, course_day, start_time),
	CONSTRAINT chk_schedule_time  CHECK (end_time > start_time)
);

CREATE TABLE course_professors(
	id            SERIAL PRIMARY KEY,
	section_id    INT NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
	professor_id  INT NOT NULL REFERENCES users(id),

	CONSTRAINT uq_section_professor UNIQUE (section_id, professor_id)
);
CREATE INDEX idx_cp_professor ON course_professors(professor_id);

CREATE TABLE course_members(
	id         SERIAL PRIMARY KEY,
	section_id INT NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
	user_id    INT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
	joined_at  TIMESTAMP NOT NULL DEFAULT NOW(),

	CONSTRAINT uq_section_member UNIQUE (section_id, user_id)
);
CREATE INDEX idx_members_user   ON course_members(user_id);

CREATE TABLE appointments(
	id                SERIAL PRIMARY KEY,
	section_id        INT NOT NULL REFERENCES course_sections(id),
	professor_id      INT NOT NULL REFERENCES users(id),
	type              appointment_type NOT NULL,
	title             VARCHAR(200) NOT NULL,
	appointment_date  DATE NOT NULL,
	start_time        TIME NOT NULL,
	end_time          TIME NOT NULL,
	building          VARCHAR(50),
	room              VARCHAR(50),
	description       TEXT,
	status            appointment_status NOT NULL DEFAULT 'รอ',
	response_deadline TIMESTAMP NOT NULL,
	created_at        TIMESTAMP NOT NULL DEFAULT NOW(),

	CONSTRAINT chk_appointment_time CHECK (end_time > start_time)
);
CREATE INDEX idx_appointment_conflict  ON appointments(appointment_date, status);
CREATE INDEX idx_appointment_section    ON appointments(section_id);
CREATE INDEX idx_appointment_professor ON appointments(professor_id);

CREATE TABLE appointment_responses(
	id             SERIAL PRIMARY KEY,
	appointment_id INT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
	user_id        INT NOT NULL REFERENCES users(id)        ON DELETE CASCADE,
	response       response_status NOT NULL DEFAULT 'รอ',
	reason         TEXT,
	responded_at   TIMESTAMP,

	CONSTRAINT uq_appointment_response UNIQUE (appointment_id, user_id),

	CONSTRAINT chk_reject_reason CHECK (
		response <> 'ปฏิเสธ' OR (reason IS NOT NULL AND reason <> '')
	)
);
CREATE INDEX idx_response_user        ON appointment_responses(user_id);
CREATE INDEX idx_response_appointment ON appointment_responses(appointment_id);

CREATE TABLE system_logs(
	id             SERIAL PRIMARY KEY,
	action         log_action NOT NULL,
	actor_user_id  INT REFERENCES users(id),
	target_user_id INT REFERENCES users(id),
	detail         TEXT,
	created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_logs_time  ON system_logs(created_at DESC);
CREATE INDEX idx_log_action ON system_logs(action);

CREATE TABLE semester_backups(
	id          SERIAL PRIMARY KEY,
	semester_id INT NOT NULL REFERENCES semesters(id),
	admin_id    INT NOT NULL REFERENCES users(id),
	file_path   TEXT,
	status      backup_status NOT NULL,
	created_at  TIMESTAMP NOT NULL DEFAULT NOW(),

	CONSTRAINT chk_backup_file CHECK (status <> 'สำเร็จ' OR file_path IS NOT NULL)
);
CREATE INDEX idx_backups_semester ON semester_backups(semester_id);