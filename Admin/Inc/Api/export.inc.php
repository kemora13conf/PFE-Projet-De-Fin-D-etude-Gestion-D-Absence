<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    if(isset($_GET['professors-template'])){
        $file_name = export_template('professors');
        echo json_encode($file_name);
    }
    if(isset($_GET['professors'])){
        $file_name = export_professeurs($conn);
        echo json_encode($file_name);
    }
    if(isset($_GET['etudiants-template'])){
        $file_name = export_template('etudiants');
        echo json_encode($file_name);
    }
    if(isset($_GET['etudiants']) && isset($_GET['filter'])){
        $filter = $_GET['filter'];
        $file_name = export_etudiants($conn, $filter);
        echo json_encode($file_name);
    }