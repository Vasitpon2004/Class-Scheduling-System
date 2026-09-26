import { useState } from "react";
import { UserRound } from "lucide-react";

// รับ props ชื่อ onNext เป็นฟังก์ชันที่รับ File หรือ null
interface AvatarPickerProps {
  onNext: (avatar: File | null) => void;
}

export default function AvatarPicker({ onNext }: AvatarPickerProps) {
  const [avatar, setAvatar] = useState<File | null>(null); // เก็บไฟล์รูปที่ user เลือก

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => { // ทำงานตอน user เลือกไฟล์
    const file = e.target.files?.[0];
    if (file) setAvatar(file);
  };

  const previewUrl = avatar ? URL.createObjectURL(avatar) : null; // แปลง File object ให้กลายเป็น URL ชั่วคราวสำหรับ preview

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800">Register</h2>
      <p className="mt-1 text-sm text-gray-400">Choose your Avatar</p>

      <label className="mx-auto mt-6 flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-indigo-50 transition hover:bg-indigo-100">
        {previewUrl ? (
          <img src={previewUrl} alt="avatar preview" className="h-full w-full rounded-2xl object-cover" />
        ) : (
          <UserRound className="text-gray-700" size={40} />
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handlePick} />
      </label>
      <p className="mt-2 text-sm text-gray-400">
        {avatar ? avatar.name : "Click to pick your Avatar"}
      </p>

      <button
        type="button"
        onClick={() => onNext(avatar)}
        className="mt-6 w-full rounded-md bg-black px-4 py-2 font-medium text-white transition hover:bg-gray-800"
      >
        ยืนยัน
      </button>
    </div>
  );
}