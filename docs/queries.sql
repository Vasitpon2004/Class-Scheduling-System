-- ============================================================
--  Class Scheduling System — Query หลักที่ระบบใช้งานจริง
--  PostgreSQL 16
--
--  อ้างตาม schema 15 ตาราง (โครงสร้างรายวิชา 3 ชั้น)
--  ทุก Query ในไฟล์นี้ทดสอบรันผ่านบนฐานข้อมูลจริงแล้ว
--
--  ใช้เป็นแบบอ้างอิงตอนเขียน Service ใน NestJS
-- ============================================================


-- ============================================================
--  Query 1 — จับคู่รายวิชาที่ AI อ่านได้กับข้อมูลจริงในระบบ
--
--  OCR อ่านรูปตารางเรียนแล้วได้ course_code ออกมา
--  ระบบนำค่านั้นไปค้นในตาราง courses เท่านั้น
--  แล้วคืนหมู่เรียนทั้งหมดของวิชานั้นให้ผู้ใช้เลือกเอง
--
--  เหตุผลที่ให้ผู้ใช้เลือกหมู่: นิสิตรู้อยู่แล้วว่าตัวเองอยู่หมู่ไหน
--  ส่วนการเดาผิดทำให้คำนวณเวลาว่างผิด แล้วอาจารย์อาจนัดสอบทับคาบเรียน
-- ============================================================

SELECT
    c.id        AS course_id,
    c.course_code,
    c.course_name,
    sec.id      AS section_id,
    sec.course_section,
    sec.max_students,
    sch.course_day,
    sch.start_time,
    sch.end_time,
    sch.room,
    sch.building
FROM courses c
JOIN course_sections sec       ON sec.course_id = c.id
LEFT JOIN course_schedules sch ON sch.section_id = sec.id
WHERE c.course_code = '01418471'                              -- ค่าที่ OCR อ่านได้
  AND sec.semester_id = (SELECT id FROM semesters WHERE is_active)
ORDER BY sec.course_section, sch.start_time;

--  ใช้ LEFT JOIN เพราะหมู่เรียนที่ Admin ยังไม่ได้กรอกคาบเรียน
--  ต้องยังโผล่มาในผลลัพธ์ ถ้าใช้ JOIN ธรรมดา หมู่นั้นจะหายไปเงียบ ๆ
--  แล้วนิสิตที่ลงหมู่นั้นจะเข้าห้องเรียนไม่ได้โดยไม่มีใครรู้สาเหตุ


-- ============================================================
--  Query 2 — ตรวจสอบว่าวันที่เลือกอยู่ในช่วงสอบหรือไม่
--
--  ถ้าอยู่ในช่วงสอบ → ข้ามการตรวจคาบเรียนปกติ (Query 4)
--     เพราะช่วงสอบไม่มีการเรียนการสอนตามตาราง
--  แต่การตรวจนัดหมายซ้อน (Query 5) ไม่ข้ามไม่ว่ากรณีใด
-- ============================================================

SELECT EXISTS (
    SELECT 1 FROM semesters
    WHERE is_active
      AND ( DATE '2026-10-21' BETWEEN midterm_start_date AND midterm_end_date
         OR DATE '2026-10-21' BETWEEN final_start_date   AND final_end_date )
) AS is_exam_period;


-- ============================================================
--  Query 3 — ตารางเรียนของนิสิตหนึ่งคน
--  ใช้แสดงในหน้า "ตารางของฉัน"
--
--  ต้อง JOIN 4 ชั้น เพราะข้อมูลกระจายตามหลัก Normalization
--    course_members → course_sections → courses → course_schedules
-- ============================================================

SELECT
    c.course_code,
    c.course_name,
    sec.course_section,
    sch.course_day,
    sch.start_time,
    sch.end_time,
    sch.room,
    sch.building
FROM course_members m
JOIN course_sections sec  ON sec.id = m.section_id
JOIN courses c            ON c.id  = sec.course_id
JOIN course_schedules sch ON sch.section_id = sec.id
WHERE m.user_id = 3
  AND sec.semester_id = (SELECT id FROM semesters WHERE is_active)
ORDER BY sch.course_day, sch.start_time;

