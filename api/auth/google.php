<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/auth/google
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
$credential = trim($input['credential'] ?? '');

if (empty($credential)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'code' => 'CREDENTIAL_REQUIRED',
        'error' => 'Google ID token credential is required.'
    ]);
    exit;
}

$expectedClientId = getGoogleClientId();
if (empty($expectedClientId) || $expectedClientId === 'YOUR_WEB_CLIENT_ID') {
    http_response_code(503);
    echo json_encode([
        'success' => false,
        'code' => 'GOOGLE_CONFIG_MISSING',
        'error' => 'Google authentication is not configured on this server.'
    ]);
    exit;
}

// Verify token cryptographically with Google Identity Services endpoint
$tokenInfoUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($credential);
$response = false;

if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $tokenInfoUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_USERAGENT, 'AZRAQ-Shop-Auth/1.0');
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    $response = curl_exec($ch);
    curl_close($ch);
}

if ($response === false) {
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 10,
            'ignore_errors' => true,
            'header' => "User-Agent: AZRAQ-Shop-Auth/1.0\r\n"
        ]
    ]);
    $response = @file_get_contents($tokenInfoUrl, false, $context);
}

if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'code' => 'GOOGLE_VERIFICATION_NETWORK_ERROR',
        'error' => 'Unable to connect to Google authentication service. Please check your internet connection.'
    ]);
    exit;
}

$payload = json_decode($response, true);

if (!is_array($payload) || !empty($payload['error']) || empty($payload['sub'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'code' => 'INVALID_GOOGLE_TOKEN',
        'error' => $payload['error_description'] ?? ($payload['error'] ?? 'Invalid or unverified Google token.')
    ]);
    exit;
}

// 1. Audience verification
$aud = $payload['aud'] ?? '';
if ($aud !== $expectedClientId) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'code' => 'AUDIENCE_MISMATCH',
        'error' => 'Token audience does not match AZRAQ Google Client ID.'
    ]);
    exit;
}

// 2. Issuer verification
$iss = $payload['iss'] ?? '';
if ($iss !== 'accounts.google.com' && $iss !== 'https://accounts.google.com') {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'code' => 'INVALID_ISSUER',
        'error' => 'Token issuer is not Google accounts.'
    ]);
    exit;
}

// 3. Expiration verification
$exp = intval($payload['exp'] ?? 0);
if ($exp < time()) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'code' => 'TOKEN_EXPIRED',
        'error' => 'Google ID token has expired. Please sign in again.'
    ]);
    exit;
}

// 4. Email verification status
$emailVerified = ($payload['email_verified'] ?? '') === 'true' || ($payload['email_verified'] ?? false) === true;
if (!$emailVerified) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'code' => 'EMAIL_NOT_VERIFIED',
        'error' => 'Google account email is not verified.'
    ]);
    exit;
}

$googleSub = $payload['sub'];
$email = strtolower(trim($payload['email'] ?? ''));
$name = trim($payload['name'] ?? ($payload['given_name'] ?? 'Google Customer'));
$avatar = trim($payload['picture'] ?? '');

// Map customer: Look up by Google sub first (immutable provider identity)
$customer = findCustomerByIdentity('google', $googleSub);

if (!$customer && !empty($email)) {
    // Check if customer exists by email
    $customer = findCustomerByEmailOrPhone($email);
    if ($customer) {
        if (!isset($customer['identities'])) $customer['identities'] = [];
        $customer['identities']['google'] = $googleSub;
        if (!empty($avatar) && empty($customer['avatar'])) {
            $customer['avatar'] = $avatar;
        }
    }
}

if (!$customer) {
    // Create new customer user
    $customerId = 'usr_' . bin2hex(random_bytes(10));
    $customer = [
        'id' => $customerId,
        'name' => $name,
        'email' => $email,
        'phone' => null,
        'avatar' => $avatar,
        'role' => 'customer',
        'is_verified' => true,
        'identities' => [
            'google' => $googleSub
        ],
        'created_at' => date('c'),
        'last_login_at' => date('c')
    ];
} else {
    $customer['last_login_at'] = date('c');
    if (!empty($avatar)) {
        $customer['avatar'] = $avatar;
    }
    if (!empty($name) && ($customer['name'] === 'Google Customer' || empty($customer['name']))) {
        $customer['name'] = $name;
    }
}

saveCustomer($customer);

// Issue cryptographically secure session
$sessionToken = createCustomerSession($customer['id']);
$sanitized = sanitizeCustomerUser($customer);

echo json_encode([
    'success' => true,
    'user' => $sanitized,
    'customer' => $sanitized,
    'token' => $sessionToken
]);
