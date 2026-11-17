<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Targets in UTC
$doomsdayEpoch = gmmktime(5, 0, 0, 12, 18, 2026);
$secretWarsEpoch = gmmktime(5, 0, 0, 12, 17, 2027);
$now = time();

$diffDoom = max(0, $doomsdayEpoch - $now);
$diffSecret = max(0, $secretWarsEpoch - $now);

$days = floor($diffDoom / 86400);
$hours = floor(($diffDoom % 86400) / 3600);
$minutes = floor(($diffDoom % 3600) / 60);
$seconds = $diffDoom % 60;

$swDays = floor($diffSecret / 86400);

echo json_encode([
    'status' => 'success',
    'timestamp' => $now,
    'doomsday' => [
        'target_date_utc' => '2026-12-18T05:00:00Z',
        'days_remaining' => $days,
        'hours_remaining' => $hours,
        'minutes_remaining' => $minutes,
        'seconds_remaining' => $seconds,
        'formatted' => sprintf('%02d:%02d:%02d:%02d', $days, $hours, $minutes, $seconds)
    ],
    'secret_wars' => [
        'target_date_utc' => '2027-12-17T05:00:00Z',
        'days_remaining' => $swDays
    ]
]);
