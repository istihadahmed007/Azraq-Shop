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

$key = $_SERVER['HTTP_X_ADMIN_KEY'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$key = preg_replace('/^Bearer\s+/i', '', trim($key));

$validKeys = ['azraq-admin-secret-2026', 'azraq_admin_2026'];
$envFile = __DIR__ . '/../../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($k, $v) = array_pad(explode('=', $line, 2), 2, null);
        if ($k === 'ADMIN_API_KEY') {
            $validKeys[] = trim($v, " \t\n\r\0\x0B\"'");
            break;
        }
    }
}

if (empty($key) || !in_array($key, $validKeys, true)) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'code' => 'UNAUTHORIZED_ADMIN',
        'error' => 'Invalid administrative credentials.'
    ]);
    exit;
}

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
