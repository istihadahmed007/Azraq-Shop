<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/payments/create
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
    exit;
}

$customer = $input['customer'] ?? null;
$items = $input['items'] ?? [];
$deliveryArea = $input['deliveryArea'] ?? 'inside';
$promoCode = $input['promoCode'] ?? null;
$paymentMethod = $input['paymentMethod'] ?? 'PAYMENTLY';

if (!$customer || empty($customer['name']) || empty($customer['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Customer name and 11-digit phone number are required.']);
    exit;
}

// Calculate subtotal from central catalog or items
$catalogFile = __DIR__ . '/../../src/data/central_products.json';
$catalog = [];
if (file_exists($catalogFile)) {
    $catalogData = json_decode(file_get_contents($catalogFile), true);
    $catalog = $catalogData['products'] ?? [];
}

$subtotal = 0;
foreach ($items as $item) {
    $pId = $item['product']['id'] ?? $item['id'] ?? null;
    $unitPrice = 0;
    foreach ($catalog as $cat) {
        if ($cat['id'] === $pId || (!empty($item['product']['sku']) && $cat['sku'] === $item['product']['sku'])) {
            $unitPrice = (float)$cat['price'];
            break;
        }
    }
    if ($unitPrice <= 0) {
        $unitPrice = (float)($item['product']['price'] ?? $item['price'] ?? 0);
    }
    $qty = max(1, (int)($item['quantity'] ?? 1));
    $subtotal += ($unitPrice * $qty);
}

$deliveryFee = ($subtotal >= 3000) ? 0 : (($deliveryArea === 'outside') ? 130 : 70);
$discount = 0;
if ($promoCode) {
    $cleanPromo = strtoupper(trim($promoCode));
    if ($cleanPromo === 'AZRAQNEW' || $cleanPromo === 'DISCOVER200') {
        $discount = 200;
    } elseif ($cleanPromo === 'AZRAQ10') {
        $discount = round($subtotal * 0.1);
    }
}

$totalPayable = max(10, round($subtotal + $deliveryFee - $discount));

// Load environment variables if .env exists
$envFile = __DIR__ . '/../../.env';
$apiKey = '';
$baseUrl = 'https://azraq.paymently.io';
$defaultPaymentUrl = 'https://azraq.paymently.io/paymentlink/default/BDT';

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($k, $v) = array_pad(explode('=', $line, 2), 2, null);
        if ($k === 'PAYMENTLY_API_KEY') $apiKey = trim($v, " \t\n\r\0\x0B\"'");
        if ($k === 'PAYMENTLY_BASE_URL') $baseUrl = trim($v, " \t\n\r\0\x0B\"'");
        if ($k === 'PAYMENTLY_DEFAULT_PAYMENT_URL') $defaultPaymentUrl = trim($v, " \t\n\r\0\x0B\"'");
    }
}

$checkoutId = 'AZQ-CHK-' . strtoupper(base_convert(time(), 10, 36)) . '-' . rand(100, 999);

// Handle Cash on Delivery (COD)
if ($paymentMethod === 'COD') {
    $orderId = 'AZQ-ORD-' . strtoupper(base_convert(time(), 10, 36)) . '-' . rand(100, 999);
    $trackingToken = 'trk_' . bin2hex(random_bytes(16));
    $order = [
        'id' => $orderId,
        'tracking_token' => $trackingToken,
        'customer_name' => trim($customer['name']),
        'customer_phone' => trim($customer['phone']),
        'customer_email' => trim($customer['email'] ?? ''),
        'shipping_address' => trim($customer['address'] ?? ''),
        'city' => trim($customer['city'] ?? 'Dhaka'),
        'delivery_area' => $deliveryArea,
        'subtotal' => $subtotal,
        'delivery_fee' => $deliveryFee,
        'discount' => $discount,
        'total_amount' => $totalPayable,
        'currency' => 'BDT',
        'payment_method' => 'COD',
        'payment_status' => 'PENDING_COD',
        'fulfillment_status' => 'Processing',
        'created_at' => date('c')
    ];
    echo json_encode([
        'success' => true,
        'mode' => 'COD',
        'order' => $order
    ]);
    exit;
}

// Paymently Gateway Session Call
if (!empty($apiKey) && strlen($apiKey) > 5) {
    $ch = curl_init("{$baseUrl}/api/checkout-v2");
    $postData = json_encode([
        'full_name' => trim($customer['name']),
        'email' => !empty($customer['email']) ? trim($customer['email']) : trim($customer['phone']) . '@azraqshop.com',
        'amount' => (string)$totalPayable,
        'metadata' => [
            'checkout_id' => $checkoutId,
            'customer_phone' => trim($customer['phone']),
            'delivery_area' => $deliveryArea,
            'merchant_brand' => 'AZRAQ'
        ],
        'redirect_url' => "https://azraq.azraqtrips.com/?payment_status=verifying&checkout_id={$checkoutId}",
        'return_type' => 'GET',
        'cancel_url' => "https://azraq.azraqtrips.com/?payment_status=cancelled&checkout_id={$checkoutId}",
        'webhook_url' => "https://azraq.azraqtrips.com/api/payments/webhook.php"
    ]);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
        "RT-UDDOKTAPAY-API-KEY: {$apiKey}",
        "PAYMENTLY-API-KEY: {$apiKey}"
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    $res = curl_exec($ch);
    curl_close($ch);

    if ($res) {
        $jsonRes = json_decode($res, true);
        if (!empty($jsonRes['payment_url'])) {
            echo json_encode([
                'success' => true,
                'checkout_id' => $checkoutId,
                'invoice_id' => $jsonRes['invoice_id'] ?? $checkoutId,
                'amount' => $totalPayable,
                'currency' => 'BDT',
                'payment_url' => $jsonRes['payment_url'],
                'merchant_name' => 'AZRAQ',
                'is_fallback_link' => false
            ]);
            exit;
        }
    }
}

// Direct Official Paymently Merchant Portal Link Fallback
echo json_encode([
    'success' => true,
    'checkout_id' => $checkoutId,
    'invoice_id' => $checkoutId,
    'amount' => $totalPayable,
    'currency' => 'BDT',
    'payment_url' => $defaultPaymentUrl,
    'merchant_name' => 'AZRAQ',
    'is_fallback_link' => true,
    'requires_manual_trx' => true
]);
