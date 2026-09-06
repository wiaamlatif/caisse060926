<?php
//session_start();


$idUser = isset($_GET['idUser']) ? (int)$_GET['idUser'] : 0;

if ($idUser <= 0 && isset($_SESSION['user']['id_user'])) {
    $idUser = (int)$_SESSION['user']['id_user'];  
}


require_once './database.php';

$sql = "SELECT * FROM tickets 
        INNER JOIN users ON tickets.id_user = users.id_user
        WHERE tickets.id_user = $idUser
        ORDER BY id_ticket ASC";

$result = mysqli_query($conn, $sql);

$userTickets = mysqli_fetch_all($result, MYSQLI_ASSOC);

$arrayData = [];
foreach ($userTickets as $userTicket) {

    array_push($arrayData, $userTicket);
}

print_r(json_encode($arrayData));