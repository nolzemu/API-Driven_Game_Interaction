<?php
error_reporting(E_ALL);
ini_set('display_errors', 'on');
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');

// Подключаем файл с настройками базы данных
require_once 'config.php';

// Получаем параметры из GET-запроса и проверяем их наличие
if (isset($_GET['item']) && isset($_GET['number1']) && isset($_GET['number2'])  && isset($_GET['token'])) {
    $npcId = $_GET['item'];
    $npcX = $_GET['number1'];
    $npcY = $_GET['number2'];
    $token = $_GET['token'];

    try {
        // получаем id пользователя
        $sql = "SELECT ID FROM users WHERE TOKEN LIKE :token";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (isset($user['ID'])){
            // в переменную id_user сохраняем id пользователя
            $id_user = intval($user['ID']);
        }else{
            die('{"error": "неверный токен"}');
        }
        

        // Готовим SQL-запрос для вставки данных в таблицу npc
        $sql = "INSERT INTO npc (ID_TYPE, X, Y, ID_USER) VALUES (:npcId, :npcX, :npcY, :id_user)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':npcId', $npcId);
        $stmt->bindParam(':npcX', $npcX);
        $stmt->bindParam(':npcY', $npcY);
        $stmt->bindParam(':id_user', $id_user); // Здесь исправлено
        //$stmt->debugDumpParams();
        $stmt->execute(); // Выполнение запроса

        // Выводим сообщение об успешной вставке в JSON формате
        echo json_encode(array("message" => "New record created successfully"));
    } catch (PDOException $e) {
        // Выводим сообщение об ошибке в JSON формате
        echo json_encode(array("message" => "Error: " . $e->getMessage()));
        
        // Логируем ошибку
        error_log("Error: " . $e->getMessage(), 0);
    }
} else {
    // Если какой-то из параметров не был передан, выводим сообщение об ошибке в JSON формате
    echo json_encode(array("message" => "Error: Missing parameters"));
}

// Закрываем соединение с базой данных
$conn = null;
?>
