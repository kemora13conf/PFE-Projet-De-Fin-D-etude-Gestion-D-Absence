<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    
    $uid = json_decode($_SESSION['user']);
    if(isset($_GET['jour']) and isset($_GET['filter'])){
        $jour = $_GET['jour'];
        $filter = $_GET['filter'];
        $sceances = '';

        if($filter == 'all'){
            $sceances = "SELECT * From sceance sc, classes cl, matiere m 
                        WHERE sc.codeClasse=cl.codeClasse 
                        AND sc.codeMatiere=m.codeMatiere
                        AND sc.codeProf='$uid[0]'";
            if(intval($jour) != -1) $sceances .= "AND jour='$jour'";
        }
        else if ($filter == 'second'){
            $sceances = "SELECT * From sceance sc, classes cl, matiere m 
                        WHERE sc.codeClasse=cl.codeClasse 
                        AND sc.codeMatiere=m.codeMatiere
                        AND cl.niveauClasse=2
                        AND sc.codeProf='$uid[0]'";
            if(intval($jour) != -1) $sceances .= "AND jour='$jour'";
        }
        else if ($filter == 'first'){
            $sceances = "SELECT * From sceance sc, classes cl, matiere m 
                        WHERE sc.codeClasse=cl.codeClasse 
                        AND sc.codeMatiere=m.codeMatiere
                        AND cl.niveauClasse=1
                        AND sc.codeProf='$uid[0]'";
            if(intval($jour) != -1) $sceances .= "AND jour='$jour'";
        }
        else{
            echo json_encode(['code'=>404, 'message'=>'Filter est inconnue']);
            exit;
        }
        $req = mysqli_query($conn, $sceances) or die(mysqli_error($conn));
        $res = array();
        while ($row = mysqli_fetch_assoc($req)){
            $cc = $row['codeClasse'];
            $total = mysqli_query($conn,"SELECT COUNT(*) AS total FROM etudiants WHERE codeClasse='$cc'");
            $total = mysqli_fetch_array($total);
            $res[count($res)] = renderSeances($row, $total['total']);
        }
        echo json_encode($res);
        exit;
    }
    $sceances = "SELECT * From sceance sc, classes cl, matiere m 
                    WHERE sc.codeClasse=cl.codeClasse 
                    AND sc.codeMatiere=m.codeMatiere
                    AND sc.codeProf='$uid[0]'";
    $req = mysqli_query($conn, $sceances) or die(mysqli_error($conn));
    $res = array();
    while ($row = mysqli_fetch_assoc($req)){
        $res[count($res)] = renderSeances($row);
    }
    echo json_encode($res);
    exit;
?>
