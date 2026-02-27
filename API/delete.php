<?php
require_once 'config.php'; 

if(isset($_GET['id']) && isset($_GET['token'])){
    $id = $_GET['id'];
    $token = $_GET['token'];
    
    try {
        $sql = "DELETE FROM npc WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $id);
        
        if($stmt->execute()){
            echo json_encode(array("message" => "Строка успешно удалена из базы данных."));
        } else {
            echo json_encode(array("error" => "Ошибка при удалении строки из базы данных."));
        }
    } catch(PDOException $e) {
        echo json_encode(array("error" => "Ошибка: " . $e->getMessage()));
    }
} else {
    echo json_encode(array("error" => "Не передан ID строки или токен для удаления."));
}
?>
