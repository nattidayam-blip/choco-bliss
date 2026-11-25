# Choco Bliss — โปรเจกต์ร้านช็อกโกแลตออนไลน์

เว็บไซต์ Landing Page โทนน้ำตาลครีม มีสินค้า 2 SKUs, ตะกร้าจำนวนสินค้า, แบบฟอร์มสั่งซื้อ, Google Sheets backend และข้อมูลสำหรับงานหยิบ/แพ็ก/จัดส่ง

## ไฟล์ในโปรเจกต์
- `index.html` หน้าเว็บไซต์
- `style.css` การออกแบบ responsive
- `app.js` รายการสินค้าและระบบตะกร้า/ส่งคำสั่งซื้อ
- `images/` รูปภาพสินค้า SVG (เปลี่ยนเป็นภาพถ่ายจริงได้)
- `apps-script/Code.gs` Google Apps Script สำหรับบันทึกข้อมูลลง Google Sheets

## 1) ตั้งค่า Google Sheets
1. สร้าง Google Sheet ใหม่ ตั้งชื่อ `Choco Bliss Orders`
2. คัดลอก Spreadsheet ID จาก URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. เปิด Extensions → Apps Script
4. คัดลอกโค้ดจาก `apps-script/Code.gs` ไปวางในไฟล์ `Code.gs`
5. แทนที่ `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` ด้วย Spreadsheet ID
6. เลือกฟังก์ชัน `initialize` แล้วกด Run และอนุญาตสิทธิ์
7. Deploy → New deployment → เลือกประเภท Web app
8. Execute as: Me และ Who has access: Anyone → Deploy
9. คัดลอก Web app URL ที่ลงท้ายด้วย `/exec`

ระบบจะสร้างชีต `Orders` และ `OrderItems` ให้อัตโนมัติ:
- Orders: ข้อมูลลูกค้า ที่อยู่ ยอดรวม และสถานะคำสั่งซื้อ
- OrderItems: รายการ SKU จำนวน ราคา และยอดต่อรายการ

## 2) เชื่อมเว็บไซต์กับ Google Sheets
เปิด `app.js` แล้วแทนที่
`PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`
ด้วย Web app URL ที่ได้จากขั้นตอนก่อนหน้า จากนั้นบันทึกไฟล์

> หมายเหตุ: ทดสอบการส่งคำสั่งซื้อด้วยข้อมูลตัวอย่างก่อนใช้งานจริง และอย่าใส่ข้อมูลลูกค้าจริงลงใน repository สาธารณะ

## 3) ทดสอบระบบ
1. เปิด `index.html` ผ่าน Live Server หรืออัปโหลดขึ้น GitHub Pages
2. เลือกจำนวนสินค้าอย่างน้อย 1 ชิ้น
3. กรอกชื่อ เบอร์โทร ที่อยู่ และรหัสไปรษณีย์
4. กดยืนยันคำสั่งซื้อ
5. ตรวจสอบชีต `Orders` และ `OrderItems`

## 4) กระบวนการหยิบ แพ็ก และจัดส่ง
- เปิด `Orders` เพื่อดูออเดอร์ใหม่ สถานะเริ่มต้นคือ `รอหยิบสินค้า`
- เปิด `OrderItems` เพื่อดู SKU และจำนวนที่ต้องหยิบ
- ผู้ปฏิบัติงานหยิบสินค้าตาม SKU และตรวจนับจำนวน
- ตรวจสินค้าอีกครั้งก่อนแพ็ก แล้วเปลี่ยนสถานะใน Orders เป็น `แพ็กแล้ว`
- นำชื่อ เบอร์โทร ที่อยู่ และรหัสไปรษณีย์จาก Orders ไปวางในระบบขนส่งเพื่อสร้างใบปะหน้าพัสดุ
- เมื่อส่งแล้วเปลี่ยนสถานะเป็น `จัดส่งแล้ว` และเพิ่มเลข Tracking ในคอลัมน์เพิ่มเติมได้

> โครงการนี้เตรียมข้อมูลสำหรับทำใบปะหน้า แต่ยังไม่ได้เชื่อม API บริษัทขนส่ง จึงต้องนำข้อมูลไปสร้างใบปะหน้าในระบบขนส่งด้วยตนเอง

## 5) ฝากไฟล์ไว้บน GitHub
1. สมัคร/เข้าสู่ระบบ https://github.com
2. กด New repository ตั้งชื่อ `choco-bliss` เลือก Public
3. อัปโหลดไฟล์และโฟลเดอร์ทั้งหมด โดยคงโครงสร้างเดิม
4. กด Commit changes

## 6) เผยแพร่ด้วย GitHub Pages
1. เข้า Repository → Settings → Pages
2. Source เลือก `Deploy from a branch`
3. Branch เลือก `main` และ Folder เลือก `/ (root)`
4. กด Save รอระบบเผยแพร่
5. เว็บไซต์จะอยู่ที่ `https://ชื่อผู้ใช้.github.io/choco-bliss/`

## 7) ใช้โดเมนของตัวเอง
1. ซื้อโดเมนจากผู้ให้บริการโดเมน
2. Repository → Settings → Pages → Custom domain ใส่โดเมน เช่น `www.example.com` แล้ว Save
3. ตั้งค่า DNS ที่ผู้ให้บริการโดเมน:
   - สำหรับ `www` เพิ่ม CNAME ชี้ไป `ชื่อผู้ใช้.github.io`
   - สำหรับโดเมนหลัก (apex) เพิ่ม A records ตาม IP ที่ GitHub Pages ระบุในเอกสารปัจจุบัน
4. รอ DNS เผยแพร่ แล้วกลับไป Settings → Pages เปิด Enforce HTTPS เมื่อพร้อม

คู่มือ GitHub Pages: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## ข้อควรทราบก่อนส่งงาน
- แก้ชื่อร้าน/สินค้า/ราคาได้ใน `app.js` และต้องแก้ราคา SKU ให้ตรงกันใน `Code.gs`
- รูปภาพ SVG เป็นภาพประกอบชั่วคราว เปลี่ยนเป็นรูปสินค้าจริงได้ในโฟลเดอร์ `images`
- เว็บไซต์นี้ยังไม่มีระบบชำระเงินออนไลน์ และไม่มี API ขนส่งอัตโนมัติ
- Google Apps Script Web App ที่ตั้งเป็น Anyone สามารถรับคำสั่งซื้อจากหน้าเว็บได้ ควรตรวจสอบข้อมูลและจำกัดการใช้งานเพิ่มเติมก่อนเปิดขายจริง
