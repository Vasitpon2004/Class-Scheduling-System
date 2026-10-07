//ตัวเลือก บทบาทผู้ใช้งาน
CREATE TYPE user_role          AS ENUM ('นิสิต','อาจารย์','แอดมิน');
//ตัวเลือก แผนการเรียนของนิสิต
CREATE TYPE study_plan_type    AS ENUM ('ภาคปกติ','ภาคพิเศษ');
//ตัวเลือก วันในสัปดาห์
CREATE TYPE weekday            AS ENUM ('จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์','อาทิตย์');
//ตัวเลือก ประเภทการนัดหมาย
CREATE TYPE appointment_type   AS ENUM ('นัดสอบ','นัดเรียนชดเชย');
//ตัวเลือก สถานะภาพรวมของตารางนัดหมายนั้น
CREATE TYPE appointment_status AS ENUM ('รอ','ยืนยัน','ยกเลิก');
//ตัวเลือก สถานะการตอบรับรายบุคคล
CREATE TYPE response_status    AS ENUM ('รอ','ยืนยัน','ปฏิเสธ');
//ตัวเลือก สถานะการสำรองข้อมูล
CREATE TYPE backup_status      AS ENUM ('สำเร็จ','เกิดข้อผิดพลาด');

//ตัวเลือก ประเภทกิจกรรมของระบบ
CREATE TYPE log_action AS ENUM(
	'อนุมัติอาจารย์','ปฏิเสธอาจารย์','เตะนิสิต','สร้างวิชา','สร้างนัดหมาย',
	'ยืนยันนัดหมาย','ยกเลิกนัดหมาย','รีเซ็ตภาคการเรียน','สร้างบัญชีแอดมิน'
);

//ตารางคณะ
CREATE TABLE faculties(
	id           SERIAL PRIMARY KEY, 
	//เก็บชื่อคณะและห้ามตั้งชื่อคณะซ้ำกัน
	faculty_name VARCHAR(150) NOT NULL UNIQUE 
);

//ตารางสาขา
CREATE TABLE majors(
	id           SERIAL PRIMARY KEY,
	major_name   VARCHAR(150) NOT NULL,
	//เก็บรหัสคณะที่สาขานั้นสังกัดอยู่
	faculty_id   INT NOT NULL REFERENCES faculties(id),
	
	//การสร้างกฎ ภายใต้คณะเดียวกัน จะมีชื่อสาขาวิชาซ้ำกันไม่ได้
	CONSTRAINT uq_major UNIQUE (faculty_id, major_name)
);

//การสร้าง index ให้กับ faculty_id ในตารางสาขา โดยไปดึงข้อมูลแบบเชื่อมความสัมพันธ์ ทำให้
//DB สามารถวิ่งไปหาข้อมูลสาขาตามรหัสคณะได้ทันทีโดยไม่ต้องอ่านทีละตาราง
CREATE INDEX idx_majors_faculty ON majors(faculty_id);

//ตารางภาคการศึกษา
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

	//กฎควบคุมความถูกต้องของข้อมูล โดยวันปิดเทอมต้องเกิดขึ้นหลังจากวันเปิดเทอม
	CONSTRAINT chk_semester_range CHECK (end_date > start_date)
);

//ทำการล็อกตารางไว้ คือ ข้อมูลภาคการศึกษาทั้งหมดจะมีแถวที่มีค่า is_active = TRUE ได้เพียง 1 แถวเท่านั้น 
CREATE UNIQUE INDEX idx_one_active_semester
	ON semesters (is_active) WHERE is_active = TRUE;

