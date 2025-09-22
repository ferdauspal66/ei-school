/**
 * Google Apps Script untuk Electronic Islamic School Management System
 * Mengakses data keuangan dari Active Sheet dengan nama "Keuangan"
 */

/**
 * Function untuk mengambil data keuangan berdasarkan ID Santri
 * @param {string} santriId - ID Santri
 * @return {Object} Data keuangan santri
 */
function getKeuanganData(santriId) {
  try {
    // Ambil active spreadsheet dan sheet "Keuangan"
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName('Keuangan')

    if (!sheet) {
      throw new Error(
        'Sheet "Keuangan" tidak ditemukan. Pastikan sheet dengan nama "Keuangan" sudah dibuat.',
      )
    }

    // Ambil semua data
    const data = sheet.getDataRange().getValues()

    // Cek apakah ada data
    if (data.length <= 1) {
      return {
        success: false,
        message: 'Tidak ada data di sheet Keuangan. Pastikan sudah ada header dan data.',
      }
    }

    const headers = data[0] // Header row

    // Cari index kolom
    const idIndex = headers.indexOf('ID Santri')
    const namaIndex = headers.indexOf('Nama Santri')
    const sppIndex = headers.indexOf('SPP')
    const saldoIndex = headers.indexOf('Saldo')
    const laundryIndex = headers.indexOf('Laundry')
    const lainnyaIndex = headers.indexOf('Lainnya')

    // Validasi kolom
    if (
      idIndex === -1 ||
      namaIndex === -1 ||
      sppIndex === -1 ||
      saldoIndex === -1 ||
      laundryIndex === -1 ||
      lainnyaIndex === -1
    ) {
      throw new Error(
        'Format kolom tidak sesuai. Pastikan header di baris 1: ID Santri, Nama Santri, SPP, Saldo, Laundry, Lainnya',
      )
    }

    // Cari data berdasarkan ID Santri
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[idIndex] && row[idIndex].toString().trim() === santriId.toString().trim()) {
        return {
          success: true,
          data: {
            id_santri: row[idIndex],
            nama_santri: row[namaIndex] || '',
            spp: parseFloat(row[sppIndex]) || 0,
            saldo: parseFloat(row[saldoIndex]) || 0,
            laundry: parseFloat(row[laundryIndex]) || 0,
            lainnya: parseFloat(row[lainnyaIndex]) || 0,
          },
        }
      }
    }

    // Jika tidak ditemukan
    return {
      success: false,
      message: 'Data keuangan untuk ID Santri ' + santriId + ' tidak ditemukan',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + error.message,
    }
  }
}

/**
 * Function untuk mengambil semua data keuangan
 * @return {Object} Semua data keuangan
 */
function getAllKeuanganData() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName('Keuangan')

    if (!sheet) {
      throw new Error(
        'Sheet "Keuangan" tidak ditemukan. Pastikan sheet dengan nama "Keuangan" sudah dibuat.',
      )
    }

    const data = sheet.getDataRange().getValues()

    if (data.length <= 1) {
      return {
        success: true,
        data: [],
        message: 'Tidak ada data di sheet Keuangan',
      }
    }

    const headers = data[0]

    // Validasi kolom
    const requiredColumns = ['ID Santri', 'Nama Santri', 'SPP', 'Saldo', 'Laundry', 'Lainnya']
    const missingColumns = requiredColumns.filter((col) => !headers.includes(col))

    if (missingColumns.length > 0) {
      throw new Error('Kolom yang hilang: ' + missingColumns.join(', '))
    }

    const result = []
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[0]) {
        // Jika ID Santri tidak kosong
        result.push({
          id_santri: row[0],
          nama_santri: row[1] || '',
          spp: parseFloat(row[2]) || 0,
          saldo: parseFloat(row[3]) || 0,
          laundry: parseFloat(row[4]) || 0,
          lainnya: parseFloat(row[5]) || 0,
        })
      }
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + error.message,
    }
  }
}

/**
 * Function untuk update data keuangan
 * @param {string} santriId - ID Santri
 * @param {Object} updateData - Data yang akan diupdate
 * @return {Object} Hasil update
 */
function updateKeuanganData(santriId, updateData) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName('Keuangan')

    if (!sheet) {
      throw new Error(
        'Sheet "Keuangan" tidak ditemukan. Pastikan sheet dengan nama "Keuangan" sudah dibuat.',
      )
    }

    const data = sheet.getDataRange().getValues()
    const headers = data[0]

    // Cari index kolom
    const idIndex = headers.indexOf('ID Santri')
    const sppIndex = headers.indexOf('SPP')
    const saldoIndex = headers.indexOf('Saldo')
    const laundryIndex = headers.indexOf('Laundry')
    const lainnyaIndex = headers.indexOf('Lainnya')

    // Cari row yang akan diupdate
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[idIndex] && row[idIndex].toString().trim() === santriId.toString().trim()) {
        // Update data
        if (updateData.spp !== undefined)
          sheet.getRange(i + 1, sppIndex + 1).setValue(updateData.spp)
        if (updateData.saldo !== undefined)
          sheet.getRange(i + 1, saldoIndex + 1).setValue(updateData.saldo)
        if (updateData.laundry !== undefined)
          sheet.getRange(i + 1, laundryIndex + 1).setValue(updateData.laundry)
        if (updateData.lainnya !== undefined)
          sheet.getRange(i + 1, lainnyaIndex + 1).setValue(updateData.lainnya)

        return {
          success: true,
          message: 'Data berhasil diupdate',
        }
      }
    }

    return {
      success: false,
      message: 'ID Santri tidak ditemukan',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + error.message,
    }
  }
}

