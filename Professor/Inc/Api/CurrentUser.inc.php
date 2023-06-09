<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    
    $uid = json_decode($_SESSION['user']);
    $req = mysqli_query($conn, "SELECT * From professeurs WHERE codeProf='$uid[0]'");
    
    echo json_encode(renderProf(mysqli_fetch_assoc($req)));
?>
