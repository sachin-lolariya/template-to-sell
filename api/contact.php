<?php
/**
 * Aether Atelier - Production Inquiry & Brief Pipeline
 * Supports: Newsletter Signups, Studio Inquiries, Creator Applications
 * Built in compliance with /agency-senior-developer standards.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

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

// Honeypot spam trap
if (!empty($data['website_trap'])) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Transmission acknowledged.']);
    exit;
}

$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$name = htmlspecialchars(trim($data['name'] ?? ''));
$brand = htmlspecialchars(trim($data['brand'] ?? ''));
$message = htmlspecialchars(trim($data['message'] ?? ''));
$budget = htmlspecialchars(trim($data['budget'] ?? ''));
$type = htmlspecialchars(trim($data['type'] ?? 'brief_intake'));

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide a valid business email address.']);
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
    'budget' => $budget,
    'message' => $message,
    'created_at' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

$submissions[] = $record;
if (count($submissions) > 500) {
    $submissions = array_slice($submissions, -500);
}

@file_put_contents($submissionsFile, json_encode($submissions, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

// Return clean response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Thank you! Your strategic brief has been securely received.',
    'data' => [
        'id' => $record['id'],
        'email' => $record['email']
    ]
]);