/**
 * Function untuk test koneksi
 * @return {Object} Status koneksi
 */
function testConnection() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName('Keuangan')

    if (!sheet) {
      return {
        success: false,
        message:
          'Sheet "Keuangan" tidak ditemukan. Pastikan sheet dengan nama "Keuangan" sudah dibuat.',
      }
    }

    const data = sheet.getDataRange().getValues()
    const headers = data[0]

    return {
      success: true,
      message: 'Koneksi berhasil',
      data: {
        sheetName: 'Keuangan',
        totalRows: data.length,
        headers: headers,
        spreadsheetName: spreadsheet.getName(),
      },
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + error.message,
    }
  }
}

/**
 * Function untuk membuat sample data (untuk testing)
 * @return {Object} Hasil pembuatan sample data
 */
function createSampleData() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName('Keuangan')

    // Buat sheet jika belum ada
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Keuangan')
    }

    // Clear existing data
    sheet.clear()

    // Set headers
    const headers = ['ID Santri', 'Nama Santri', 'SPP', 'Saldo', 'Laundry', 'Lainnya']
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])

    // Set sample data
    const sampleData = [
      ['A123456789', 'Ahmad Fauzi Rahman', 500000, 250000, 50000, 25000],
      ['B987654321', 'Fatimah Zahra', 450000, 200000, 45000, 20000],
      ['C456789123', 'Muhammad Ali', 600000, 300000, 60000, 30000],
      ['D789123456', 'Aisyah Putri', 400000, 150000, 40000, 15000],
      ['E321654987', 'Abdullah Rahman', 550000, 275000, 55000, 27500],
    ]

    sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData)

    // Format header
    const headerRange = sheet.getRange(1, 1, 1, headers.length)
    headerRange.setFontWeight('bold')
    headerRange.setBackground('#f0f0f0')

    // Format kolom angka
    const numberRange = sheet.getRange(2, 3, sampleData.length, 4) // Kolom SPP, Saldo, Laundry, Lainnya
    numberRange.setNumberFormat('#,##0')

    return {
      success: true,
      message: 'Sample data berhasil dibuat di sheet "Keuangan"',
      data: {
        totalRows: sampleData.length + 1,
        spreadsheetName: spreadsheet.getName(),
      },
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + error.message,
    }
  }
}

/**
 * Function untuk menambahkan data santri baru
 * @param {Object} santriData - Data santri baru
 * @return {Object} Hasil penambahan data
 */
function addSantriData(santriData) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName('Keuangan')

    if (!sheet) {
      throw new Error(
        'Sheet "Keuangan" tidak ditemukan. Pastikan sheet dengan nama "Keuangan" sudah dibuat.',
      )
    }

    // Cek apakah ID Santri sudah ada
    const existingData = getKeuanganData(santriData.id_santri)
    if (existingData.success) {
      return {
        success: false,
        message: 'ID Santri ' + santriData.id_santri + ' sudah ada di database',
      }
    }

    // Tambahkan data baru
    const newRow = [
      santriData.id_santri,
      santriData.nama_santri || '',
      parseFloat(santriData.spp) || 0,
      parseFloat(santriData.saldo) || 0,
      parseFloat(santriData.laundry) || 0,
      parseFloat(santriData.lainnya) || 0,
    ]

    sheet.appendRow(newRow)

    return {
      success: true,
      message: 'Data santri berhasil ditambahkan',
      data: {
        id_santri: santriData.id_santri,
        nama_santri: santriData.nama_santri,
      },
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + error.message,
    }
  }
}

/**
 * Function untuk menghapus data santri
 * @param {string} santriId - ID Santri yang akan dihapus
 * @return {Object} Hasil penghapusan data
 */
function deleteSantriData(santriId) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName('Keuangan')

    if (!sheet) {
      throw new Error(
        'Sheet "Keuangan" tidak ditemukan. Pastikan sheet dengan nama "Keuangan" sudah dibuat.',
      )
    }

    const data = sheet.getDataRange().getValues()
    const headers = data[0]
    const idIndex = headers.indexOf('ID Santri')

    // Cari dan hapus row
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[idIndex] && row[idIndex].toString().trim() === santriId.toString().trim()) {
        sheet.deleteRow(i + 1)
        return {
          success: true,
          message: 'Data santri ' + santriId + ' berhasil dihapus',
        }
      }
    }

    return {
      success: false,
      message: 'ID Santri ' + santriId + ' tidak ditemukan',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Error: ' + error.message,
    }
  }
}
