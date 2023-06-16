<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    
    if(isset($_GET['codeClass'])){
        // this returns the filteres etudiant all or only the absents or only the presents
        if(
            isset($_GET['filter']) 
            and isset($_GET['date'])
            and isset($_GET['hour'])
            and isset($_GET['duree'])
        ){
            $codeClass = $_GET['codeClass'];
            $filter  = $_GET['filter'];
            $date = $_GET['date'];
            $huere = $_GET['hour'];
            $duree = $_GET['duree'];
            $codeSeance = $_GET['codeSeance'];
            
            $sql = "SELECT CNE FROM etudiants WHERE codeClasse='$codeClass'";
            $req = mysqli_query($conn, $sql) or die(mysqli_error($conn));
            
            // this part of the code get from the database
            // all the etudiant that they are absent in A seance
            $CNEs = array();
            $Etudiants = array();
            while($res = mysqli_fetch_assoc($req)){
                $cne = $res['CNE'];
                for($hour=$huere; $hour<$huere + $duree; $hour++){
                    $sql2 = "SELECT CNE FROM etudiants
                                WHERE CNE IN (SELECT CNE FROM abscenter
                                WHERE CNE='$cne' AND codeSeance='$codeSeance' AND date='$date' AND heure='$hour')";
                    $req2 = mysqli_query($conn, $sql2);
                    while ($row = mysqli_fetch_assoc($req2)){
                        $isExist = false;
                        for($i=0; $i<count($CNEs);$i++){
                            if($CNEs[$i] == $row['CNE']){
                                $isExist = true;
                            }
                        }
                        if(!$isExist) $CNEs[count($CNEs)] = $row['CNE'];
                    }
                }
            }

            // if the user filter choosed only the absent 
            // we get only the the absent etudiant depending on the CNEs array
            if($filter == 'absents'){
                if(count($CNEs) > 0){
                    $final_sql = "SELECT * FROM etudiants WHERE CNE IN (";
                    for($i=0;$i<count($CNEs);$i++){
                        $cne = $CNEs[$i];
                        if($i == count($CNEs)-1){
                            $final_sql .= "'$cne'";
                        }else $final_sql .= "'$cne',";
                    }
                    $final_sql .= ")";
                    $final_req = mysqli_query($conn,$final_sql) or die(mysqli_error($conn));
                    while($row=mysqli_fetch_assoc($final_req)){
                        $Etudiants[count($Etudiants)] = renderEtudiant($row,$conn);
                    }
                    echo json_encode($Etudiants);
                    exit;
                }else{
                    echo json_encode($Etudiants);
                    exit;
                }
                
            }elseif($filter == 'presents'){
                if(count($CNEs) > 0){
                    $final_sql = "SELECT * FROM etudiants WHERE CNE NOT IN (";
                    for($i=0;$i<count($CNEs);$i++){
                        $cne = $CNEs[$i];
                        if($i == count($CNEs)-1){
                            $final_sql .= "'$cne'";
                        }else $final_sql .= "'$cne',";
                    }
                    $final_sql .= ")";
                    $final_req = mysqli_query($conn,$final_sql) or die(mysqli_error($conn));
                    while($row=mysqli_fetch_assoc($final_req)){
                        $Etudiants[count($Etudiants)] = renderEtudiant($row,$conn);
                    }
                    echo json_encode($Etudiants);
                    exit;
                }
            }
        }

        // this return a specific etudiant by his fullname
        if(isset($_GET['prenom']) and isset($_GET['nom'])){
            $codeClass = $_GET['codeClass'];
            $nom  = $_GET['nom'];
            $prenom = $_GET['prenom'];
            $req = mysqli_query($conn, "SELECT * FROM etudiants WHERE codeClasse='$codeClass' AND prenomEtudiant='$prenom' AND nomEtudiant LIKE '$nom%' ORDER BY numOrdre ASC");
            $Etudiants = array();
            while ($row = mysqli_fetch_array($req)){
                $Etudiants[count($Etudiants)] = renderEtudiant($row,$conn);
            }
            echo json_encode($Etudiants);
            exit;
        }

        // this returns a the etudiant that their names ar matched 
        if(isset($_GET['prenom'])){
            $codeClass = $_GET['codeClass'];
            $prenom = $_GET['prenom'];
            $req = mysqli_query($conn, "SELECT * FROM etudiants WHERE codeClasse='$codeClass' AND prenomEtudiant LIKE '$prenom%' ORDER BY numOrdre ASC");
            $Etudiants = array();
            while ($row = mysqli_fetch_array($req)){
                $Etudiants[count($Etudiants)] = renderEtudiant($row,$conn);
            }
            echo json_encode($Etudiants);
            exit;
        }

        // This get returns all the etudiants of a class
        $codeClass = $_GET['codeClass'];
        $req = mysqli_query($conn, "SELECT * FROM etudiants WHERE codeClasse='$codeClass' ORDER BY numOrdre ASC");
        $Etudiants = array();
        while ($row = mysqli_fetch_array($req)){
            $Etudiants[count($Etudiants)] = renderEtudiant($row,$conn);
        }
        echo json_encode($Etudiants);
        exit;
    }
    $req = mysqli_query($conn, "SELECT * FROM classes") or die(mysqli_error($conn));
    $res = [];
    while ($row = mysqli_fetch_assoc($req)){
        $res[count($res)] = $row;
    }
    echo json_encode($res);
?>  
