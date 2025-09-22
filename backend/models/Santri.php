<?php
/**
 * Santri Model
 * Electronic Islamic School Management System
 */

require_once __DIR__ . '/../config/database.php';

class Santri {
    private $conn;
    private $table_name = "santri";

    public $id;
    public $santri_id;
    public $full_name;
    public $grade;
    public $status;
    public $parent_id;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Cek apakah ID santri ada di database
    public function santriIdExists($santri_id) {
        $query = "SELECT id, santri_id, full_name, grade, status 
                  FROM " . $this->table_name . " 
                  WHERE santri_id = :santri_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":santri_id", $santri_id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->santri_id = $row['santri_id'];
            $this->full_name = $row['full_name'];
            $this->grade = $row['grade'];
            $this->status = $row['status'];
            return true;
        }
        return false;
    }

    // Get santri by ID
    public function getSantriById($id) {
        $query = "SELECT id, santri_id, full_name, grade, status, parent_id, created_at, updated_at 
                  FROM " . $this->table_name . " 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->santri_id = $row['santri_id'];
            $this->full_name = $row['full_name'];
            $this->grade = $row['grade'];
            $this->status = $row['status'];
            $this->parent_id = $row['parent_id'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }
        return false;
    }

    // Get all santri by parent ID
    public function getSantriByParent($parent_id) {
        $query = "SELECT s.id, s.santri_id, s.full_name, s.grade, s.status, s.created_at, s.updated_at
                  FROM " . $this->table_name . " s
                  INNER JOIN parent_santri ps ON s.id = ps.santri_id
                  WHERE ps.parent_id = :parent_id
                  ORDER BY s.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":parent_id", $parent_id);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Add santri to parent
    public function addSantriToParent($parent_id, $santri_id) {
        // Cek apakah santri sudah ada di parent
        $check_query = "SELECT id FROM parent_santri WHERE parent_id = :parent_id AND santri_id = :santri_id";
        $check_stmt = $this->conn->prepare($check_query);
        $check_stmt->bindParam(":parent_id", $parent_id);
        $check_stmt->bindParam(":santri_id", $santri_id);
        $check_stmt->execute();

        if($check_stmt->rowCount() > 0) {
            return false; // Sudah ada
        }

        // Insert ke parent_santri
        $query = "INSERT INTO parent_santri (parent_id, santri_id) VALUES (:parent_id, :santri_id)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":parent_id", $parent_id);
        $stmt->bindParam(":santri_id", $santri_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Remove santri from parent
    public function removeSantriFromParent($parent_id, $santri_id) {
        $query = "DELETE FROM parent_santri WHERE parent_id = :parent_id AND santri_id = :santri_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":parent_id", $parent_id);
        $stmt->bindParam(":santri_id", $santri_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Get all santri (for admin)
    public function getAllSantri() {
        $query = "SELECT id, santri_id, full_name, grade, status, created_at, updated_at 
                  FROM " . $this->table_name . " 
                  ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
