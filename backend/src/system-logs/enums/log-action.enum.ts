//การประกาศ Enum หรือการระบุประเภทการกระทำ
export enum LogAction{
    APPROVE_PROFESSOR = 'อนุมัติอาจารย์',
    REJECT_PROFESSOR = 'ปฏิเสธอาจารย์',
    KICK_STUDENT = 'เตะนิสิต',
    CREATE_COURSE = 'สร้างวิชา',
    CREATE_APPOINTMENT = 'สร้างนัดหมาย',
    CONFIRM_APPOINTMENT = 'ยืนยันนัดหมาย',
    CANCEL_APPOINTMENT = 'ยกเลิกนัดหมาย',
    RESET_SEMESTER = 'รีเซ็ตภาคการเรียน',
    CREATE_ADMIN = 'สร้างบัญชีแอดมิน',
}