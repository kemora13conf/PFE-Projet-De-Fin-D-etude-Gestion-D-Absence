<?php
    session_start();
    include(__DIR__."/../../Inc/db.inc.php");
    
    if(isset($_SESSION['user'])) unset($_SESSION['user']);
    if(isset($_SESSION['admin'])){
        $uid = json_decode($_SESSION['admin'])[0];
        $mdp = json_decode($_SESSION['admin'])[1];
        $req=mysqli_query(
            $conn,
            "SELECT * FROM Administrateurs WHERE codeAdmin='$uid'"
        ) or die(mysqli_error($conn));
        $admin=mysqli_fetch_assoc($req);
        if(!$admin or $mdp != $admin['mdp']){
            echo "admin";
            session_destroy();
            header('Location:/Admin/Login.php');
        }
    }else header('Location:/Admin/Login.php');