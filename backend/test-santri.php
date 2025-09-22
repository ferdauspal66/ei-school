<?php
/**
 * Test file untuk API Santri
 */

echo "<h2>Test API Santri</h2>";

// Test 1: Validasi ID santri yang ada
echo "<h3>Test 1: Validasi ID santri yang ada (A123456789)</h3>";
$data = json_encode(['santri_id' => 'A123456789']);
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $data
    ]
]);
$result = file_get_contents('http://localhost/ei-school/backend/api/santri.php?action=validate', false, $context);
echo "<pre>" . json_encode(json_decode($result), JSON_PRETTY_PRINT) . "</pre>";

// Test 2: Validasi ID santri yang tidak ada
echo "<h3>Test 2: Validasi ID santri yang tidak ada (INVALID123)</h3>";
$data = json_encode(['santri_id' => 'INVALID123']);
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $data
    ]
]);
$result = file_get_contents('http://localhost/ei-school/backend/api/santri.php?action=validate', false, $context);
echo "<pre>" . json_encode(json_decode($result), JSON_PRETTY_PRINT) . "</pre>";

// Test 3: Get all santri
echo "<h3>Test 3: Get all santri</h3>";
$result = file_get_contents('http://localhost/ei-school/backend/api/santri.php?action=all');
echo "<pre>" . json_encode(json_decode($result), JSON_PRETTY_PRINT) . "</pre>";

// Test 4: Get santri by parent (parent_id = 1)
echo "<h3>Test 4: Get santri by parent (parent_id = 1)</h3>";
$result = file_get_contents('http://localhost/ei-school/backend/api/santri.php?action=list&parent_id=1');
echo "<pre>" . json_encode(json_decode($result), JSON_PRETTY_PRINT) . "</pre>";
?>
