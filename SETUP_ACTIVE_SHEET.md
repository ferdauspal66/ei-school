# Setup Google Sheets dengan Active Sheet (Lebih Mudah!)

## 🚀 **Setup Cepat (5 Menit):**

### **1. Buat Google Sheets**

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama "EI School Keuangan"
3. **Rename sheet pertama** menjadi "Keuangan":
   - Klik kanan pada tab "Sheet1" → Rename → ketik "Keuangan"

### **2. Setup Google Apps Script**

1. Di Google Sheets, klik **Extensions** → **Apps Script**
2. Hapus kode default dan copy kode dari `google-apps-script/WebApp.gs`
3. **Simpan** project (Ctrl+S)
4. **Tidak perlu mengubah SHEET_ID** - script otomatis menggunakan spreadsheet yang aktif

### **3. Deploy sebagai Web App**

1. Klik **Deploy** → **New deployment**
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

### **5. Buat Sample Data**

1. Di Google Apps Script, jalankan function `createSampleData()`:
   - Pilih function `createSampleData` dari dropdown
   - Klik **Run** (▶️)
   - Authorize permissions jika diminta
2. Kembali ke Google Sheets, data sample akan muncul otomatis

## ✅ **Keuntungan Active Sheet:**

- ✅ **Tidak perlu copy SHEET_ID** - otomatis menggunakan spreadsheet yang aktif
- ✅ **Setup lebih cepat** - hanya 5 menit
- ✅ **Lebih aman** - tidak ada hardcoded ID
- ✅ **Mudah maintenance** - script dan data di tempat yang sama

## 🧪 **Testing:**

### **1. Test Google Apps Script**

Akses URL Web App:

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
    "headers": ["ID Santri", "Nama Santri", "SPP", "Saldo", "Laundry", "Lainnya"],
    "spreadsheetName": "EI School Keuangan"
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

### **Error: Sheet "Keuangan" tidak ditemukan**

- Pastikan sheet sudah di-rename menjadi "Keuangan"
- Pastikan Google Apps Script dibuat di spreadsheet yang sama

### **Error: Permission denied**

- Pastikan Google Apps Script deployed dengan permission "Anyone"
- Cek Google Sheets sharing settings

### **Error: Tidak ada data**

- Jalankan function `createSampleData()` di Google Apps Script
- Atau input manual data di Google Sheets

## 📚 **Available Functions:**

### **Di Google Apps Script:**

- `testConnection()` - Test koneksi
- `createSampleData()` - Buat data sample
- `getKeuanganData(santriId)` - Ambil data santri
- `getAllKeuanganData()` - Ambil semua data
- `updateKeuanganData(santriId, updateData)` - Update data
- `addSantriData(santriData)` - Tambah data santri
- `deleteSantriData(santriId)` - Hapus data santri

### **API Endpoints:**

- `GET ?action=test` - Test koneksi
- `GET ?action=all-data` - Ambil semua data
- `POST ?action=get-data` - Ambil data santri
- `POST ?action=update-data` - Update data

## 🎯 **Quick Start:**

1. **Buat Google Sheets** → Rename sheet jadi "Keuangan"
2. **Extensions** → **Apps Script** → Copy kode `WebApp.gs`
3. **Deploy** → **Web app** → Copy URL
4. **Update PHP** dengan URL Web App
5. **Run** `createSampleData()` di Apps Script
6. **Test** di frontend!

## 💡 **Tips:**

- **Backup data** Google Sheets secara berkala
- **Share spreadsheet** dengan tim jika diperlukan
- **Format angka** otomatis dengan `#,##0`
- **Header bold** dan background abu-abu untuk kemudahan membaca
