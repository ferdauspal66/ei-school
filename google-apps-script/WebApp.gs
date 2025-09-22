/**
 * Google Apps Script Web App untuk Electronic Islamic School Management System
 * Endpoint untuk menerima request dari PHP API
 * Menggunakan Active Spreadsheet dengan sheet "Keuangan"
 */

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action

  try {
    switch (action) {
      case 'test':
        return ContentService.createTextOutput(JSON.stringify(testConnection())).setMimeType(
          ContentService.MimeType.JSON,
        )

      case 'getData':
        const santriId = e.parameter.santriId
        if (!santriId) {
          return ContentService.createTextOutput(
            JSON.stringify({
              success: false,
              message: 'ID Santri harus diisi',
            }),
          ).setMimeType(ContentService.MimeType.JSON)
        }
        return ContentService.createTextOutput(
          JSON.stringify(getKeuanganData(santriId)),
        ).setMimeType(ContentService.MimeType.JSON)

      case 'getAllData':
        return ContentService.createTextOutput(JSON.stringify(getAllKeuanganData())).setMimeType(
          ContentService.MimeType.JSON,
        )

      case 'createSample':
        return ContentService.createTextOutput(JSON.stringify(createSampleData())).setMimeType(
          ContentService.MimeType.JSON,
        )

      default:
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            message: 'Action tidak valid',
          }),
        ).setMimeType(ContentService.MimeType.JSON)
    }
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Error: ' + error.message,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const action = data.action

    switch (action) {
      case 'updateData':
        const santriId = data.santriId
        const updateData = data.updateData

        if (!santriId || !updateData) {
          return ContentService.createTextOutput(
            JSON.stringify({
              success: false,
              message: 'ID Santri dan data update harus diisi',
            }),
          ).setMimeType(ContentService.MimeType.JSON)
        }

        return ContentService.createTextOutput(
          JSON.stringify(updateKeuanganData(santriId, updateData)),
        ).setMimeType(ContentService.MimeType.JSON)

      default:
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            message: 'Action tidak valid',
          }),
        ).setMimeType(ContentService.MimeType.JSON)
    }
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: 'Error: ' + error.message,
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Function untuk mengambil data keuangan berdasarkan ID Santri
 */
function getKeuanganData(santriId) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = spreadsheet.getSheetByName('Keuangan')

    if (!sheet) {
      throw new Error(
        'Sheet "Keuangan" tidak ditemukan. Pastikan sheet dengan nama "Keuangan" sudah dibuat.',
      )
    }

    const data = sheet.getDataRange().getValues()

    // Cek apakah ada data
    if (data.length <= 1) {
      return {
        success: false,
        message: 'Tidak ada data di sheet Keuangan. Pastikan sudah ada header dan data.',
      }
    }

    const headers = data[0]

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

    const requiredColumns = ['ID Santri', 'Nama Santri', 'SPP', 'Saldo', 'Laundry', 'Lainnya']
    const missingColumns = requiredColumns.filter((col) => !headers.includes(col))

    if (missingColumns.length > 0) {
      throw new Error('Kolom yang hilang: ' + missingColumns.join(', '))
    }

    const result = []
    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[0]) {
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

    const idIndex = headers.indexOf('ID Santri')
    const sppIndex = headers.indexOf('SPP')
    const saldoIndex = headers.indexOf('Saldo')
    const laundryIndex = headers.indexOf('Laundry')
    const lainnyaIndex = headers.indexOf('Lainnya')

    for (let i = 1; i < data.length; i++) {
      const row = data[i]
      if (row[idIndex] && row[idIndex].toString().trim() === santriId.toString().trim()) {
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
 * Function untuk membuat sample data
 */
function createSampleData() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = spreadsheet.getSheetByName('Keuangan')

    if (!sheet) {
      sheet = spreadsheet.insertSheet('Keuangan')
    }

    sheet.clear()

    const headers = ['ID Santri', 'Nama Santri', 'SPP', 'Saldo', 'Laundry', 'Lainnya']
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])

    const sampleData = [
      ['A123456789', 'Ahmad Fauzi Rahman', 500000, 250000, 50000, 25000],
      ['B987654321', 'Fatimah Zahra', 450000, 200000, 45000, 20000],
      ['C456789123', 'Muhammad Ali', 600000, 300000, 60000, 30000],
      ['D789123456', 'Aisyah Putri', 400000, 150000, 40000, 15000],
      ['E321654987', 'Abdullah Rahman', 550000, 275000, 55000, 27500],
    ]

    sheet.getRange(2, 1, sampleData.length, sampleData[0].length).setValues(sampleData)

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
