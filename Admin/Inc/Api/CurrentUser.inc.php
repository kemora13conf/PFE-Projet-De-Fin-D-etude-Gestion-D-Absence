<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    
    $uid = json_decode($_SESSION['admin']);
    $req = mysqli_query($conn, "SELECT * From Administrateurs WHERE codeAdmin='$uid[0]'");
    
    echo json_encode(renderAdmin(mysqli_fetch_assoc($req)));
?>
