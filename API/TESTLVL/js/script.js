let token = localStorage.getItem('token');
let my_npc_list = []

function set_drag() {
    $(function () {
        $('.draggable_from_panel').draggable({
            containment: '#scene',
            helper: 'clone',
            grid: [10, 10]
        });
        $('.draggable_by_scene').draggable({
            containment: '#scene',
            grid: [10, 10]
        });

        $('#scene').droppable({
            drop: function (event, ui) {
                let left = 0
                let top = 0
                if ($(ui.draggable).hasClass('draggable_from_panel')) {
                    let cloned = $(ui.helper).clone();
                    cloned.removeClass('draggable_from_panel');
                    cloned.addClass('draggable_by_scene')
                    $(this).append(cloned);
                    cloned.draggable();
                    let type = cloned.attr('id_type')
                    left = cloned.position().left
                    top = cloned.position().top
                    // добавляем npc (тип, x, y, token)
                    add_npc(type, left, top)

                }
                else {
                    left = ui.draggable.position().left
                    top = ui.draggable.position().top
                    if (left <= 250) {
                        deleteRecord(ui.draggable.attr('id_npc'), localStorage['token'])
                        ui.draggable.remove()
                    }
                    else {
                        update_npc(ui.draggable.attr('id_npc'), left, top)
                    }
                }
            },
            activate: function () {
                $('#scene').css({
                    //border: "medium double green",
                    //backgroundColor: "lightGreen"
                });
            },
            deactivate: function () {
                //$('#scene').css("border", "").css("background-color", "");
            }
        });
    });
}

function load_npc_list() {
    $.ajax({
        url: 'http://217.71.129.139:4320/api/get_npc_list.php?token=' + localStorage['token'],
        method: 'get',
        dataType: 'json',
        success: function (data) {
            if ('npc' in data) {
                $('#npc_list').html('')
                data['npc'].forEach(function (npc) {
                    let div = $('<img>')
                    div.prop('class', 'draggable_from_panel')
                    div.attr('id_type', npc['id'])
                    if (npc['id'] == 1)
                        div.prop('src', 'img/bear.png');
                    else if (npc['id'] == 2)
                        div.prop('src', 'img/dog.png');
                    else if (npc['id'] == 3)
                        div.prop('src', 'img/dino.png');
                    else if (npc['id'] == 4)
                        div.prop('src', 'img/frog.png');
                    else if (npc['id'] == 5)
                        div.prop('src', 'img/bandit.png');
                    $('#npc_list').append(div)
                })
                set_drag()
            } else {
                //alert('Ошибка')
                console.log(data)
            }
        }
    })
}

// загрузка мобов пользователя
function load_my_npc() {
    $.ajax({
        url: 'http://217.71.129.139:4320/api/get_npc.php?token=' + localStorage['token'],
        method: 'get',
        dataType: 'json',
        success: function (data) {
            if ('npc' in data) {
                my_npc_list = data['npc']
                $('#scene').html('')
                data['npc'].forEach(function (npc) {
                    let div = $('<img>')
                    //div.prop('id', 'npc_type_'+npc['id']);
                    div.prop('class', 'draggable_by_scene');
                    div.attr('id_npc', npc['id']);
                    div.css('left', npc['x']-190);
                    div.css('top', npc['y'] - 80);
                    console.log(npc['id'])
                    if (npc['id_type'] == 1)
                        div.prop('src', 'img/bear.png');
                    else if (npc['id_type'] == 2)
                        div.prop('src', 'img/dog.png');
                    else if (npc['id_type'] == 3)
                        div.prop('src', 'img/dino.png');
                    else if (npc['id_type'] == 4)
                        div.prop('src', 'img/frog.png');
                    else if (npc['id_type'] == 5)
                        div.prop('src', 'img/bandit.png');
                    
                    $('#scene').append(div)
                })
                set_drag()
            } else {
                //alert('Ошибка')
                console.log(data)
            }
        }
    })
}

function update_npc(id_npc, x, y) {
    $.ajax({
        url: 'http://217.71.129.139:4320/api/update_npc.php?token=' + localStorage['token'] + '&x=' + x + '&y=' + y + '&id_npc=' + id_npc,
        method: 'get',
        dataType: 'json',
        success: function (data) {
            console.log(data)
        }
    })
}

function add_npc(npcId, npcX, npcY) {
    $.ajax({
        url: 'http://217.71.129.139:4320/api/add.php?item=' + npcId + '&number1=' + npcX + '&number2=' + npcY + '&token=' + localStorage['token'],
        method: 'get',
        dataType: 'json',
        success: function (data) {
            console.log(data)
        }
    })
}

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

function deleteRecord(id, token) {
    var token = localStorage['token']; // получаем токен
    $.ajax({
        url: "http://217.71.129.139:4320/api/delete.php?id=" + id + '&token=' + token,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response.message);
            // Перезагрузка страницы для обновления таблицы после удаления записи
            //window.location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Ошибка при удалении записи:", error);
        }
    });
}