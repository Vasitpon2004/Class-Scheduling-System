import { useState } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

interface ScheduleUploadProps {
  onNext: (file: File) => void; // บังคับต้องมีไฟล์เสมอ (ดูปุ่มด้านล่าง)
}

export default function ScheduleUpload({ onNext }: ScheduleUploadProps) {
  const [file, setFile] = useState<File | null>(null); // state ยังเป็น null ได้ตอนเริ่มต้น (ยังไม่เลือกไฟล์)

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; // ดึงไฟล์แรกที่เลือก
    if (f) setFile(f);
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-gray-800">Register</h2>
      <p className="mt-1 text-center text-sm text-gray-400">Upload your teaching schedule</p>

      <label className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-10 transition hover:border-blue-400 hover:bg-blue-50">
        <UploadCloud className="text-gray-400" size={28} />
        <span className="text-sm text-gray-600">คลิกเพื่ออัปโหลด Screenshot</span>
        <span className="text-xs text-gray-400">รองรับ .png, .jpg</span>
        <input type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handlePick} />
      </label>

      {file && (
        <div className="mt-4 flex items-center justify-between rounded-md border border-gray-300 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <ImageIcon size={16} className="text-blue-500" />
            {file.name}
          </div>
          <button type="button" onClick={() => setFile(null)}>
            <X size={16} className="text-red-500" />
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={!file}
        onClick={() => file && onNext(file)}
        className="mt-4 w-full rounded-md bg-black px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
      >
        ถัดไป
      </button>
    </div>
  );
}