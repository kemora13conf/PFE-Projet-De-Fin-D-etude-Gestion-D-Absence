<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    if(isset($_GET['all'])){
        $arr = [];
        $req = mysqli_query(
            $conn,
            "SELECT * From matiere"
        ) or die(mysqli_error($conn));
        while($row = mysqli_fetch_assoc($req)){
            array_push($arr, $row);
        }
        
        echo json_encode($arr);
    }