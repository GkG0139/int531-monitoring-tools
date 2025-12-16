import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ดูข้อมูลเพิ่มเติมเกี่ยวกับการตั้งค่าได้ที่ https://vitejs.dev/config/
export default defineConfig({
  // Plugins ที่ใช้:
  plugins: [react()],
  
  // การตั้งค่า Server (สำหรับการพัฒนาในเครื่อง):
  server: {
    // พอร์ตที่ Dev Server จะรัน (ถ้าไม่ใช้ Docker)
    port: 3000, 
    // ให้เซิร์ฟเวอร์เปิดรับการเชื่อมต่อจากภายนอก (จำเป็นสำหรับ Docker/Network)
    host: '0.0.0.0'
  },
  
  // การตั้งค่า Build (สำหรับการสร้างไฟล์ Production):
  build: {
    // กำหนดว่าไฟล์ที่สร้างเสร็จแล้ว (Output) จะไปอยู่ที่ไหน
    outDir: 'dist',
    emptyOutDir: true
  }
});