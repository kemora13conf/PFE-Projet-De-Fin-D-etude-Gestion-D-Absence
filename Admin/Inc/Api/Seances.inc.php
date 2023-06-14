<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    if(isset($_GET['delete'])){
        $id = $_GET['delete'];

        mysqli_query($conn, "DELETE FROM sceance WHERE codeSeance = '$id'") or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'Une seance a été suprimer']);
        exit;
    }
    
    if(isset($_GET['classe']) and $_GET['classe'] != '-1'){
        $classId = $_GET['classe'];
        $sceances = "SELECT * From sceance sc, classes cl, matiere m, professeurs prf
                    WHERE sc.codeClasse=cl.codeClasse 
                    AND sc.codeMatiere=m.codeMatiere
                    AND sc.codeProf = prf.codeProf
                    AND sc.codeClasse='$classId'";
        $req = mysqli_query($conn, $sceances) or die(mysqli_error($conn));
        $res = array();
        while ($row = mysqli_fetch_assoc($req)){
            $res[count($res)] = renderSeances($row);
        }
        echo json_encode($res);
        exit;
    }

    $sceances = "SELECT * From sceance sc, classes cl, matiere m, professeurs prf
                    WHERE sc.codeClasse=cl.codeClasse 
                    AND sc.codeMatiere=m.codeMatiere
                    AND sc.codeProf = prf.codeProf";
    $req = mysqli_query($conn, $sceances) or die(mysqli_error($conn));
    $res = array();
    while ($row = mysqli_fetch_assoc($req)){
        $res[count($res)] = renderSeances($row);
    }
    echo json_encode($res);
    exit;
?>
