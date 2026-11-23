<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/payments/status
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'success' => true,
    'gateway' => [
        'gateway_name' => 'Paymently',
        'merchant_name' => 'AZRAQ',
        'domain' => 'azraq.paymently.io',
        'base_url' => 'https://azraq.paymently.io',
        'currency' => 'BDT',
        'has_api_key' => true,
        'has_database' => false,
        'default_payment_url' => 'https://azraq.paymently.io/paymentlink/default/BDT'
    ]
]);
