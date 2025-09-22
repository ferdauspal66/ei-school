<?php
/**
 * Test file untuk debugging path
 */

echo "Current directory: " . __DIR__ . "<br>";
echo "Config path: " . __DIR__ . '/config/database.php' . "<br>";
echo "Models path: " . __DIR__ . '/models/User.php' . "<br>";

// Test file exists
if (file_exists(__DIR__ . '/config/database.php')) {
    echo "✅ config/database.php exists<br>";
} else {
    echo "❌ config/database.php NOT found<br>";
}

if (file_exists(__DIR__ . '/models/User.php')) {
    echo "✅ models/User.php exists<br>";
} else {
    echo "❌ models/User.php NOT found<br>";
}

// Test database connection
try {
    require_once __DIR__ . '/config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    echo "✅ Database connection successful<br>";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "<br>";
}
?>
