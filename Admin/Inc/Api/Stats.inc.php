<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    function getAllClasses($conn, $uid){
        $req = mysqli_query(
            $conn,
            "SELECT * FROM classes"
        ) or die(mysqli_error($conn));
        $classes = array();
        while($row = mysqli_fetch_assoc($req)){
            array_push($classes, $row);
        }
        return $classes;
    }
    function getAllEtudiants($conn, $uid){
        $req = mysqli_query(
            $conn,
            "SELECT * FROM etudiants"
        ) or die(mysqli_error($conn));
        $etudiants = array();
        while($row = mysqli_fetch_assoc($req)){
            array_push($etudiants, renderEtudiant($row, $conn));
        }
        return $etudiants;
    }

    if(isset($_GET['chart1'])){
        $uid = json_decode($_SESSION['admin'])[0];
        $whom = $_GET['whom'];
        if($whom == 'classes'){
            $timeType = $_GET['time'];
            $allClasses = getAllClasses($conn, $uid);
            if($timeType == 'month'){
                $month = $_GET['date'];
                $allAbsence=array();
                foreach($allClasses as $classe){
                    $classeId = $classe['codeClasse']; 
                    $req = mysqli_query(
                        $conn, 
                        "SELECT COUNT(*) as TotaleAbsence FROM abscenter 
                        WHERE codeSeance IN (
                            SELECT codeSeance FROM sceance 
                            WHERE codeClasse='$classeId'
                        ) AND date LIKE '%-0$month-%'"
                    ) or die(mysqli_error($conn));
                    $row = mysqli_fetch_assoc($req);
                    array_push(
                        $allAbsence,
                        [
                            'classe'=>$classe,
                            'absence'=>$row['TotaleAbsence']
                        ]
                    );
                }
                echo json_encode($allAbsence);
                exit;
            }
            else if($timeType == 'week'){
                $week = $_GET['date'];
                $week = str_replace('W', '', $week);
                $weekYear = explode('-', $week)[0];
                $weekNumber = explode('-', $week)[1];
                $weekInterval = getWeekInterval($weekNumber, $weekYear);
                $start = $weekInterval['start'];
                $end = $weekInterval['end'];
                $allAbsence=array();
                foreach($allClasses as $classe){
                    $classeId = $classe['codeClasse']; 
                    $req = mysqli_query(
                        $conn, 
                        "SELECT COUNT(*) as TotaleAbsence FROM abscenter 
                        WHERE codeSeance IN (
                            SELECT codeSeance FROM sceance 
                            WHERE codeClasse='$classeId'
                        ) AND date BETWEEN '$start' AND '$end'"
                    ) or die(mysqli_error($conn));
                    $row = mysqli_fetch_assoc($req);
                    array_push(
                        $allAbsence,
                        [
                            'classe'=>$classe,
                            'absence'=>$row['TotaleAbsence']
                        ]
                    );
                }
                echo json_encode($allAbsence);
                exit;
            }
        }
        else if($whom == 'etudiants'){
            $timeType = $_GET['time'];
            if($timeType == 'month'){
                $month = $_GET['date'];
                $allAbsence=array();
                $allEtudiants = getAllEtudiants($conn, $uid);
                foreach($allEtudiants as $etudiant){
                    $cne = $etudiant['cne']; 
                    $req = mysqli_query(
                        $conn, 
                        "SELECT COUNT(*) as TotaleAbsence FROM abscenter 
                        WHERE  CNE='$cne' AND date LIKE '%-0$month-%'"
                    ) or die(mysqli_error($conn));
                    $row = mysqli_fetch_assoc($req);
                    array_push(
                        $allAbsence,
                        [
                            'etudiant'=>$etudiant,
                            'absence'=>$row['TotaleAbsence']
                        ]
                    );
                }
                echo json_encode($allAbsence);
                exit;
            }
            else if($timeType == 'week'){
                $week = $_GET['date'];
                $week = str_replace('W', '', $week);
                $weekYear = explode('-', $week)[0];
                $weekNumber = explode('-', $week)[1];
                $weekInterval = getWeekInterval($weekNumber, $weekYear);
                $start = $weekInterval['start'];
                $end = $weekInterval['end'];

                $allAbsence=array();
                $allEtudiants = getAllEtudiants($conn, $uid);
                foreach($allEtudiants as $etudiant){
                    $cne = $etudiant['cne']; 
                    $req = mysqli_query(
                        $conn, 
                        "SELECT COUNT(*) as TotaleAbsence FROM abscenter 
                        WHERE CNE='$cne' AND date BETWEEN '$start' AND '$end'"
                    ) or die(mysqli_error($conn));
                    $row = mysqli_fetch_assoc($req);
                    array_push(
                        $allAbsence,
                        [
                            'etudiant'=>$etudiant,
                            'absence'=>$row['TotaleAbsence']
                        ]
                    );
                }
                echo json_encode($allAbsence);
                exit;
            }
        }
    }