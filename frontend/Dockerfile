# Stage 1: Build the React application
FROM node:20-alpine as builder

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# คัดลอกไฟล์ build ที่ได้จาก stage 1 ไปที่ Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# คัดลอกไฟล์ Nginx config เพื่อจัดการการ Routing (ถ้าใช้ React Router)
# สำหรับตัวอย่างนี้ เราใช้ default config ง่ายๆ
# ถ้ามีการ Routing ต้องเพิ่มไฟล์ nginx.conf เพื่อให้มัน redirect ไปที่ index.html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]