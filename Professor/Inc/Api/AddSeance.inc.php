<?php
    include '../../../Inc/db.inc.php';
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    if(isset($_POST['submit'])){
        $data =  json_decode($_POST['data'], true);
        $codeProf = json_decode($_SESSION['user'])[0];
        $codeClasse = $data['codeClasse'];
        $codeMatiere = $data['codeMatiere'];
        $jour = $data['jour'];
        $heure = $data['heure'];
        $periode = $data['periode'];
        
        mysqli_query(
                $conn,
                "INSERT INTO 
                `sceance` (codeSeance, duree, codeProf, codeClasse, codeMatiere, jour, heure)
                VALUES (null, '$periode', '$codeProf', '$codeClasse', '$codeMatiere', '$jour', '$heure')"
                ) or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'Une seance a été ajouter']);
        exit;
    }