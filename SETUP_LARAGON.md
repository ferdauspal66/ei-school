# Setup Laragon untuk Electronic Islamic School Management System

## 📋 **Langkah-langkah Setup:**

### **1. Install Laragon**

- Download Laragon dari: https://laragon.org/download/
- Install Laragon di folder `C:\laragon\` (default)
- Jalankan Laragon sebagai Administrator

### **2. Setup Database**

1. **Buka phpMyAdmin:**
   - Klik "Database" di Laragon
   - Buka phpMyAdmin (http://localhost/phpmyadmin)

2. **Import Database:**
   - Login dengan username: `root` (password kosong)
   - Klik "Import" tab
   - Pilih file `database/schema.sql`
   - Klik "Go" untuk import

3. **Verifikasi Database:**
   - Pastikan database `ei_school_db` sudah dibuat
   - Cek tabel `users` dan `santri` sudah ada

### **3. Setup Project Structure**

```
C:\laragon\www\ei-school\
├── backend/
│   ├── api/
│   │   └── auth.php
│   ├── config/
│   │   └── database.php
│   └── models/
│       └── User.php
├── database/
│   └── schema.sql
└── (Vue.js files)
```

### **4. Konfigurasi Laragon**

1. **Start Services:**
   - Apache
   - MySQL
   - PHP

2. **Access URL:**
   - Frontend Vue: `http://localhost:5173` (Vite dev server)
   - Backend API: `http://localhost/ei-school/backend/api/auth.php`

### **5. Test API**

Buka browser dan akses:

```
http://localhost/ei-school/backend/api/auth.php?action=check
```

Response yang diharapkan:

```json
{
  "success": true,
  "message": "API berjalan dengan baik"
}
```

## 🔧 **Troubleshooting:**

### **Error: Connection refused**

- Pastikan MySQL service running di Laragon
- Cek port 3306 tidak digunakan aplikasi lain

### **Error: Database not found**

- Pastikan database `ei_school_db` sudah diimport
- Cek file `database/schema.sql` sudah dijalankan

### **Error: CORS**

- Pastikan header CORS sudah diset di `backend/api/auth.php`
- Cek browser console untuk error CORS

### **Error: 404 Not Found**

- Pastikan file PHP ada di path yang benar
- Cek Apache service running
- Pastikan file `.htaccess` tidak memblokir akses

## 📝 **Default Credentials:**

### **Admin Account:**

- Email: `admin@example.com`
- Password: `password` (default Laravel hash)

### **Test User:**

- Email: `test@example.com`
- Password: `123456`

### **Available Santri IDs (for testing):**

- `A123456789` - Ahmad Fauzi Rahman (Kelas 7 SMP)
- `B987654321` - Fatimah Zahra (Kelas 5 SD)
- `C456789123` - Muhammad Ali (Kelas 10 SMA)
- `D789123456` - Aisyah Putri (Kelas 3 SD)
- `E321654987` - Abdullah Rahman (Kelas 8 SMP)

## 🚀 **Next Steps:**

1. **Test Register:** Buat akun baru melalui halaman register
2. **Test Login:** Login dengan akun yang sudah dibuat
3. **Test API:** Gunakan Postman untuk test API endpoints
4. **Development:** Lanjutkan development fitur lainnya

## 📚 **API Endpoints:**

### **Authentication API:**

#### **POST /backend/api/auth.php?action=register**

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

#### **POST /backend/api/auth.php?action=login**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

#### **GET /backend/api/auth.php?action=check**

- Test API status

### **Santri API:**

#### **POST /backend/api/santri.php?action=validate**

```json
{
  "santri_id": "A123456789"
}
```

#### **POST /backend/api/santri.php?action=add-to-parent**

```json
{
  "parent_id": 1,
  "santri_id": "A123456789"
}
```

#### **GET /backend/api/santri.php?action=list&parent_id=1**

- Get list santri by parent

#### **GET /backend/api/santri.php?action=all**

- Get all santri (admin)

#### **DELETE /backend/api/santri.php?action=remove**

```json
{
  "parent_id": 1,
  "santri_id": 1
}
```

## 🔒 **Security Notes:**

- Password di-hash menggunakan `password_hash()`
- Input di-sanitize menggunakan `htmlspecialchars()`
- CORS header sudah dikonfigurasi
- PDO prepared statements untuk mencegah SQL injection
