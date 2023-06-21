<?php
    include '../../../Inc/db.inc.php';
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    function renderAbsence($row, $seance){
        return [
            'seance' => $seance,
            'date' => $row['date'],
            'heure' => $row['heure'],
            'justification' => $row['justification'],
        ];
    }
    function getSeance($conn, $id){
        $sceance = mysqli_query($conn, "SELECT * From sceance sc, classes cl, matiere m, professeurs prf
                WHERE sc.codeClasse=cl.codeClasse 
                AND sc.codeMatiere=m.codeMatiere
                AND sc.codeProf = prf.codeProf
                AND sc.codeSeance='$id'");
        $row = mysqli_fetch_assoc($sceance);
        return renderSeances($row);
    }
    if(isset($_GET['part'])){
        $uid = json_decode($_SESSION['user'], true)[0];
        $max = $_GET['max'] ?? 10;
        $req = mysqli_query(
            $conn,
            "SELECT * FROM abscenter 
            WHERE cne = '$uid'
            ORDER BY date DESC LIMIT $max");
        
        $arr = [];
        while($row = mysqli_fetch_assoc($req)){
            $seance = getSeance($conn, $row['codeSeance']);
            array_push($arr, renderAbsence($row, $seance));
        }
        echo json_encode($arr);
        exit;
    }