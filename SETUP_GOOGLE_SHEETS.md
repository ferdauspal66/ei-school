# Setup Google Sheets untuk Menu Keuangan

## 📋 **Langkah-langkah Setup:**

### **1. Buat Google Sheets**

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama "EI School Keuangan"
3. **Rename sheet pertama** menjadi "Keuangan" (klik kanan pada tab sheet → Rename)

### **2. Setup Google Apps Script**

1. Buka [Google Apps Script](https://script.google.com)
2. Buat project baru dengan nama "EI School Keuangan API"
3. Copy kode dari `google-apps-script/WebApp.gs` ke editor
4. **Tidak perlu mengubah SHEET_ID** - script akan menggunakan Active Spreadsheet

### **3. Deploy sebagai Web App**

1. Klik **Deploy** > **New deployment**
2. Pilih type: **Web app**
3. Set permissions:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Klik **Deploy**
5. Copy **Web App URL** yang dihasilkan

### **4. Update PHP API**

1. Buka file `backend/api/keuangan.php`
2. Ganti URL di baris 18:
   ```php
   $GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### **5. Setup Data di Google Sheets**

1. Buka Google Sheets yang sudah dibuat
2. Pastikan sheet bernama "Keuangan" (sudah di-rename di langkah 1)
3. Buat header di baris 1:
   ```
   A1: ID Santri
   B1: Nama Santri
   C1: SPP
   D1: Saldo
   E1: Laundry
   F1: Lainnya
   ```

### **6. Buat Sample Data**

1. Buka Google Apps Script
2. Jalankan function `createSampleData()` untuk membuat data contoh otomatis
3. Atau input manual data seperti ini:

| ID Santri  | Nama Santri        | SPP    | Saldo  | Laundry | Lainnya |
| ---------- | ------------------ | ------ | ------ | ------- | ------- |
| A123456789 | Ahmad Fauzi Rahman | 500000 | 250000 | 50000   | 25000   |
| B987654321 | Fatimah Zahra      | 450000 | 200000 | 45000   | 20000   |
| C456789123 | Muhammad Ali       | 600000 | 300000 | 60000   | 30000   |
| D789123456 | Aisyah Putri       | 400000 | 150000 | 40000   | 15000   |
| E321654987 | Abdullah Rahman    | 550000 | 275000 | 55000   | 27500   |

## 🧪 **Testing:**

### **1. Test Google Apps Script**

Akses URL Web App dengan parameter:

```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=test
```

Response yang diharapkan:

```json
{
  "success": true,
  "message": "Koneksi berhasil",
  "data": {
    "sheetName": "Keuangan",
    "totalRows": 6,
    "headers": ["ID Santri", "Nama Santri", "SPP", "Saldo", "Laundry", "Lainnya"]
  }
}
```

### **2. Test PHP API**

Akses: `http://localhost/ei-school/backend/api/keuangan.php?action=test`

### **3. Test Frontend**

1. Login ke aplikasi
2. Masuk ke menu "Santri Saya"
3. Tambahkan santri dengan ID yang ada di Google Sheets
4. Masuk ke menu "Keuangan"
5. Pilih santri dan lihat data keuangan

## 🔧 **Troubleshooting:**

### **Error: Sheet tidak ditemukan**

- Pastikan nama sheet adalah "Keuangan"
- Pastikan Google Apps Script dibuat di spreadsheet yang sama
- Cek apakah sheet "Keuangan" sudah dibuat

### **Error: Kolom tidak sesuai**

- Pastikan header di baris 1 sesuai dengan yang diharapkan
- Gunakan function `createSampleData()` untuk membuat format yang benar

### **Error: Permission denied**

- Pastikan Google Apps Script deployed dengan permission "Anyone"
- Cek Google Sheets sharing settings

### **Error: CORS**

- Google Apps Script sudah handle CORS otomatis
- Pastikan URL Web App sudah benar

## 📚 **API Endpoints:**

### **GET /backend/api/keuangan.php?action=test**

- Test koneksi ke Google Sheets

### **POST /backend/api/keuangan.php?action=get-data**

```json
{
  "santri_id": "A123456789"
}
```

### **GET /backend/api/keuangan.php?action=all-data**

- Ambil semua data keuangan

### **POST /backend/api/keuangan.php?action=update-data**

```json
{
  "santri_id": "A123456789",
  "update_data": {
    "spp": 600000,
    "saldo": 300000
  }
}
```

## 🔒 **Security Notes:**

- Google Apps Script URL bisa diakses publik (sesuai kebutuhan)
- Data di Google Sheets bisa diatur sharing permissions
- Untuk production, pertimbangkan autentikasi tambahan
- Backup data Google Sheets secara berkala

## 🚀 **Next Steps:**

1. **Setup Google Sheets** dengan data real
2. **Deploy Google Apps Script** sebagai Web App
3. **Update PHP API** dengan URL yang benar
4. **Test integration** end-to-end
5. **Add more features** seperti update data, history, dll
