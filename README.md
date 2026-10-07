# ระบบวางแผนและจัดตารางนัดหมายสำหรับกลุ่มขนาดใหญ่

เว็บแอปพลิเคชันเพื่อการวางแผนและจัดตารางนัดหมายสำหรับกลุ่มขนาดใหญ่
ด้วยการวิเคราะห์เวลาว่างร่วมกัน

## โครงสร้าง

    backend/     NestJS + TypeORM + PostgreSQL
    frontend/    React + Vite + Tailwind CSS
    docs/        เอกสารประกอบและ schema ของฐานข้อมูล

## สิ่งที่ต้องมีก่อน

Node.js 20 ขึ้นไป · PostgreSQL 16 ขึ้นไป

## ตั้งค่าฐานข้อมูล

1. สร้าง database ใหม่ใน PostgreSQL
2. รัน `docs/my-schema.sql` เพื่อสร้างตาราง
3. คัดลอก `backend/.env.example` เป็น `backend/.env` แล้วกรอกค่าให้ครบ

ระบบตั้ง `synchronize: false` จึงไม่สร้างตารางให้เอง ต้องรัน SQL ด้วยมือ

## รัน

Backend — `http://localhost:3000`

    cd backend
    npm install
    npm run start:dev

Frontend — `http://localhost:5173`

    cd frontend
    npm install
    npm run dev

เอกสาร API (Swagger) — `http://localhost:3000/api`

## เอกสาร

อ่าน `docs/README.md` เพื่อดูสารบัญเอกสารทั้งหมด

## npm ที่มีการ install

npm install tailwindcss @tailwindcss/vite
npm install react-router-dom
npm install lucide-react