--  วิชาที่เรียนหลายวันจะขึ้นหลายแถว แถวละ 1 คาบ
--  ซึ่งถูกต้องสำหรับการวาดปฏิทิน เพราะต้องวาดทุกคาบ
--
--  หมายเหตุสำคัญ: ORDER BY course_day ใช้ได้ตรง ๆ ไม่ต้องแปลงอะไร
--  เพราะ ENUM เรียงตาม "ลำดับที่ประกาศใน CREATE TYPE" ไม่ใช่ตามตัวอักษร
--  ซึ่งในที่นี้ประกาศไว้เป็น จันทร์ → อาทิตย์ อยู่แล้วพอดี
--
--  ถ้าเก็บ day เป็น VARCHAR จะเรียงตามตัวอักษรไทยแล้วได้ลำดับผิด
--  (จันทร์, พฤหัสบดี, พุธ, ...) ต้องเขียน ARRAY_POSITION หรือ CASE มาช่วย
--  นี่คือข้อดีของ ENUM ที่มองข้ามได้ง่าย


-- ============================================================
--  Query 4 — ชั้นที่ 1 ของการตรวจเวลาว่าง: หานิสิตที่ติดคาบเรียนปกติ
--
--  เงื่อนไขซ้อนทับช่วงเวลา (Interval Overlap)
--      start_time < ช่วงที่นัดสิ้นสุด  AND  end_time > ช่วงที่นัดเริ่ม
--
--  ตัวอย่าง: อาจารย์จะนัดนิสิตในหมู่เรียน section_id = 1
--            วันจันทร์ เวลา 13:00–14:00
-- ============================================================

SELECT DISTINCT
    u.id,
    u.user_code,
    u.first_name,
    u.last_name,
    c2.course_code        AS clash_code,
    c2.course_name        AS clash_name,
    s2.course_section     AS clash_section,
    sch.course_day,
    sch.start_time,
    sch.end_time
FROM course_members m
JOIN users u              ON u.id  = m.user_id
JOIN course_members m2    ON m2.user_id = u.id         -- หมู่อื่นที่นิสิตคนนี้เรียน
JOIN course_sections s2   ON s2.id = m2.section_id
JOIN courses c2           ON c2.id = s2.course_id
JOIN course_schedules sch ON sch.section_id = s2.id    -- คาบเรียนของหมู่นั้น
WHERE m.section_id = 1                                 -- หมู่ที่จะนัด
  AND u.role        = 'นิสิต'
  AND s2.semester_id = (SELECT id FROM semesters WHERE is_active)
  AND sch.course_day  = 'จันทร์'                        -- วันในสัปดาห์ของวันที่นัด
  AND sch.start_time  < TIME '14:00'                   -- เวลาสิ้นสุดของนัด
  AND sch.end_time    > TIME '13:00'                   -- เวลาเริ่มของนัด
ORDER BY u.user_code;

--  จุดสำคัญ: JOIN ผ่าน course_sections ไม่ใช่ courses
--  ทำให้นิสิตหมู่ 700 กับหมู่ 800 ของวิชาเดียวกันไม่ปนกัน
--  ถ้าชี้ที่ courses ระบบจะรู้แค่ว่า "เรียนวิชานี้" แต่ไม่รู้หมู่
--  จึงไม่รู้เวลาเรียนที่แท้จริง


-- ============================================================
--  Query 5 — ชั้นที่ 2: หานิสิตที่ติดนัดหมายของอาจารย์คนอื่น
--
--  Query นี้ทำงานทุกครั้ง ไม่ข้ามแม้อยู่ในช่วงสอบ
--  เพราะช่วงสอบไม่มีคาบเรียนตามตาราง แต่นัดหมายเกิดขึ้นได้ตลอด
--
--  นี่คือส่วนที่ปิดช่องโหว่อาจารย์ 2 คนนัดนิสิตกลุ่มเดียวกันซ้อนเวลา
-- ============================================================

SELECT DISTINCT
    u.id,
    u.user_code,
    u.first_name,
    u.last_name,
    a.title       AS clash_appointment,
    a.start_time,
    a.end_time,
    p.first_name || ' ' || p.last_name AS clash_professor,
    a.status
FROM course_members m
JOIN users u                  ON u.id = m.user_id
JOIN appointment_responses ar ON ar.user_id = u.id
JOIN appointments a           ON a.id = ar.appointment_id
JOIN users p                  ON p.id = a.professor_id
WHERE m.section_id = 1                                 -- หมู่ที่จะนัด
  AND u.role       = 'นิสิต'
  AND a.appointment_date = DATE '2026-10-05'           -- วันที่จะนัด
  AND a.status IN ('รอ', 'ยืนยัน')                     -- ไม่นับที่ยกเลิกแล้ว
  AND a.start_time < TIME '14:00'
  AND a.end_time   > TIME '13:00'
