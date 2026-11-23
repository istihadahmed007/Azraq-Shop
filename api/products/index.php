<?php
// AZRAQ Shop — Hostinger Native API Handler for /api/products
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$id = trim($_GET['id'] ?? '');
$slug = trim($_GET['slug'] ?? '');

if (empty($id) && empty($slug)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'code' => 'MISSING_PARAM', 'error' => 'Product ID or slug is required.']);
    exit;
}

// Check static single product record first
if (!empty($id)) {
    $cleanId = strtoupper($id);
    $staticFile = __DIR__ . '/../../data/products/' . $cleanId . '.json';
    if (file_exists($staticFile)) {
        $content = file_get_contents($staticFile);
        $prod = json_decode($content, true);
        if ($prod) {
            echo json_encode(['success' => true, 'product' => $prod]);
            exit;
        }
    }
}

// Fallback to central catalog
$catalogFile = __DIR__ . '/../../data/central_products.json';
if (file_exists($catalogFile)) {
    $content = file_get_contents($catalogFile);
    $data = json_decode($content, true);
    $products = $data['products'] ?? [];
    foreach ($products as $p) {
        if (!empty($id) && strtoupper($p['id'] ?? '') === strtoupper($id)) {
            echo json_encode(['success' => true, 'product' => $p]);
            exit;
        }
        if (!empty($slug) && ($p['slug'] ?? '') === $slug) {
            echo json_encode(['success' => true, 'product' => $p]);
            exit;
        }
    }
}

http_response_code(404);
echo json_encode(['success' => false, 'code' => 'PRODUCT_NOT_FOUND', 'error' => 'Product not found.']);
