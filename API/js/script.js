function authorize() {
    let login = $('#login').val() // значения получаем 
    let password = $("#pas").val()
    $.ajax({ // jQuery ajax запрос
        url: 'http://217.71.129.139:4320/api/log.php?login=' + login + '&password=' + password, // url куда отправлять запрос
        method: 'get', // метод запроса - get
        dataType: 'json', // данные в ответе json
        success: function (data) { // если сервак ответил хорошо
            if ('user' in data) { // получен ли user если да,значит, атворизован 
                let user = data['user'] // получаем пользователя
                localStorage['token'] = user['token'] // сохраняем токен в хранилище 
                window.location.href = 'game.html' // переход на гейм-страничку
            } else {
                localStorage.removeItem('token') // если ошибка-удаляем токен
                alert('Неверный логин или пароль') // выводим алерт
            }
        }
    })
}

function registration() {
    let login = $('#login').val();
    let password = $("#pas").val();


    if (!login || !password) { // Проверка на пустые поля
        alert("Вы не ввели поля"); // выводим алертик
        return; // выходим из функции, чтобы не выполнять ajax запрос
    }

    $.ajax({
        url: 'http://217.71.129.139:4320/api/reg.php?login=' + login + '&password=' + password,
        method: 'get',
        dataType: 'json',
        success: function (data) {
            if ('message' in data && data['message'] === "Пользователь успешно зарегистрирован") { // проверка на смску о успешной рег.
                localStorage['token'] = data['token']; // сохраняем токен
                window.location.href = 'game.html'; // перехход на страницу 
            } else if ('error' in data && data['error'] === "Пользователь с таким логином уже существует") { // если ответ error 
                alert('Пользователь с таким именем уже зарегистрирован'); // вывод алерта
            } else {
                localStorage.removeItem('token'); // удаляем токен из хранилища
                alert('Произошла ошибка при регистрации');
            }
        }
    });
}


function check_login() {
    if ('token' in localStorage) {
        return true
    }
    else {
        window.location.href = 'login.html'
        return false
    }
}
function addNPC() {
    // Получаем значения из полей формы
    let npcId = $('#item').val();
    let npcX = $('#number1').val();
    let npcY = $('#number2').val();
    let token = localStorage.getItem('token');

    $.ajax({
        url: 'http://217.71.129.139:4320/api/add.php?item=' + npcId + '&number1=' + npcX + '&number2=' + npcY + '&token=' + token,
        method: 'GET',
        dataType: 'json',
        success: function (response) { // обработка success ответа
            location.reload(); // перезагрузка страницы
        },
        error: function (xhr, status, error) { // обработка ошибки при выполнении запроса
            console.error("Ошибка при отправке GET запроса:", error);
        }
    });
    window.location.href = 'game.html'; // переход на страничку game
}

function deleteRecord(id, token) {
    var token = localStorage['token']; // получаем токен
    $.ajax({
        url: "http://217.71.129.139:4320/api/delete.php?id=" + id + '&token=' + token,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response.message);
            // Перезагрузка страницы для обновления таблицы после удаления записи
            window.location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Ошибка при удалении записи:", error);
        }
    });
}

function load() {
    if (check_login() == false) return // проверка на авторизацию пользователя

    $.ajax({
        url: 'http://217.71.129.139:4320/api/get_npc.php?token=' + localStorage['token'],
        method: 'get',
        dataType: 'json',
        success: function (data) {
            if ('npc' in data) { // проверка на npc в полученных данных
                $('#tbl_body').html('')
                data['npc'].forEach(function (npc) { // переборка массива npc и создаем строки дня них
                    console.log(npc) // выводи в консоль
                    // создаем строку таблицы
                    let tr = $('<tr>')
                    // пишем текст
                    tr.append('<td>' + npc['type'] + '</td>')
                    tr.append('<td>' + npc['x'] + '</td>')
                    tr.append('<td>' + npc['y'] + '</td>')
                    tr.append('<td><a class="delete-link" onclick="deleteRecord(' + npc['id'] + ', \'' + localStorage['token'] + '\');return" >Удалить</a></td>')
                    // добавляем строку к таблице
                    $('#tbl_body').append(tr)
                })
            } else {
                alert('Ошибка')
            }
        }
    })
}
