-- ตรวจสอบว่าตารางยังไม่มีก่อนสร้าง
CREATE TABLE IF NOT EXISTS health_check (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    last_updated TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- ใส่ข้อมูลเริ่มต้น
INSERT INTO health_check (service_name, status) VALUES 
('Backend API', 'OK')
ON CONFLICT (id) DO NOTHING;