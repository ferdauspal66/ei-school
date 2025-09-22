-- Database schema untuk Electronic Islamic School Management System
-- Jalankan script ini di phpMyAdmin atau MySQL command line

CREATE DATABASE IF NOT EXISTS ei_school_db;
USE ei_school_db;

-- Tabel users untuk autentikasi
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('parent', 'admin', 'teacher') DEFAULT 'parent',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel santri untuk data siswa
CREATE TABLE IF NOT EXISTS santri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    santri_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    grade VARCHAR(50),
    status ENUM('aktif', 'lulus', 'pindah', 'tidak_aktif') DEFAULT 'aktif',
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel untuk relasi parent-santri (many-to-many)
CREATE TABLE IF NOT EXISTS parent_santri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    santri_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (santri_id) REFERENCES santri(id) ON DELETE CASCADE,
    UNIQUE KEY unique_parent_santri (parent_id, santri_id)
);

-- Insert admin default
INSERT INTO users (full_name, email, password, role) VALUES 
('Admin System', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert beberapa data santri dummy
INSERT INTO santri (santri_id, full_name, grade, status) VALUES 
('A123456789', 'Ahmad Fauzi Rahman', 'Kelas 7 SMP', 'aktif'),
('B987654321', 'Fatimah Zahra', 'Kelas 5 SD', 'aktif'),
('C456789123', 'Muhammad Ali', 'Kelas 10 SMA', 'aktif'),
('D789123456', 'Aisyah Putri', 'Kelas 3 SD', 'aktif'),
('E321654987', 'Abdullah Rahman', 'Kelas 8 SMP', 'aktif');
