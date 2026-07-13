# Academic Class Scheduling System

Web-based scheduling tool for university exams and make-up classes — automated conflict detection, real-time availability checking, and notification system.

**Stack:** React (Vite) · Tailwind CSS v4 · NestJS · PostgreSQL · TypeScript

---

## Prerequisites

- **Node.js:** v18.0 or higher
- **Package Manager:** npm v9.0 or higher
- **Database:** PostgreSQL v14.0 or higher
- **Version Control:** Git

---

## Local Setup

### 1. Clone the repository

```
git clone https://github.com/Vasitpon2004/Class-Scheduling-System.git
cd Class-Scheduling-System
```

### 2. Database Setup

```
CREATE DATABASE class_scheduling_db;
```

### 3. Backend Setup

```
cd backend

# ติดตั้ง Dependencies ทั้งหมด
npm install

# คัดลอกไฟล์ตั้งค่า Environment
cp .env.example .env
```

### 4. Frontend Setup

```
cd frontend

# ติดตั้ง Dependencies ทั้งหมด (รวมถึง Tailwind v4)
npm install

# คัดลอกไฟล์ตั้งค่า Environment
cp .env.example .env
```


## Project Structure

```
Class-Scheduling-System/
├── frontend/                 # ระบบหน้าบ้าน (React + Vite + Tailwind v4)
│   ├── src/                  
│   │   ├── components/       # UI Components (ปุ่ม, ฟอร์ม, Navbar)
│   │   ├── pages/            # หน้าจอต่างๆ (Login, Calendar, Dashboard)
│   │   └── services/         # ฟังก์ชันเชื่อมต่อ API (Axios)
│   └── package.json
│
└── backend/                  # ระบบหลังบ้าน (NestJS)
    ├── src/
    │   ├── auth/             # ระบบ Login & ตรวจสอบสิทธิ์
    │   ├── appointments/     # โลจิกการจองตารางและตรวจสอบเวลาซ้อนทับ
    │   └── users/            # จัดการข้อมูล นิสิต, อาจารย์, แอดมิน
    └── package.json
```

## Command 

| Command | Description |
|---|---|
| `npm run dev` | Run Frontend for dev |
| `npm run build` | Create file for deploy |
| `npm run start:dev` | Run Backend for dev |
| `npm run test` | Run Unit Test |

## Git Workflow

| Command | Description |
|---|---|
| `git add .` | save |
| `git commit -m "Test"` | create commit |
| `git push -u origin Name_branch` | push your work into github |
