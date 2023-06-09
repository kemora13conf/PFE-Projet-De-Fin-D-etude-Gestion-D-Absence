<?php
    include '../../../Inc/db.inc.php';
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    if(isset($_POST)){
        $id = file_get_contents('php://input');
        $id = json_decode($id, true)['id'];
        mysqli_query($conn, "DELETE FROM sceance WHERE codeSeance = '$id'") or die(mysqli_error($conn));
        
        echo json_encode(['code'=>200, 'message'=>'Une seance a été suprimer']);
    }