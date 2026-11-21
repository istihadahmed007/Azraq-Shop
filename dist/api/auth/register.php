<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/auth/register
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
$name = trim($input['name'] ?? '');
$identifier = trim($input['identifier'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($name) || empty($identifier) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'code' => 'INVALID_INPUT',
        'error' => 'Full name, email/phone, and password are required.'
    ]);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'code' => 'WEAK_PASSWORD',
        'error' => 'Password must be at least 6 characters long.'
    ]);
    exit;
}

$existing = findCustomerByEmailOrPhone($identifier);
if ($existing) {
    http_response_code(409);
    echo json_encode([
        'success' => false,
        'code' => 'CUSTOMER_EXISTS',
        'error' => 'An account with this email or phone number already exists.'
    ]);
    exit;
}

$isEmail = strpos($identifier, '@') !== false;
$customerId = 'usr_' . bin2hex(random_bytes(10));
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$customer = [
    'id' => $customerId,
    'name' => $name,
    'email' => $isEmail ? strtolower($identifier) : null,
    'phone' => !$isEmail ? $identifier : null,
    'password_hash' => $passwordHash,
    'avatar' => null,
    'role' => 'customer',
    'is_verified' => false,
    'created_at' => date('c'),
    'last_login_at' => date('c')
];

saveCustomer($customer);

$sessionToken = createCustomerSession($customer['id']);
$sanitized = sanitizeCustomerUser($customer);

echo json_encode([
    'success' => true,
    'user' => $sanitized,
    'customer' => $sanitized,
    'token' => $sessionToken
]);
