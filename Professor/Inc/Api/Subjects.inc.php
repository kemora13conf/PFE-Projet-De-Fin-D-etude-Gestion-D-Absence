<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    
    $req = mysqli_query($conn, "SELECT * FROM matiere") or die(mysqli_error($conn));
    $res = [];
    while ($row = mysqli_fetch_assoc($req)){
        $res[count($res)] = $row;
    }
    echo json_encode($res);
    exit;
?>