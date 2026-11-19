<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/payments/transactions
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

$dataFile = __DIR__ . '/../../data/transactions.json';
$transactions = [];
if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    $transactions = json_decode($content, true) ?: [];
}

echo json_encode([
    'success' => true,
    'transactions' => $transactions
]);
