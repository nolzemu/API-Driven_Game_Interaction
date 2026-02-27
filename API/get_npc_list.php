<?php
    require_once 'config.php';

    $sql = "SELECT ID, TITLE FROM `npc_types` ";
    $npc = $conn->query($sql);

    $result = '{"npc": [';
    foreach($npc as $row) {
        $id = $row['ID'];
        $title = $row['TITLE'];

        $result .=sprintf('{"id": %d, "title":"%s"},', $id, $title);
    }
    $result = rtrim($result, ',');
    $result .= ']}';

    echo $result;
?>