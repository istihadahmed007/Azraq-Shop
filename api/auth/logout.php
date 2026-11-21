<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/auth/logout
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/common.php';

setAuthCorsHeaders();

revokeCustomerSession();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully.'
]);
