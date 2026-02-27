<?php
    require_once 'config.php';

    if(isset($_GET['token'])) {
        $token = $_GET['token'];
        $sql = sprintf("SELECT `ID`, UNIX_TIMESTAMP(`EXPIRED`) AS EXPIRED FROM `users` WHERE `TOKEN` LIKE '%s'", $token);
        $user = $conn->query($sql)->fetch();
        if($user != false) {
            $id_user = $user['ID'];
            $expired = intval($user['EXPIRED']);
            if($expired < time()) {
                die('{"error": "Время действия токена истекло"}');
            }
        }
        else {
            die('{"error": "Неверный токен"}');
        }
    }
    else {
        die('{"error": "Не передан токен"}');
    }
    if(isset($_GET['id_npc']) && isset($_GET['x']) && isset($_GET['y'])) {
        $id_npc = intval($_GET['id_npc']);
        $x = intval($_GET['x']);
        $y = intval($_GET['y']);

        $sql = "UPDATE `npc` SET `X`=:x, `Y`=:y WHERE `ID` = :id";
        //$sql = "UPDATE `npc` SET `X`=1, `Y`=1 WHERE `ID` = 333";
        
        $stmt = $conn->prepare($sql);        
        $stmt->bindParam(':x', $x);
        $stmt->bindParam(':y', $y);
        $stmt->bindParam(':id', $id_npc);
        //$stmt->debugDumpParams();
        
        $stmt->execute(); // Выполнение запроса

        die('{"message": "npc успешно изменен"}');
    }
    else {
        die('{"error": "Не переданы параметры"}');
    }
?>
