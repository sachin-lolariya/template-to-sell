<?php
/**
 * Updraft Studio - Production Form & Inquiry Handler
 * Supports: Newsletter Signups, Studio Inquiries, Creator Applications
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

// Read raw JSON or standard POST
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!$data) {
    $data = $_POST;
}

$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$name = htmlspecialchars(trim($data['name'] ?? ''));
$brand = htmlspecialchars(trim($data['brand'] ?? ''));
$message = htmlspecialchars(trim($data['message'] ?? ''));
$type = htmlspecialchars(trim($data['type'] ?? 'newsletter'));

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide a valid email address.']);
    exit;
}

// Data persistence
$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0755, true);
}

$submissionsFile = $dataDir . '/submissions.json';
$submissions = [];
if (file_exists($submissionsFile)) {
    $submissions = json_decode(file_get_contents($submissionsFile), true) ?: [];
}

$record = [
    'id' => uniqid('lead_', true),
    'type' => $type,
    'email' => $email,
    'name' => $name,
    'brand' => $brand,
    'message' => $message,
    'created_at' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

$submissions[] = $record;
@file_put_contents($submissionsFile, json_encode($submissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// Return clean response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your submission has been received.',
    'data' => [
        'id' => $record['id'],
        'email' => $record['email']
    ]
]);
