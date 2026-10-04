
interface PendingApprovalProps {
  email?: string;
  onApproved: () => void;
}

export default function PendingApproval({email, onApproved}: PendingApprovalProps){
    return (
        <div className="text-center">
            <span className="inline-block rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-700">
                รอการอนุมัติ
            </span>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
                บัญชีอาจารย์ของคุณกำลังรอตรวจสอบ
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
                ยืนยันอีเมล {email || "[ชื่อ]@ku.th"} เรียบร้อยแล้ว Admin จะตรวจสอบและอนุมัติบัญชี
                คุณจะเข้าใช้งานได้เมื่อได้รับการอนุมัติ
            </p>

            <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">จำลองผลลัพธ์:</p>
                <div className="mt-2 flex items-center justify-center gap-4 text-sm">
                    <button type="button" onClick={onApproved} className="text-blue-600 hover:underline">
                        อนุมัติแล้ว (ถัดไป)
                    </button>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">ยังรออยู่</span>
                </div>
            </div>
        </div>
    );
}