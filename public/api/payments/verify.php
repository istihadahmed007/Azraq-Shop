<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/payments/verify
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$invoiceId = $input['invoiceId'] ?? null;
$checkoutId = $input['checkoutId'] ?? null;
$manualTrxId = $input['manualTrxId'] ?? null;
$checkoutSnapshot = $input['checkoutSnapshot'] ?? null;

// If manual TrxID submitted
if (!empty($manualTrxId) && strlen(trim($manualTrxId)) >= 4) {
    $orderId = 'AZQ-ORD-' . strtoupper(base_convert(time(), 10, 36)) . '-' . rand(100, 999);
    $trackingToken = 'trk_' . bin2hex(random_bytes(16));
    
    $customer = $checkoutSnapshot['customer'] ?? [];
    $order = [
        'id' => $orderId,
        'tracking_token' => $trackingToken,
        'customer_name' => trim($customer['name'] ?? 'Valued Customer'),
        'customer_phone' => trim($customer['phone'] ?? ''),
        'customer_email' => trim($customer['email'] ?? ''),
        'shipping_address' => trim($customer['address'] ?? ''),
        'city' => trim($customer['city'] ?? 'Dhaka'),
        'delivery_area' => $checkoutSnapshot['deliveryArea'] ?? 'inside',
        'currency' => 'BDT',
        'payment_method' => 'PAYMENTLY_MANUAL_TRX',
        'payment_status' => 'PENDING_VERIFICATION',
        'transaction_id' => strtoupper(trim($manualTrxId)),
        'fulfillment_status' => 'Processing',
        'created_at' => date('c')
    ];

    echo json_encode([
        'success' => true,
        'verified' => false,
        'status' => 'PENDING_VERIFICATION',
        'order' => $order,
        'transaction' => [
            'transaction_id' => strtoupper(trim($manualTrxId)),
            'status' => 'PENDING_VERIFICATION'
        ],
        'message' => 'Your Transaction ID has been recorded. Our merchant desk will verify it against the Paymently statement and dispatch your order.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'verified' => false,
    'status' => 'PENDING',
    'message' => 'Payment has not yet cleared on Paymently. If you completed payment in your mobile wallet, please wait a moment and click Check Again, or submit your TrxID below.'
]);
