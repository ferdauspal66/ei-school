<?php
/**
 * Keuangan API
 * Electronic Islamic School Management System
 * Mengintegrasikan dengan Google Sheets melalui Google Apps Script
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

$response = array();

// Google Apps Script URL (ganti dengan URL script Anda)
$GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbywQrEMIWm4LFQrU3ev2RLVyxQn2qOxJ_nJShSiF9hGD9fhdOl6fGmiVeXfQVK_hSBJ/exec';

try {
    switch($method) {
        case 'POST':
            switch($action) {
                case 'get-data':
                    // Ambil data keuangan dari Google Sheets
                    if(empty($data->santri_id)) {
                        $response['success'] = false;
                        $response['message'] = 'ID Santri harus diisi';
                        http_response_code(400);
                    } else {
                        $santri_id = trim($data->santri_id);
                        
                        // Call Google Apps Script
                        $script_url = $GOOGLE_SCRIPT_URL . '?action=getData&santriId=' . urlencode($santri_id);
                        
                        $ch = curl_init();
                        curl_setopt($ch, CURLOPT_URL, $script_url);
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
                        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                        
                        $result = curl_exec($ch);
                        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        curl_close($ch);
                        
                        if ($result === false || $http_code !== 200) {
                            $response['success'] = false;
                            $response['message'] = 'Gagal mengambil data dari Google Sheets';
                            http_response_code(500);
                        } else {
                            $google_data = json_decode($result, true);
                            
                            if ($google_data && $google_data['success']) {
                                $response['success'] = true;
                                $response['message'] = 'Data keuangan berhasil diambil';
                                $response['data'] = $google_data['data'];
                                http_response_code(200);
                            } else {
                                $response['success'] = false;
                                $response['message'] = $google_data['message'] ?? 'Data tidak ditemukan';
                                http_response_code(404);
                            }
                        }
                    }
                    break;

                case 'update-data':
                    // Update data keuangan di Google Sheets
                    if(empty($data->santri_id) || empty($data->update_data)) {
                        $response['success'] = false;
                        $response['message'] = 'ID Santri dan data update harus diisi';
                        http_response_code(400);
                    } else {
                        $santri_id = trim($data->santri_id);
                        $update_data = $data->update_data;
                        
                        // Call Google Apps Script
                        $post_data = json_encode([
                            'action' => 'updateData',
                            'santriId' => $santri_id,
                            'updateData' => $update_data
                        ]);
                        
                        $ch = curl_init();
                        curl_setopt($ch, CURLOPT_URL, $GOOGLE_SCRIPT_URL);
                        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        curl_setopt($ch, CURLOPT_POST, true);
                        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
                        curl_setopt($ch, CURLOPT_HTTPHEADER, [
                            'Content-Type: application/json',
                            'Content-Length: ' . strlen($post_data)
                        ]);
                        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
                        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                        
                        $result = curl_exec($ch);
                        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        curl_close($ch);
                        
                        if ($result === false || $http_code !== 200) {
                            $response['success'] = false;
                            $response['message'] = 'Gagal update data di Google Sheets';
                            http_response_code(500);
                        } else {
                            $google_data = json_decode($result, true);
                            
                            if ($google_data && $google_data['success']) {
                                $response['success'] = true;
                                $response['message'] = 'Data keuangan berhasil diupdate';
                                http_response_code(200);
                            } else {
                                $response['success'] = false;
                                $response['message'] = $google_data['message'] ?? 'Gagal update data';
                                http_response_code(500);
                            }
                        }
                    }
                    break;

                default:
                    $response['success'] = false;
                    $response['message'] = 'Action tidak valid';
                    http_response_code(400);
                    break;
            }
            break;

        case 'GET':
            switch($action) {
                case 'test':
                    // Test koneksi ke Google Sheets
                    $script_url = $GOOGLE_SCRIPT_URL . '?action=test';
                    
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $script_url);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
                    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    
                    $result = curl_exec($ch);
                    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);
                    
                    if ($result === false || $http_code !== 200) {
                        $response['success'] = false;
                        $response['message'] = 'Gagal koneksi ke Google Sheets';
                        http_response_code(500);
                    } else {
                        $google_data = json_decode($result, true);
                        $response = $google_data;
                        http_response_code(200);
                    }
                    break;

                case 'all-data':
                    // Ambil semua data keuangan
                    $script_url = $GOOGLE_SCRIPT_URL . '?action=getAllData';
                    
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $script_url);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
                    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    
                    $result = curl_exec($ch);
                    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);
                    
                    if ($result === false || $http_code !== 200) {
                        $response['success'] = false;
                        $response['message'] = 'Gagal mengambil data dari Google Sheets';
                        http_response_code(500);
                    } else {
                        $google_data = json_decode($result, true);
                        $response = $google_data;
                        http_response_code(200);
                    }
                    break;

                default:
                    $response['success'] = false;
                    $response['message'] = 'Action tidak valid';
                    http_response_code(400);
                    break;
            }
            break;

        default:
            $response['success'] = false;
            $response['message'] = 'Method tidak diizinkan';
            http_response_code(405);
            break;
    }

} catch(Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Terjadi kesalahan server: ' . $e->getMessage();
    http_response_code(500);
}

echo json_encode($response);
?>
