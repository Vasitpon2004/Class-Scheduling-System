import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // ไปค้นดูในความจำเบราว์เซอร์ (localStorage) ว่ามีตัวแปร isAuth และเป็น true ไหม
  const isAuth = localStorage.getItem('isAuth') === 'true';

  // ถ้าไม่มีตั๋ว (ยังไม่ได้ Login)
  if (!isAuth) {
    // ให้เด้งกลับไปหน้า /login ทันที (replace: true คือไม่ให้กดปุ่ม Back กลับมาได้)
    return <Navigate to="/login" replace />;
  }

  // ถ้ามีตั๋วแล้ว อนุญาตให้ผ่านไปหน้าข้างในได้ (Outlet คือหน้าลูกๆ ที่เราเอาไปครอบไว้)
  return <Outlet />;
};

export default ProtectedRoute;