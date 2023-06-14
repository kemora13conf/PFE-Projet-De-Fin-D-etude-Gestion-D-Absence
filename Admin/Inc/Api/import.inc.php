<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    if(isset($_POST['etudiants'])){
        if(isset($_FILES['list'])){
            $file = $_FILES['list'];
            import_etudiants($file, $conn);
            echo json_encode(['code'=>200, 'message'=>'La liste été importer avec succès']);
            exit;
        }
    }
    if(isset($_POST['professors'])){
        if(isset($_FILES['list'])){
            $file = $_FILES['list'];
            import_professors($file, $conn);
            echo json_encode(['code'=>200, 'message'=>'La liste été importer avec succès']);
            exit;
        }
    }