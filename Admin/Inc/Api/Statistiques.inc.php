<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    if(isset($_GET['chart2'])){
        $codeMatiere = $_GET['codeMatiere'];
        $allAbsence=array();
        $monthsList = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
                       'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'];
        foreach($monthsList as $index => $month){
            $ind = $index+1;
            $req = mysqli_query(
                $conn, 
                "SELECT COUNT(*) as TotaleAbsence FROM abscenter 
                WHERE codeSeance IN (
                    SELECT codeSeance FROM sceance 
                    WHERE codeMatiere='$codeMatiere'
                )
                AND date LIKE '%-0$ind-%'"
            ) or die(mysqli_error($conn));
            $row = mysqli_fetch_assoc($req);
            array_push(
                $allAbsence,
                [
                    'month'=>$month,
                    'absence'=>$row['TotaleAbsence']
                ]
            );
        }
        echo json_encode($allAbsence);
        exit;
    }

    if(isset($_GET['chart3'])){
        $req1 = mysqli_query( // Get The absence of all the etudiants of the first year;
                    $conn,
                    "SELECT * FROM abscenter abs
                    WHERE codeSeance IN (SELECT codeSeance FROM sceance sce, classes cls
                                         WHERE cls.codeClasse=sce.codeClasse
                    					 AND cls.niveauClasse=1)"
                ) or die(mysqli_error($conn));
        $req2 = mysqli_query( // Get The absence of all the etudiants of the second year;
                    $conn,
                    "SELECT * FROM abscenter abs
                    WHERE codeSeance IN (SELECT codeSeance FROM sceance sce, classes cls
                                         WHERE cls.codeClasse=sce.codeClasse
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