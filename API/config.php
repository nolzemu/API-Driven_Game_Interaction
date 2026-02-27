<?php
header("Access-Control-Allow-Origin: *");
//error_reporting(E_ALL);
ini_set('display_errors', 'on');
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');

try {
    $conn = new PDO("mysql:host=localhost;dbname=diplom;charset=utf8mb4", "nz", "12345");
}
catch (PDOException $e) {
    echo 'Ошибка подключения к базе: ' . $e->getMessage();
}
?>
