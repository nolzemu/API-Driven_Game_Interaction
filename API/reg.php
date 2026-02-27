<?php
require_once 'config.php';

// Проверяем, переданы ли логин и пароль
if (isset($_GET['login']) && isset($_GET['password'])) {
    $login = $_GET['login'];
    $password = $_GET['password'];

    // Проверяем, нет ли уже пользователя с таким логином
    $sql_check_user = sprintf("SELECT COUNT(*) as count FROM `users` WHERE `LOGIN` = '%s'", $login);
    $result = $conn->query($sql_check_user);
    $row = $result->fetch(PDO::FETCH_ASSOC);

    if ($row['count'] > 0) {
        die('{"error": "Пользователь с таким логином уже существует"}');
    }

    // Генерируем токен
    $token = md5(time());

    // Вычисляем время истечения токена (например, через 30 дней)
    $expired = time() + 30*24*60*60;

    // Вставляем нового пользователя в базу данных
    $sql_insert_user = sprintf("INSERT INTO `users` (`LOGIN`, `PAS`, `TOKEN`, `EXPIRED`) VALUES ('%s', '%s', '%s', FROM_UNIXTIME(%d))", $login, $password, $token, $expired);
    $conn->query($sql_insert_user);

    die('{"message": "Пользователь успешно зарегистрирован", "token": "' . $token . '", "expired": "' . $expired . '"}');
} else {
    die('{"error": "Не передан логин/пароль"}');
}
?>

