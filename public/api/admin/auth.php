<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/admin/auth
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Admin-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$key = $_SERVER['HTTP_X_ADMIN_KEY'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? ($input['adminKey'] ?? '');
$key = preg_replace('/^Bearer\s+/i', '', trim($key));

$expectedKey = getenv('ADMIN_API_KEY') ?: getenv('ADMIN_SECRET') ?: '';

$envFile = __DIR__ . '/../../.env';
if (empty($expectedKey) && file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($k, $v) = array_pad(explode('=', $line, 2), 2, null);
        $k = trim($k);
        if ($k === 'ADMIN_API_KEY' || $k === 'ADMIN_SECRET') {
            $expectedKey = trim($v, " \t\n\r\0\x0B\"'");
            break;
        }
    }
}

// Fail closed if expectedKey is missing or too short
if (empty($expectedKey) || strlen($expectedKey) < 8) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'code' => 'AUTH_NOT_CONFIGURED',
        'error' => 'Administrative authentication is not configured on the server.'
    ]);
    exit;
}

if (!empty($key) && hash_equals($expectedKey, $key)) {
    echo json_encode([
        'success' => true,
        'message' => 'Administrator session authenticated successfully.'
    ]);
    exit;
}

http_response_code(401);
echo json_encode([
    'success' => false,
    'code' => 'UNAUTHORIZED_ADMIN',
    'error' => 'Invalid administrative credentials.'
]);
