<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    if (!$email) {
        $raw = json_decode(file_get_contents('php://input'), true);
        if (isset($raw['email'])) {
            $email = filter_var($raw['email'], FILTER_VALIDATE_EMAIL);
        }
    }

    if ($email) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Subscription confirmed. Incursion alerts registered for ' . htmlspecialchars($email)
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email address provided.'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed.'
    ]);
}
