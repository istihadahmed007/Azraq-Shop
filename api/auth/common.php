<?php
// AZRAQ Shop — Common Authentication Utilities for Hostinger / PHP Environment

// Set secure CORS headers for credentialed session cookies
function setAuthCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = [
        'https://azraq.azraqtrips.com',
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173'
    ];

    if (in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
    } elseif (!empty($origin)) {
        $host = parse_url($origin, PHP_URL_HOST);
        if ($host === 'azraq.azraqtrips.com' || $host === 'localhost' || $host === '127.0.0.1') {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
        }
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Vary: Origin');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// Read configuration from environment or .env file
function getEnvConfig($key, $default = '') {
    $val = getenv($key);
    if ($val !== false && $val !== '') {
        return $val;
    }

    $possibleEnvFiles = [
        __DIR__ . '/../../../.env',
        __DIR__ . '/../../.env',
        __DIR__ . '/../.env',
        isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] . '/.env' : ''
    ];

    foreach ($possibleEnvFiles as $file) {
        if (!empty($file) && file_exists($file)) {
            $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $trimmed = trim($line);
                if (empty($trimmed) || strpos($trimmed, '#') === 0) continue;
                list($k, $v) = array_pad(explode('=', $trimmed, 2), 2, null);
                if (trim($k) === $key) {
                    return trim($v, " \t\n\r\0\x0B\"'");
                }
            }
        }
    }

    return $default;
}

// Get Google Web Client ID
function getGoogleClientId() {
    $configured = getEnvConfig('GOOGLE_CLIENT_ID', '');
    if (empty($configured)) {
        $configured = getEnvConfig('VITE_GOOGLE_CLIENT_ID', '');
    }
    if (empty($configured) || $configured === 'YOUR_WEB_CLIENT_ID') {
        $configured = '335688416251-7cqlcbjbjstcc0jccafp73ukndemtlan.apps.googleusercontent.com';
    }
    return $configured;
}

// Persistent Storage Paths
function getDataDir() {
    $possibleDirs = [
        __DIR__ . '/../../data',
        __DIR__ . '/../data',
        __DIR__ . '/../../public/data',
        __DIR__ . '/../../dist/data',
        isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] . '/data' : '',
        isset($_SERVER['DOCUMENT_ROOT']) ? $_SERVER['DOCUMENT_ROOT'] . '/dist/data' : ''
    ];

    foreach ($possibleDirs as $dir) {
        if (!empty($dir) && is_dir($dir)) {
            return $dir;
        }
    }

    $fallback = __DIR__ . '/../../data';
    @mkdir($fallback, 0755, true);
    return $fallback;
}

function getCustomersFile() {
    return getDataDir() . '/customer_accounts.json';
}

function getSessionsFile() {
    return getDataDir() . '/customer_sessions.json';
}

function readJsonFile($filePath) {
    if (!file_exists($filePath)) return [];
    $content = @file_get_contents($filePath);
    if (!$content) return [];
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function writeJsonFile($filePath, $data) {
    $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    @file_put_contents($filePath, $encoded, LOCK_EX);
}

// Customer Storage Adapter
function findCustomerByIdentity($provider, $providerSub) {
    $customers = readJsonFile(getCustomersFile());
    foreach ($customers as $c) {
        if (isset($c['identities'][$provider]) && $c['identities'][$provider] === $providerSub) {
            return $c;
        }
    }
    return null;
}

function findCustomerByEmailOrPhone($identifier) {
    $customers = readJsonFile(getCustomersFile());
    $clean = strtolower(trim($identifier));
    foreach ($customers as $c) {
        if ((!empty($c['email']) && strtolower($c['email']) === $clean) ||
            (!empty($c['phone']) && $c['phone'] === $clean)) {
            return $c;
        }
    }
    return null;
}

function findCustomerById($customerId) {
    $customers = readJsonFile(getCustomersFile());
    foreach ($customers as $c) {
        if ($c['id'] === $customerId) {
            return $c;
        }
    }
    return null;
}

function saveCustomer($customer) {
    $customers = readJsonFile(getCustomersFile());
    $found = false;
    foreach ($customers as $i => $c) {
        if ($c['id'] === $customer['id']) {
            $customers[$i] = $customer;
            $found = true;
            break;
        }
    }
    if (!$found) {
        $customers[] = $customer;
    }
    writeJsonFile(getCustomersFile(), $customers);
    return $customer;
}

// Session Management
function createCustomerSession($customerId) {
    $sessionToken = bin2hex(random_bytes(32));
    $sessionHash = hash('sha256', $sessionToken);
    $expiresAt = time() + (30 * 24 * 60 * 60); // 30 days

    $sessions = readJsonFile(getSessionsFile());
    // Purge expired sessions
    $now = time();
    $sessions = array_values(array_filter($sessions, function($s) use ($now) {
        return isset($s['expires_at']) && $s['expires_at'] > $now;
    }));

    $sessions[] = [
        'session_hash' => $sessionHash,
        'customer_id' => $customerId,
        'created_at' => $now,
        'last_active' => $now,
        'expires_at' => $expiresAt
    ];

    writeJsonFile(getSessionsFile(), $sessions);

    // Set HttpOnly, SameSite=Lax cookie
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    
    setcookie('azraq_customer_session', $sessionToken, [
        'expires' => $expiresAt,
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    return $sessionToken;
}

function getAuthenticatedCustomer() {
    $token = $_COOKIE['azraq_customer_session'] ?? '';
    if (empty($token) && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/^Bearer\s+(.+)$/i', trim($_SERVER['HTTP_AUTHORIZATION']), $m)) {
            $token = $m[1];
        }
    }

    if (empty($token)) {
        return null;
    }

    $hash = hash('sha256', $token);
    $sessions = readJsonFile(getSessionsFile());
    $now = time();

    foreach ($sessions as $i => $s) {
        if ($s['session_hash'] === $hash) {
            if ($s['expires_at'] < $now) {
                // Expired
                unset($sessions[$i]);
                writeJsonFile(getSessionsFile(), array_values($sessions));
                clearSessionCookie();
                return null;
            }

            // Update last_active
            $sessions[$i]['last_active'] = $now;
            writeJsonFile(getSessionsFile(), $sessions);

            return findCustomerById($s['customer_id']);
        }
    }

    return null;
}

function revokeCustomerSession() {
    $token = $_COOKIE['azraq_customer_session'] ?? '';
    if (!empty($token)) {
        $hash = hash('sha256', $token);
        $sessions = readJsonFile(getSessionsFile());
        $sessions = array_values(array_filter($sessions, function($s) use ($hash) {
            return $s['session_hash'] !== $hash;
        }));
        writeJsonFile(getSessionsFile(), $sessions);
    }
    clearSessionCookie();
}

function clearSessionCookie() {
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    setcookie('azraq_customer_session', '', [
        'expires' => time() - 3600,
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
}

function sanitizeCustomerUser($c) {
    if (!$c) return null;
    return [
        'id' => $c['id'],
        'name' => $c['name'],
        'email' => $c['email'] ?? null,
        'phone' => $c['phone'] ?? null,
        'avatar' => $c['avatar'] ?? null,
        'role' => $c['role'] ?? 'customer',
        'is_verified' => !empty($c['is_verified']),
        'created_at' => $c['created_at'] ?? date('c')
    ];
}
