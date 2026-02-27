<?php
    require_once 'config.php';

    // получим токен
    if (isset($_GET['token'])) {
        $token = $_GET['token'];
        $sql = sprintf("SELECT `ID`, UNIX_TIMESTAMP(`EXPIRED`) AS EXPIRED FROM `users` WHERE `TOKEN` LIKE '%s'", $token);
	    $user = $conn->query($sql)->fetch();
        if ($user != false) {
            $id_user = $user['ID'];
            $expired = intval($user['EXPIRED']);
            if ($expired < time()) {
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

    
    $sql = sprintf("SELECT n.ID, nt.TITLE, n.ID_TYPE, n.X, n.Y FROM `npc` AS n JOIN `users` AS u ON `u`.`ID` = n.ID_USER JOIN `npc_types` AS nt ON nt.ID = n.ID_TYPE WHERE u.TOKEN LIKE '%s'; ",$token);
	$npc = $conn->query($sql);

    $result = '{"npc": [';
    foreach ($npc as $row) {
        $id = $row['ID'];   
        $type = $row['TITLE'];
        $id_type = $row['ID_TYPE'];
        $x = $row['X'];
        $y = $row['Y'];

        $result .= sprintf('{"id": %d, "type": "%s", "id_type": %d, "x": %d, "y": %d},',$id, $type, $id_type,$x,$y);
    }
    // удаляем последнюю запятую
    $result = rtrim($result, ',');
    $result .= ']}';

    echo $result;
?>