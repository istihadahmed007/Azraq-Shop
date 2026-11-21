<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/auth/me
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/common.php';

setAuthCorsHeaders();

$customer = getAuthenticatedCustomer();

if ($customer) {
    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'user' => sanitizeCustomerUser($customer)
    ]);
} else {
    echo json_encode([
        'success' => true,
        'authenticated' => false,
        'user' => null
    ]);
}
