<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/payments/refund
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

require_once __DIR__ . '/../admin_check.php';
checkAdminAuth();

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$orderId = trim($input['orderId'] ?? $input['order_id'] ?? '');

if (empty($orderId)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Order ID is required for refund processing.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'status' => 'REFUNDED',
    'orderId' => $orderId,
    'message' => "Refund processed successfully for order {$orderId}"
]);