//ตารางผู้ใช้งาน
CREATE TABLE users(
	id                SERIAL PRIMARY KEY,
	first_name        VARCHAR(100) NOT NULL,
	last_name         VARCHAR(100) NOT NULL,
	user_code         VARCHAR(20) UNIQUE,
	email             VARCHAR(150) NOT NULL UNIQUE,
	password_hash     VARCHAR(255) NOT NULL,
	//เรียกใช้ ENUM user_role(นิสิต/อาจารย์/แอดมิน)
	role              user_role NOT NULL,
	major_id          INT REFERENCES majors(id),
	year              SMALLINT,
	//เรียกใช้ ENUM study_plan_type(ภาคปกติ/ภาคพิเศษ)
	study_plan        study_plan_type,
	is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
	is_approved       BOOLEAN NOT NULL DEFAULT FALSE,
	is_active         BOOLEAN NOT NULL DEFAULT TRUE,
	discord_id        VARCHAR(50) UNIQUE,
	discord_in_server BOOLEAN NOT NULL DEFAULT FALSE,
	created_at        TIMESTAMP NOT NULL DEFAULT NOW(),

	//กฎ บังคับให้ผู้ใช้ต้องใช้อีเมลของมหาวิทยาลัยเกษตรศาสตร์เท่านั้น
	CONSTRAINT chk_ku_email CHECK (email LIKE '%@ku.th'),

	//กฎ ถ้าไม่ใช่นิสิต ปี และแผนการเรียนต้องเป็นค่า NULL เสมอ
	CONSTRAINT chk_nisit_fields CHECK(
		role = 'นิสิต' OR (year IS NULL AND study_plan IS NULL)
	),

	//กฎ ชั้นปีต้องมีค่าอยู่ระหว่างปี 1-8 เท่านั้น
	CONSTRAINT chk_year_range CHECK (year IS NULL OR year BETWEEN 1 AND 8),

	//กฎ นิสิตจะต้องกรอก ชั้นปี แผนการเรียน รหัสประจำตัว และรหัสสาขา ให้ครบห้ามว่าง
	CONSTRAINT chk_nisit_required CHECK (
		role <> 'นิสิต' OR (
			year IS NOT NULL AND study_plan IS NOT NULL
			AND user_code IS NOT NULL AND major_id IS NOT NULL
		)
	),

	//กฎ อาจารย์จะต้องกรอก รหัสประจำตัว ห้ามปล่อยว่าง
	CONSTRAINT chk_professor_required CHECK (
		role <> 'อาจารย์' OR user_code IS NOT NULL
	),

	//กฎ อาจารย์จะต้องมีรหัสประจำตัวที่ประกอบไปด้วยอักษรภาษาอังกฤษพิมพ์ใหญ่ 1 ตัว ตามด้วยเลข 4 หลักเท่านั้น
	CONSTRAINT chk_professor_code_format CHECK (
		role <> 'อาจารย์' OR user_code ~ '^[A-Z][0-9]{4}$'
	)
);
//สร้าง index ช่วยให้แอดมินสามารถดึงรายชื่อผ้ใช้เฉพาะกลุ่มได้เร็วขึ้น
CREATE INDEX idx_users_role    ON users(role);
//สร้าง index ช่วยให้ผู้ใช้ค้นหาผู้ใช้แยกตามสาขา หรือ Joinตารางค้นหาคณะ/สาขาได้เร็วขึ้น
CREATE INDEX idx_users_major   ON users(major_id);
//สร้าง index ที่จะสร้างข้อมูลแถวที่ discord_id มีข้อมูลจริง ช่วยให้ระบบบอท Discord หรือการค้นหาและตรวจสอบผู้ใช้งานจากไอดี //Discordได้ไวขึ้น
CREATE INDEX idx_users_discord ON users(discord_id) WHERE discord_id IS NOT NULL;

//ตารางเก็บข้อมูลรหัส OTP ใช้ในระบบยืนยันตัวตน
CREATE TABLE otp_verify(
	id         SERIAL PRIMARY KEY,
	//ดึงข้อมูลผู้ใช้จาก user_id และตั้งเอาไว้ว่าถ้าบัญชีผู้ใช้งานคนนั้นถูกลบออกไปข้อมูลotpทั้งหมดที่ผูกกับผู้ใช้
	//คนนั้นก็จะถูกลบไปด้วย
	user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	otp_code   VARCHAR(6) NOT NULL,
	attempts   SMALLINT NOT NULL DEFAULT 0,
	is_used    BOOLEAN NOT NULL DEFAULT FALSE,      
	expires_at TIMESTAMP NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),

	//กฎ ควบคุมการกรอกรหัสผิดบังคับว่าห้ามกรอกผิดเกิน 5 ครั้ง
	CONSTRAINT chk_attempts CHECK (attempts >= 0 AND attempts <= 5)
);
//สร้าง index ที่ user_id เพื่อใช้ในการค้นหาแบบเจาะจงแถวข้อมูลของผู้ใช้รายนั้นได้ทันที
CREATE INDEX idx_otp_user ON otp_verify(user_id);

