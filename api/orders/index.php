<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/orders
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../admin_check.php';
checkAdminAuth();

// In static/Hostinger PHP environment, return orders from persistent JSON storage if available
$dataFile = __DIR__ . '/../../data/orders.json';
$orders = [];
if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    $orders = json_decode($content, true) ?: [];
}

echo json_encode([
    'success' => true,
    'orders' => $orders
]);