ORDER BY u.user_code;

--  กฎการจัดการตามสถานะ
--    'ยืนยัน'  → บล็อก ถือว่าไม่ว่างแน่นอน
--    'รอ'      → เตือน แต่ยังเลือกได้ เพราะอาจถูกยกเลิกภายหลัง
--    'ยกเลิก'  → ไม่นับ


-- ============================================================
--  Query 6 — สรุปผลการตอบกลับของนัดหมาย
--
--  ใช้ในหน้าติดตามผล และใช้ตัดสินอัตโนมัติเมื่อครบ 24 ชั่วโมง
--  ถ้าสัดส่วนผู้ยืนยัน >= 80% ระบบถือว่านัดหมายสำเร็จ
--
--  นับได้เพราะระบบ INSERT แถวให้นิสิตทุกคนในหมู่ทันทีที่สร้างนัด
--  ด้วยสถานะ 'รอ' ถ้าสร้างเฉพาะคนที่ตอบ จะไม่รู้ว่าตัวหารเท่าไหร่
-- ============================================================

SELECT
    a.id,
    a.title,
    COUNT(*)                                       AS total,
    COUNT(*) FILTER (WHERE ar.response = 'ยืนยัน')  AS confirmed,
    COUNT(*) FILTER (WHERE ar.response = 'ปฏิเสธ')  AS rejected,
    COUNT(*) FILTER (WHERE ar.response = 'รอ')      AS waiting,
    ROUND(
        100.0 * COUNT(*) FILTER (WHERE ar.response = 'ยืนยัน') / COUNT(*),
        1
    ) AS confirmed_percent
FROM appointments a
JOIN appointment_responses ar ON ar.appointment_id = a.id
WHERE a.id = 1
GROUP BY a.id, a.title;


-- ============================================================
--  Query 7 — หานัดหมายทั้งหมดของภาคเรียนหนึ่ง
--
--  ตาราง appointments ไม่มีคอลัมน์ semester_id เพราะเป็น
--  Transitive Dependency (นัดหมาย → หมู่เรียน → ภาคเรียน)
--  จึงต้องเดินผ่าน course_sections
--
--  ใช้ตอนรีเซ็ตภาคเรียนและตอนสำรองข้อมูล
-- ============================================================

SELECT
    s.semester_name,
    COUNT(a.id) AS appointment_count
FROM semesters s
LEFT JOIN course_sections sec ON sec.semester_id = s.id
LEFT JOIN appointments a      ON a.section_id = sec.id
GROUP BY s.id, s.semester_name
ORDER BY s.semester_name;


-- ============================================================
--  Query 8 — รายชื่อสมาชิกของหมู่เรียน พร้อมแยกบทบาท
--  ใช้ในหน้าจัดการห้องเรียนของอาจารย์
-- ============================================================

SELECT
    u.id,
    u.user_code,
    u.first_name,
    u.last_name,
    u.role,
    u.year,
    u.study_plan,
    maj.major_name,
    m.joined_at
FROM course_members m
JOIN users u          ON u.id = m.user_id
LEFT JOIN majors maj  ON maj.id = u.major_id
WHERE m.section_id = 1
ORDER BY u.role, u.user_code;


-- ============================================================
--  Query 9 — ตรวจว่าอาจารย์มีสิทธิ์จัดการหมู่เรียนนี้จริง
--
--  ใช้ก่อนให้สร้างนัดหมาย เพื่อไม่ให้อาจารย์หมู่ 700
--  ไปจัดการหมู่ 800 ที่ตนไม่ได้สอน
-- ============================================================

SELECT EXISTS (
    SELECT 1 FROM course_professors
    WHERE section_id = 1
      AND professor_id = 1
) AS is_authorized;


-- ============================================================
--  จบไฟล์
--
--  หมายเหตุเรื่องค่า ENUM
--    schema นี้ใช้ค่าภาษาไทย เช่น 'นิสิต', 'ยืนยัน', 'จันทร์'
--    เวลาเขียน DTO ฝั่ง NestJS ต้องแปลงจากค่าที่ frontend ส่งมา
--    (เช่น "student") ให้เป็นค่าไทยก่อนบันทึก ไม่งั้นจะเจอ
--    ERROR: invalid input value for enum user_role: "student"
-- ============================================================