//ตารางโทเค็นรีเซ็ตรหัสผ่าน
CREATE TABLE password_reset_tokens(
	id         SERIAL PRIMARY KEY,
	user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	token      VARCHAR(255) NOT NULL UNIQUE,
	expires_at TIMESTAMP NOT NULL,
	is_used    BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
// สร้าง index ที่ user_id เพื่อช่วยในการค้นหาประวัติการขอรีเซ็ตรหัสผ่านของผู้ใช้งานแต่ละคนได้รวดเร็วขึ้น
CREATE INDEX idx_reset_user  ON password_reset_tokens(user_id);

//ตารางรายวิชา
CREATE TABLE courses(
	id             SERIAL PRIMARY KEY,
	course_code    VARCHAR(20) NOT NULL UNIQUE,
	course_name    VARCHAR(200) NOT NULL,
	created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

//ตารางกลุ่มเรียน
CREATE TABLE course_sections(
	id             SERIAL PRIMARY KEY,
	//ผูกข้อมูลไปยัง courses และถ้าวิชาหลักนั้นโดนลบ หมู่เรียนย่อยทั้งหมดที่ผูฏก็จะโดนลบไปด้วย
	course_id      INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
	//ผูกข้อมูลไปยัง semesters เพื่อระบุว่าหมู่เรียนนี้เปิดสอนเทอมไหน
	semester_id    INT NOT NULL REFERENCES semesters(id),
	course_section VARCHAR(10) NOT NULL,
	max_students   INT,
	created_at     TIMESTAMP NOT NULL DEFAULT NOW(),

	//กฎ เป็นการล็อคเอาไว้ว่า ในภาคการศึกษาเดียวกัน วิชาเรียนเดียวกัน จะมีหมู่เรียนซ้ำกันไม่ได้
	CONSTRAINT uq_course_section UNIQUE (course_id, course_section, semester_id)
);

//ตารางเรียนปกติปรจำสัปดาห์
CREATE TABLE course_schedules(
	id         SERIAL PRIMARY KEY,
	//ผูกข้อมูลไปยัง course_section และถ้าหมู่เรียนนั้นถูกลบ ตารางเรียนของหมู่นั้นก็จะโดนลบไปด้วย
	section_id INT NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
	course_day weekday NOT NULL,
	start_time TIME NOT NULL,
	end_time   TIME NOT NULL,
	room       VARCHAR(50),
	building   VARCHAR(50),

	//กฎ ป้องกันข้อมูลซ้ำกันคือ ในหมู่เรียนเดียวกันในวันเดียวกัน จะมีเวลาเริ่มเรียนซ้ำกันไม่ได้
	CONSTRAINT uq_course_schedule UNIQUE (section_id, course_day, start_time),
	//กฎ ตรวจความถูกต้องของเวลา บังคับว่าเวลาเลิกเรียนต้องมากกว่าเวลาเริ่มเรียน
	CONSTRAINT chk_schedule_time  CHECK (end_time > start_time)
);

//ตารางผู้สอนประจำหมู่เรียน
CREATE TABLE course_professors(
	id            SERIAL PRIMARY KEY,
	//ผูกข้อมูลไปยัง course_sections ถ้าหมู่เรียนนั้โดนลบข้อมูลการจับคู่อาจารย์ผู้สอนในหมู่นั้นก็จะโดนลบไปด้วย
	section_id    INT NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
	professor_id  INT NOT NULL REFERENCES users(id),

	//กฎ ป้องกันข้อมูลซ้ำโดยในกลุ่มเรียนเดียวกัน จะใส่ชื่ออาจารย์คนเดิมซ้ำเข้าไปอีกไม่ได้
	CONSTRAINT uq_section_professor UNIQUE (section_id, professor_id)
);
//สร้าง index เพื่อให้สามารถค้นหาข้อมูลได้อย่างรวดเร็วเวลาที่อาจารย์ล็อกอินเข้ามาแล้วระบบต้องคิวรีว่า อาจารย์คนนั้นมีตารางสอนของหมู่
//ไหนบ้างในเทอมนี้
CREATE INDEX idx_cp_professor ON course_professors(professor_id);

//ตารางรายชื่อสมาชิกนิสิตในกลุ่มเรียน
CREATE TABLE course_members(
	id         SERIAL PRIMARY KEY,
	//ผูกข้อมูลไปยัง course_sections ถ้าหมู่เรียนนั้นโดนลบรายชื่อนิสิตในหมู่นั้นก็จะโดนลบออกไปด้วย
	section_id INT NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
	//ผูกข้อมูลไปยัง users ถ้าบัญชีนิสิตคนนั้นโดนลบรายชื่อที่เขาอยู่ในหมู่เรียนก็จะโดนลบไปด้วย
	user_id    INT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
	joined_at  TIMESTAMP NOT NULL DEFAULT NOW(),

	//กฎที่จะเช็คว่า นิสิต 1 คน จะลงทะเบียนเรียนในหมู่เรียนเดียวกันซ้ำกันไม่ได้
	CONSTRAINT uq_section_member UNIQUE (section_id, user_id)
);
//สร้าง index เพื่อให้ระบบสามารถทำงานได้เร็วขึ้นเมื่อนิสิตเปิดหน้าแรกของเว็บแล้วระบบจะต้องดึงรายการว่า เทอมนี้เรียนอะไรบ้าง
CREATE INDEX idx_members_user   ON course_members(user_id);

//ตารางสร้างและจัดการนัดหมาย
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

	//กฎบังคับให้เวลาเลิกนัดต้องมากกว่าเวลาเริ่มนัด
	CONSTRAINT chk_appointment_time CHECK (end_time > start_time)
);
//สร้าง index ที่มี วันที่นัด และ สถานะ เพื่อให้ระบบสามารถไปตรวจสอบข้อมูลได้อย่างรวดเร็ว คือ ดูว่าวันดังกล่าวมีนัดหมายที่
//ยืนยันแล้วไปชนกับเวลาเรียนปกติหรือนัดหมายอื่น ๆ ของนิสิตหรือไม่
CREATE INDEX idx_appointment_conflict  ON appointments(appointment_date, status);

//สร้าง index เพื่อให้ระบบดึงข้อมูลการนัดหมายของหมู่เรียนนั้นมาได้รวดเร็วขึ้น
CREATE INDEX idx_appointment_section    ON appointments(section_id);
//สร้าง index เพื่อให้ระบบรายการนัดหมายทั้งหมดของอาจารย์มาได้รวดเร็วขึ้น
CREATE INDEX idx_appointment_professor ON appointments(professor_id);

//ตารางตอบรับการนัดหมาย
CREATE TABLE appointment_responses(
	id             SERIAL PRIMARY KEY,
	//ผูกข้อมูลไปยัง appointment ถ้าลบนัดหมายนั้นข้อมูลในแถวนี้จะหายไปด้วย
	appointment_id INT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
	user_id        INT NOT NULL REFERENCES users(id)        ON DELETE CASCADE,
	response       response_status NOT NULL DEFAULT 'รอ',
	reason         TEXT,
	responded_at   TIMESTAMP,

	//กฎ บังคับให้นิสิต 1 คนมีสิทธิ์ตอบรับตารางนัดหมายได้เพียง 1 ครั้งเท่านั้น
	CONSTRAINT uq_appointment_response UNIQUE (appointment_id, user_id),

	//กฎ บังคับว่าถ้านิสิตกด ปฎิเสธ นิสิตจะต้องกรอกข้อมูลช่องเหตุผลด้วยเสมอ ห้ามปล่อยว่าง
	CONSTRAINT chk_reject_reason CHECK (
		response <> 'ปฏิเสธ' OR (reason IS NOT NULL AND reason <> '')
	)
);
//สร้าง index เพื่อให้ระบบดึงประวัติการโหวตของนิสิตคนนั้นเพื่อนำมาใช้ได้
CREATE INDEX idx_response_user        ON appointment_responses(user_id);
//สร้าง index เพื่อให้ระบบดึงข้อมูลการโหวตทั้งหมดที่ผูกกับนัดหมายไอดีนี้มาเพื่อสรุปให้อาจารย์ดูได้ทันที
CREATE INDEX idx_response_appointment ON appointment_responses(appointment_id);

//ตารางประวัติกิจกรรมของระบบ
CREATE TABLE system_logs(
	id             SERIAL PRIMARY KEY,
	action         log_action NOT NULL,
	actor_user_id  INT REFERENCES users(id),
	target_user_id INT REFERENCES users(id),
	detail         TEXT,
	created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);
//สร้าง index ที่เรียงจากใหม่ไปเก่าเพื่อให้หน้าบ้านสามารถดึงข้อมูลไปดูประวัติได้อย่างรวดเร็ว
CREATE INDEX idx_logs_time  ON system_logs(created_at DESC);
//สร้าง index เพื่อค้นหา คัดกรอง หรือดึงประวัติกิจกรรมในระบบแยกตามประเภทการกระทำได้เร็วขึ้น
CREATE INDEX idx_log_action ON system_logs(action);

//ตารางบันทึกการสำรองข้อมูล
CREATE TABLE semester_backups(
	id          SERIAL PRIMARY KEY,
	semester_id INT NOT NULL REFERENCES semesters(id),
	admin_id    INT NOT NULL REFERENCES users(id),
	file_path   TEXT,
	status      backup_status NOT NULL,
	created_at  TIMESTAMP NOT NULL DEFAULT NOW(),

	//กฎ บังคับว่าถ้าสถานะการ backup สำเร็จช่องที่อยู่ไฟล์จะต้องมี link หรือที่อยู่ไฟล์แนบอยู่ด้วยเสมอ ห้ามว่าง
	CONSTRAINT chk_backup_file CHECK (status <> 'สำเร็จ' OR file_path IS NOT NULL)
);
//สร้าง index เพื่อให้ระบบค้นหาและดึงประวัติการแบคอัพข้อมูลแยกตามเทอมได้รวดเร็วขึ้น
CREATE INDEX idx_backups_semester ON semester_backups(semester_id);