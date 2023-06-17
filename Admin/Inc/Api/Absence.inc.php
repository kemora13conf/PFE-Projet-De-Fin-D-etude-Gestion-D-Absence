<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    if(isset($_POST['justify'])){
        $data = json_decode($_POST['justify'], true);
        $codeSeance = $data['codeSeance'];
        $date = $data['date'];
        $hour = $data['hour'];
        $cne = $data['cne'];

        $req = mysqli_query($conn, "UPDATE `abscenter` SET `justification`='1' WHERE CNE='$cne' AND codeSeance='$codeSeance' AND date='$date' AND heure='$hour'") or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'L\'absence été justifié']);
    }
    if(isset($_POST['un-justify'])){
        $data = json_decode($_POST['un-justify'], true);
        $codeSeance = $data['codeSeance'];
        $date = $data['date'];
        $hour = $data['hour'];
        $cne = $data['cne'];

        $req = mysqli_query($conn, "UPDATE `abscenter` SET `justification`='0' WHERE CNE='$cne' AND codeSeance='$codeSeance' AND date='$date' AND heure='$hour'") or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'L\'absence est non-justifié']);
    }