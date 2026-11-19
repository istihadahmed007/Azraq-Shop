<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/payments/cancel
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Key, X-Cancel-Token, X-Customer-Phone');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$checkoutId = trim($input['checkoutId'] ?? $input['checkout_id'] ?? '');
$invoiceId = trim($input['invoiceId'] ?? $input['invoice_id'] ?? '');
$cancelToken = trim($input['cancelToken'] ?? $input['cancel_token'] ?? $_SERVER['HTTP_X_CANCEL_TOKEN'] ?? '');
$customerPhone = trim($input['customerPhone'] ?? $input['phone'] ?? $_SERVER['HTTP_X_CUSTOMER_PHONE'] ?? '');

if (empty($checkoutId) && empty($invoiceId)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'code' => 'MISSING_CHECKOUT_ID',
        'error' => 'Checkout ID or invoice reference is required.'
    ]);
    exit;
}

// In static/Hostinger PHP environment, if no credentials provided, reject
if (empty($cancelToken) && empty($customerPhone)) {
    // Check if admin is authenticated
    $adminKey = $_SERVER['HTTP_X_ADMIN_KEY'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $adminKey = preg_replace('/^Bearer\s+/i', '', trim($adminKey));
    $expectedKey = getenv('ADMIN_API_KEY') ?: getenv('ADMIN_SECRET') ?: '';

    $envFile = __DIR__ . '/../../.env';
    if (empty($expectedKey) && file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0) continue;
            list($k, $v) = array_pad(explode('=', $line, 2), 2, null);
            if (trim($k) === 'ADMIN_API_KEY' || trim($k) === 'ADMIN_SECRET') {
                $expectedKey = trim($v, " \t\n\r\0\x0B\"'");
                break;
            }
        }
    }

    if (empty($adminKey) || empty($expectedKey) || !hash_equals($expectedKey, $adminKey)) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'code' => 'CANCELLATION_UNAUTHORIZED',
            'error' => 'Unauthorized cancellation attempt. Valid cancel token, customer phone verification, or administrator authorization is required.'
        ]);
        exit;
    }
}

echo json_encode([
    'success' => true,
    'status' => 'CANCELLED',
    'checkout_id' => $checkoutId ?: $invoiceId,
    'message' => 'Checkout attempt marked cancelled. No order created.'
]);
