<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataFile = __DIR__ . '/../data/messages.json';
if (!file_exists(dirname($dataFile))) {
    mkdir(dirname($dataFile), 0777, true);
}
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $content = file_get_contents($dataFile);
    $messages = json_decode($content, true) ?: [];
    echo json_encode([
        'success' => true,
        'online' => 1,
        'messages' => $messages
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    $user = trim($data['user'] ?? '');
    $text = trim($data['text'] ?? '');

    if (empty($text)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Message cannot be empty.']);
        exit;
    }

    $cleanUser = htmlspecialchars(substr($user, 0, 30)) ?: 'Anonymous Fan';
    $cleanText = substr($text, 0, 500);

    $newMessage = [
        'id' => 'msg_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 6),
        'user' => $cleanUser,
        'text' => $cleanText,
        'timestamp' => date('c')
    ];

    $content = file_get_contents($dataFile);
    $messages = json_decode($content, true) ?: [];
    $messages[] = $newMessage;
    if (count($messages) > 150) {
        $messages = array_slice($messages, -150);
    }

    file_put_contents($dataFile, json_encode($messages, JSON_PRETTY_PRINT));

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => $newMessage]);
    exit;
}
