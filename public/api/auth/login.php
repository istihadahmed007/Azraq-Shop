<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/auth/login
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/common.php';

setAuthCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
    exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
$identifier = trim($input['identifier'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($identifier) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'code' => 'INVALID_INPUT',
        'error' => 'Email/phone and password are required.'
    ]);
    exit;
}

$customer = findCustomerByEmailOrPhone($identifier);
if (!$customer || empty($customer['password_hash'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'code' => 'INVALID_CREDENTIALS',
        'error' => 'Invalid email or password.'
    ]);
    exit;
}

if (!password_verify($password, $customer['password_hash'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'code' => 'INVALID_CREDENTIALS',
        'error' => 'Invalid email or password.'
    ]);
    exit;
}

$customer['last_login_at'] = date('c');
saveCustomer($customer);

$sessionToken = createCustomerSession($customer['id']);

echo json_encode([
    'success' => true,
    'user' => sanitizeCustomerUser($customer),
    'token' => $sessionToken
]);
