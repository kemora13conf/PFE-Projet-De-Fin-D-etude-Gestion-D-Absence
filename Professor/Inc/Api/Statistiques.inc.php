<?php

    include '../../../Inc/db.inc.php';
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    if(isset($_GET['chart1'])){

    }

    if(isset($_GET['chart2'])){
        
    }

    if(isset($_GET['chart3'])){
        $uid = intval(json_decode($_SESSION['user'])[0]);
        $req1 = mysqli_query( // Get The absence of all the etudiants of the first year;
                    $conn,
                    "SELECT * FROM abscenter abs
                    WHERE codeSeance IN (SELECT codeSeance FROM sceance sce, classes cls
                                         WHERE cls.codeClasse=sce.codeClasse
                                         AND sce.codeProf=$uid
                    					 AND cls.niveauClasse=1)"
                ) or die(mysqli_error($conn));
        $req2 = mysqli_query( // Get The absence of all the etudiants of the second year;
                    $conn,
                    "SELECT * FROM abscenter abs
                    WHERE codeSeance IN (SELECT codeSeance FROM sceance sce, classes cls
                                         WHERE cls.codeClasse=sce.codeClasse
                                         AND sce.codeProf=$uid
                    					 AND cls.niveauClasse=2)"
                ) or die(mysqli_error($conn));
        $first = [];
        $second = [];
        while ($row = mysqli_fetch_array($req1)){
            array_push($first, $row);
        }
        while ($row2 = mysqli_fetch_array($req2)){
            array_push($second, $row2);
        }
        $res = [
            'first' => count($first),
            'second' => count($second)
        ];
        echo json_encode($res);
    }