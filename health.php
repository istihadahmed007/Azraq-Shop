<?php
// AZRAQ Shop — Hostinger Native API Handler for /health & /api/health
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');

echo json_encode([
    'status' => 'ok',
    'service' => 'azraq-shop',
    'version' => '1.0.0',
    'uptime_seconds' => time() - 1763500000,
    'platform' => 'hostinger',
    'timestamp' => gmdate('Y-m-d\TH:i:s\Z')
]);
