<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/orders/update-status
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../admin_check.php';
checkAdminAuth();

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$orderId = trim($input['orderId'] ?? '');
$status = trim($input['status'] ?? '');
$courierName = $input['courierName'] ?? null;
$courierTrackingId = $input['courierTrackingId'] ?? null;
$notes = $input['notes'] ?? null;

if (empty($orderId) || empty($status)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Order ID and status are required.'
    ]);
    exit;
}

$allowedStatuses = ['Processing', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'];
if (!in_array($status, $allowedStatuses, true)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Invalid status. Allowed: ' . implode(', ', $allowedStatuses)
    ]);
    exit;
}

// Persist update in data/orders.json if it exists
$dataFile = __DIR__ . '/../../data/orders.json';
if (file_exists($dataFile)) {
    $orders = json_decode(file_get_contents($dataFile), true) ?: [];
    foreach ($orders as &$ord) {
        if (($ord['id'] ?? '') === $orderId) {
            $ord['fulfillment_status'] = $status;
            if ($courierName) $ord['courier_name'] = $courierName;
            if ($courierTrackingId) $ord['courier_tracking_id'] = $courierTrackingId;
            if ($notes) $ord['notes'] = $notes;
            $ord['updated_at'] = date('c');
            break;
        }
    }
    @file_put_contents($dataFile, json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

echo json_encode([
    'success' => true,
    'message' => "Order {$orderId} status updated to {$status}",
    'order' => [
        'id' => $orderId,
        'fulfillment_status' => $status,
        'courier_name' => $courierName,
        'courier_tracking_id' => $courierTrackingId,
        'notes' => $notes
    ]
]);
