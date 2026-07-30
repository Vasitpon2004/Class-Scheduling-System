import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// 1. Data Mapping: เก็บความสัมพันธ์ระหว่างคณะและสาขา
const facultyMajors: Record<string, string[]> = {
  "คณะเกษตร": [
    "สาขาเกษตรศาสตร์", "สาขาสัตวศาสตร์", "สาขาเทคโนโลยีชีวภาพทางการเกษตร", "สาขาเครื่องจักรกลและเมคคาทรอนิกส์เกษตร"
  ],
  "คณะวิศวกรรมศาสตร์": [
    "สาขาวิศวกรรมเกษตร", "สาขาวิศวกรรมชลประทาน", "สาขาวิศวกรรมการอาหาร", "สาขาวิศวกรรมโยธา", "สาขาวิศวกรรมเครื่องกล", "สาขาวิศวกรรมคอมพิวเตอร์และอิเล็กทรอนิกส์"
  ],
  "คณะศิลปศาสตร์และวิทยาศาสตร์": [
    "สาขาวิทยาการคอมพิวเตอร์", "สาขาเทคโนโลยีสารสนเทศ (IT)", "สาขาเคมี", "สาขาชีววิทยา", "สาขาฟิสิกส์", "สาขาจุลชีววิทยา", "สาขาคณิตศาสตร์", "สาขาการบัญชี", "สาขาการจัดการ", "สาขาการตลาด", "สาขาภาษาอังกฤษ", "สาขาภาษาตะวันออก"
  ],
  "คณะศึกษาศาสตร์และพัฒนศาสตร์": [
    "สาขาพลศึกษา", "สาขาคณิตศาสตร์ศึกษา", "สาขาวิทยาศาสตร์ศึกษา", "สาขาการจัดการเรียนรู้", "สาขาเกษตรและสิ่งแวดล้อมศึกษา"
  ],
  "คณะอุตสาหกรรมบริการ": [
    "สาขาการจัดการโรงแรม", "สาขาการจัดการการท่องเที่ยวร่วมสมัย", "สาขานวัตกรรมการท่องเที่ยวและการบริการ"
  ],
  "คณะวิทยาศาสตร์การกีฬา": [
    "สาขาวิทยาศาสตร์การกีฬาและการออกกำลังกาย"
  ]
};

const years = ["ปี1", "ปี2", "ปี3", "ปี4", "ปี5", "ปี6"];
const programs = ["ภาคปกติ", "ภาคพิเศษ"];

const NisitInfo = () => {
  // State Management
  const navigate = useNavigate();
  const location = useLocation(); // ใช้ useLocation เพื่อเข้าถึง state ที่ส่งมาจากหน้าก่อนหน้า
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [program, setProgram] = useState('');

  useEffect(() => {
    const hasState = location.state?.isAllowed;
    if (!hasState) {
      // ถ้าไม่มี state ที่ถูกส่งมาจากหน้าก่อนหน้า ให้เปลี่ยนหน้าไปยัง /register/nisit
      navigate('/register/nisit', { replace: true });
    }
  }, [navigate, location]);

  // ฟังก์ชันจัดการเมื่อเปลี่ยนคณะ
  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFaculty = e.target.value;
    setFaculty(selectedFaculty);
    // จุดสำคัญ: ต้องล้างค่าสาขาเสมอเมื่อมีการเปลี่ยนคณะ
    setMajor('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ faculty, major, year, program });
    navigate('/avatar-selection', {
      state: { isAllowed: true } // ส่งข้อมูล state ไปยังหน้าถัดไป
    });
    // TODO: ส่งข้อมูลไปยังหน้าถัดไป หรือ API
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
        Class Scheduling System
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-black mb-1">Register</h2>
          <p className="text-gray-400 text-sm font-medium">Enter your Information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* แถวที่ 1: คณะ และ สาขา */}
          <div className="grid grid-cols-2 gap-4">
            {/* เลือกคณะ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                คณะ
              </label>
              <select
                value={faculty}
                onChange={handleFacultyChange}
                className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
                required
              >
                <option value="" disabled>เลือกคณะ</option>
                {Object.keys(facultyMajors).map((fac) => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            </div>

            {/* เลือกสาขา */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สาขา
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                disabled={!faculty} // ปิดการใช้งานถ้ายังไม่เลือกคณะ
                className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white disabled:bg-gray-100 disabled:text-gray-400"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
                required
              >
                <option value="" disabled>
                  {faculty ? "เลือกสาขา" : "โปรดเลือกคณะก่อน"}
                </option>
                {/* 4. การดึงข้อมูล: ดึงอาร์เรย์ของสาขาตามคณะที่เลือกมาแสดง */}
                {faculty && facultyMajors[faculty].map((maj) => (
                  <option key={maj} value={maj}>{maj}</option>
                ))}
              </select>
            </div>
          </div>

          {/* แถวที่ 2: ชั้นปี และ ภาค */}
          <div className="grid grid-cols-4 gap-4">
            {/* เลือกชั้นปี (ใช้พื้นที่ 1 ส่วน) */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชั้นปี
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border border-gray-400 rounded-md px-2 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white text-center"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .3rem top 50%', backgroundSize: '.5rem auto' }}
                required
              >
                <option value="" disabled>-</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* เลือกภาค (ใช้พื้นที่ 1.5 หรือ 2 ส่วน ตามความสวยงาม) */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ภาค
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full border border-gray-400 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
                required
              >
                <option value="" disabled>เลือกภาค</option>
                {programs.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-200 font-medium mt-6"
          >
            ยืนยัน
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
};

export default NisitInfo;