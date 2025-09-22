<?php
/**
 * Santri API
 * Electronic Islamic School Management System
 */

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Santri.php';

$database = new Database();
$db = $database->getConnection();
$santri = new Santri($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

$response = array();

try {
    switch($method) {
        case 'POST':
            switch($action) {
                case 'validate':
                    // Validasi ID santri
                    if(empty($data->santri_id)) {
                        $response['success'] = false;
                        $response['message'] = 'ID santri harus diisi';
                        http_response_code(400);
                    } else {
                        $santri_id = trim($data->santri_id);
                        
                        if($santri->santriIdExists($santri_id)) {
                            $response['success'] = true;
                            $response['message'] = 'ID santri ditemukan';
                            $response['data'] = array(
                                'id' => $santri->id,
                                'santri_id' => $santri->santri_id,
                                'full_name' => $santri->full_name,
                                'grade' => $santri->grade,
                                'status' => $santri->status
                            );
                            http_response_code(200);
                        } else {
                            $response['success'] = false;
                            $response['message'] = 'ID santri tidak ditemukan di database';
                            http_response_code(404);
                        }
                    }
                    break;

                case 'add-to-parent':
                    // Tambah santri ke parent
                    if(empty($data->parent_id) || empty($data->santri_id)) {
                        $response['success'] = false;
                        $response['message'] = 'Parent ID dan Santri ID harus diisi';
                        http_response_code(400);
                    } else {
                        $parent_id = $data->parent_id;
                        $santri_id = $data->santri_id;

                        // Cek apakah santri ada
                        if($santri->santriIdExists($santri_id)) {
                            // Tambah ke parent
                            if($santri->addSantriToParent($parent_id, $santri->id)) {
                                $response['success'] = true;
                                $response['message'] = 'Santri berhasil ditambahkan';
                                $response['data'] = array(
                                    'id' => $santri->id,
                                    'santri_id' => $santri->santri_id,
                                    'full_name' => $santri->full_name,
                                    'grade' => $santri->grade,
                                    'status' => $santri->status
                                );
                                http_response_code(201);
                            } else {
                                $response['success'] = false;
                                $response['message'] = 'Santri sudah terdaftar atau gagal ditambahkan';
                                http_response_code(409);
                            }
                        } else {
                            $response['success'] = false;
                            $response['message'] = 'ID santri tidak ditemukan di database';
                            http_response_code(404);
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
                case 'list':
                    // Get list santri by parent
                    $parent_id = isset($_GET['parent_id']) ? $_GET['parent_id'] : '';
                    
                    if(empty($parent_id)) {
                        $response['success'] = false;
                        $response['message'] = 'Parent ID harus diisi';
                        http_response_code(400);
                    } else {
                        $santri_list = $santri->getSantriByParent($parent_id);
                        $response['success'] = true;
                        $response['message'] = 'Data santri berhasil diambil';
                        $response['data'] = $santri_list;
                        http_response_code(200);
                    }
                    break;

                case 'all':
                    // Get all santri (for admin)
                    $santri_list = $santri->getAllSantri();
                    $response['success'] = true;
                    $response['message'] = 'Data semua santri berhasil diambil';
                    $response['data'] = $santri_list;
                    http_response_code(200);
                    break;

                default:
                    $response['success'] = false;
                    $response['message'] = 'Action tidak valid';
                    http_response_code(400);
                    break;
            }
            break;

        case 'DELETE':
            switch($action) {
                case 'remove':
                    // Remove santri from parent
                    if(empty($data->parent_id) || empty($data->santri_id)) {
                        $response['success'] = false;
                        $response['message'] = 'Parent ID dan Santri ID harus diisi';
                        http_response_code(400);
                    } else {
                        $parent_id = $data->parent_id;
                        $santri_id = $data->santri_id;

                        if($santri->removeSantriFromParent($parent_id, $santri_id)) {
                            $response['success'] = true;
                            $response['message'] = 'Santri berhasil dihapus';
                            http_response_code(200);
                        } else {
                            $response['success'] = false;
                            $response['message'] = 'Gagal menghapus santri';
                            http_response_code(500);
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
