<?php
/**
 * Authentication API
 * Electronic Islamic School Management System
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

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

$response = array();

try {
    switch($method) {
        case 'POST':
            switch($action) {
                case 'register':
                    // Validasi input
                    if(empty($data->full_name) || empty($data->email) || empty($data->password)) {
                        $response['success'] = false;
                        $response['message'] = 'Semua field harus diisi';
                        http_response_code(400);
                    } else {
                        // Validasi email
                        if(!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
                            $response['success'] = false;
                            $response['message'] = 'Format email tidak valid';
                            http_response_code(400);
                        } else {
                            // Validasi password
                            if(strlen($data->password) < 6) {
                                $response['success'] = false;
                                $response['message'] = 'Password minimal 6 karakter';
                                http_response_code(400);
                            } else {
                                $user->full_name = $data->full_name;
                                $user->email = $data->email;
                                $user->password = $data->password;
                                $user->role = 'parent'; // Default role

                                // Cek apakah email sudah ada
                                if($user->emailExists()) {
                                    $response['success'] = false;
                                    $response['message'] = 'Email sudah terdaftar';
                                    http_response_code(409);
                                } else {
                                    // Register user
                                    if($user->register()) {
                                        $response['success'] = true;
                                        $response['message'] = 'Registrasi berhasil';
                                        $response['data'] = array(
                                            'id' => $user->id,
                                            'full_name' => $user->full_name,
                                            'email' => $user->email,
                                            'role' => $user->role
                                        );
                                        http_response_code(201);
                                    } else {
                                        $response['success'] = false;
                                        $response['message'] = 'Gagal melakukan registrasi';
                                        http_response_code(500);
                                    }
                                }
                            }
                        }
                    }
                    break;

                case 'login':
                    // Validasi input
                    if(empty($data->email) || empty($data->password)) {
                        $response['success'] = false;
                        $response['message'] = 'Email dan password harus diisi';
                        http_response_code(400);
                    } else {
                        $user->email = $data->email;
                        $user->password = $data->password;

                        if($user->login()) {
                            $response['success'] = true;
                            $response['message'] = 'Login berhasil';
                            $response['data'] = array(
                                'id' => $user->id,
                                'full_name' => $user->full_name,
                                'email' => $user->email,
                                'role' => $user->role
                            );
                            http_response_code(200);
                        } else {
                            $response['success'] = false;
                            $response['message'] = 'Email atau password salah';
                            http_response_code(401);
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
                case 'check':
                    // Cek status user (untuk session check)
                    $response['success'] = true;
                    $response['message'] = 'API berjalan dengan baik';
                    http_response_code(200);
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
