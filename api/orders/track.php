<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/orders/track
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true) ?: [];
} else {
    $input = $_GET;
}

$orderId = trim($input['orderId'] ?? $input['order_id'] ?? $input['id'] ?? '');
$phone = trim($input['phone'] ?? $input['customerPhone'] ?? $input['customer_phone'] ?? '');
$token = trim($input['token'] ?? $input['trackingToken'] ?? $input['tracking_token'] ?? '');

// Invariant: Order ID or Token is required
if (empty($orderId) && empty($token)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'code' => 'MISSING_ORDER_ID',
        'error' => 'Order ID or tracking security token is required.'
    ]);
    exit;
}

// Invariant: If orderId is provided without token, customer phone is strictly required
if (!empty($orderId) && empty($phone) && empty($token)) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'code' => 'AUTH_REQUIRED',
        'error' => 'Customer phone number or secure tracking token is required to view order status.'
    ]);
    exit;
}

// Normalize phone (last 11 digits)
function normalizePhone($p) {
    $digits = preg_replace('/\D/', '', $p);
    return substr($digits, -11);
}

$targetPhone = normalizePhone($phone);

// Look up order in persistent data storage
$dataFile = __DIR__ . '/../../data/orders.json';
$orders = [];
if (file_exists($dataFile)) {
    $content = file_get_contents($dataFile);
    $orders = json_decode($content, true) ?: [];
}

$matchedOrder = null;
foreach ($orders as $ord) {
    if (!empty($orderId) && ($ord['id'] === $orderId || ($ord['order_id'] ?? '') === $orderId)) {
        $matchedOrder = $ord;
        break;
    }
    if (!empty($token) && ($ord['tracking_token'] ?? '') === $token) {
        $matchedOrder = $ord;
        break;
    }
}

if (!$matchedOrder) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'code' => 'ORDER_NOT_FOUND',
        'error' => 'Unable to locate order with provided details.'
    ]);
    exit;
}

// If authenticated by order ID + phone, verify phone match
if (empty($token) && !empty($targetPhone)) {
    $orderPhone = normalizePhone($matchedOrder['customer']['phone'] ?? $matchedOrder['customer_phone'] ?? '');
    if ($orderPhone !== $targetPhone) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'code' => 'FORBIDDEN',
            'error' => 'Provided phone number does not match order record.'
        ]);
        exit;
    }
}

// Mask customer PII
function maskStr($s) {
    if (strlen($s) <= 4) return '***';
    return substr($s, 0, 2) . str_repeat('*', max(1, strlen($s) - 4)) . substr($s, -2);
}

$custName = $matchedOrder['customer']['name'] ?? $matchedOrder['customer_name'] ?? 'Customer';
$custPhone = $matchedOrder['customer']['phone'] ?? $matchedOrder['customer_phone'] ?? '01XXXXXXXXX';
$custAddr = $matchedOrder['customer']['address'] ?? $matchedOrder['shipping_address'] ?? 'Dhaka, Bangladesh';

echo json_encode([
    'success' => true,
    'order' => [
        'id' => $matchedOrder['id'],
        'tracking_token' => $matchedOrder['tracking_token'] ?? '',
        'fulfillment_status' => $matchedOrder['fulfillment_status'] ?? $matchedOrder['status'] ?? 'Processing',
        'payment_status' => $matchedOrder['payment_status'] ?? 'PENDING_COD',
        'payment_method' => $matchedOrder['payment_method'] ?? 'COD',
        'currency' => 'BDT',
        'total' => (float)($matchedOrder['total'] ?? 0),
        'subtotal' => (float)($matchedOrder['subtotal'] ?? 0),
        'delivery_fee' => (float)($matchedOrder['delivery_fee'] ?? 0),
        'discount' => (float)($matchedOrder['discount'] ?? 0),
        'delivery_area' => $matchedOrder['customer']['area'] ?? $matchedOrder['delivery_area'] ?? 'inside',
        'city' => $matchedOrder['customer']['district'] ?? 'Dhaka',
        'customer_name_masked' => maskStr($custName),
        'customer_phone_masked' => maskStr($custPhone),
        'shipping_address_masked' => maskStr($custAddr),
        'courier_name' => $matchedOrder['courier_name'] ?? null,
        'courier_tracking_id' => $matchedOrder['courier_tracking_id'] ?? null,
        'created_at' => $matchedOrder['created_at'] ?? date('c'),
        'items' => $matchedOrder['items'] ?? []
    ]
]);
