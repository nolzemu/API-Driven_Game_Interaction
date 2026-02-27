<?php
    require_once 'config.php';

    if (isset($_GET['login']) && isset($_GET['password'])){
        $login = $_GET['login'];
        $password = $_GET['password'];
    }else{
        die('{"error": "Не передан логин/пароль"}');
    }

    $sql = sprintf("SELECT `ID`, `TOKEN`, UNIX_TIMESTAMP(`EXPIRED`) AS EXPIRED FROM `users` WHERE `LOGIN` LIKE '%s' AND `PAS` LIKE '%s'", $login, $password);

    $user = $conn->query($sql)->fetch();
    if (isset($user['ID'])){
        $id_user = intval($user['ID']);

        if($user['EXPIRED'] > time()) {
            $token = $user['TOKEN'];
            $expired = $user['EXPIRED'];
            die(sprintf('{"user": {"id": %d, "login": "%s", "token": "%s", "$expired": "%d"}}', $id_user, $login, $token, $expired));
        }
        else {
        $token = md5(time());
        $expired = time() + 30*24*60*60;
        // обновим поле токен и expired в таблице
        $sql = sprintf("UPDATE `users` SET `TOKEN` = '%s', `EXPIRED` = FROM_UNIXTIME(%d) WHERE `ID` = %d", $token, $expired,$id_user);
        $conn->query($sql);
        die(sprintf('{"user": {"id": %d, "login": "%s", "token": "%s", "expired": "%d"}}', $id_user, $login, $token, $expired));
        }
    }else{
        die('{"error": "Пользователь с таким логином и паролем не существует"}');
    }
?>











