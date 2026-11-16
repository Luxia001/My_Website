## Overview project

url project https://agnos-seven.vercel.app/
Framework ที่ใช้งาน NextJs สำหรับทำระบบฝั่ง frontend แสดงส่วน UX/UI และ backend ทำส่วนเชื่อมต่อกับฐานข้อมูลและการสร้าง route API
ฐานข้อมูลสำหรับระบบผู้ป่วยคือ MongoDB เชื่อมต่อผ่าน Prisma ORM
deploy on vercel

# feature
- บันทึกข้อมูลการลงทะเบียน พร้อม validate ในการตรวจสอบ input (url[https://agnos-seven.vercel.app/patient])
- แสดงรายการข้อมูลการลงทะเบียนและรีเฟรชทุก 5 วินาที (url[https://agnos-seven.vercel.app/admin])
- รายละเอียดของผู้ทำการลงทะเบียน

ขั้นตอนการติดตั้ง (รันจากโฟลเดอร์ `fe`)

1. รัน `npm ci`
2. คัดลอก `.env.example` เป็น `.env` แล้วตั้ง `MONGODB_URI` ให้ชี้ไปยัง MongoDB Atlas หรือ MongoDB ที่ตั้งเป็น replica set โดยใส่ชื่อฐานข้อมูลใน URI ด้วย
3. รัน `npm run db:push` เพื่อสร้าง collection และ index สำหรับอีเมลที่ห้ามซ้ำ
4. รัน `npm run dev`

บน Vercel ให้ตั้ง `MONGODB_URI` ใน Environment Variables ฝั่งเซิร์ฟเวอร์ แล้วรัน `npm run db:push` สำหรับฐานข้อมูลปลายทางแยกจากขั้นตอน build

ไฟล์ SQL ใน `prisma/migrations` เป็นประวัติของ PostgreSQL เดิม ข้อมูลเดิมจะไม่ถูกย้ายไป MongoDB อัตโนมัติ

## Development Planning documentation

# Project structure :

app

- page.tsx หน้าแรกแสดงปุ่มกดไปยังหน้าต่างๆในโปรเจกต์
- admin หน้าแสดงรายชื่อผู้ลงทะเบียนและรีเฟรชทุก 5 วินาที
- patient หน้าลงทะเบียนผู้ป่วย
- patient/[id] หน้ารายละเอียดงทะเบียนผู้ป่วย
- api ในการเชื่อมต่อ database
- tech แสดงตัว stack หรือ library ที่ใช้ในโปรเจกต์
  component
- layout ส่วนแสดงที่เป็นโครงสร้างหลักการทำงานเช่า navbar
- UI สำหรับเรียกใช้งาน UI ทัวไป
  lib
- prisma.ts เชื่อมต่อการใช้งานของ prisma
  public
- เก็บ static ไฟล์ภาพใช้งานผ่านตัวระบบ
  service
- function api ใช้ในการเชื่อมต่อหรือ เรียกใช้งาน
  env.
- key รหัสสำหรับการทำงานโปรแกรม

# Design :

สามารถแสดงแบบ responsive ได้ในส่วนหน้าลงทะเบียน และ หน้า staff
UI ใช้งานของ DaisyUI และ Tailwind

# Component Architecture

component

- layout
  - Navbar : แสดง Navigate bar ใช้ในการนำทางเข้าถึงหน้าต่างๆ
- UI
  - card : card แสดงปกข้อมูล

# การอัปเดตรายชื่อผู้ลงทะเบียน

หน้าลงทะเบียนบันทึกข้อมูลผ่าน `/api/patient` ลง MongoDB และหน้า admin เรียก API เดียวกันทุก 5 วินาทีเพื่ออัปเดตรายชื่อ

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
