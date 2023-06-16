<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    if(isset($_POST['submit'])){
        // $data = file_get_contents('php://input');
        // $data = json_decode($data, true);
        $data = json_decode($_POST['submit'], true);
        $name = $data['name'];
        $level = $data['level'];
        mysqli_query(
            $conn,
            "INSERT INTO `classes`(`codeClasse`, `nomClasse`, `niveauClasse`)
            VALUES (null, '$name', '$level')"
        ) or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'Une classe été ajouter!', 'name'=>$name, 'level'=>$level]);
        exit;
    }
    if(isset($_GET['classe'])){
        $id = $_GET['classe'];
        $req = mysqli_query($conn, "SELECT * FROM classes WHERE codeClasse=$id") or die(mysqli_error($conn));
        echo json_encode(['classe'=>mysqli_fetch_assoc($req)]);
        exit;
    }
    
    if(isset($_GET['etudiants'])){
        $id = $_GET['etudiants'];
        $req = mysqli_query($conn, "SELECT * FROM etudiants WHERE codeClasse=$id") or die(mysqli_error($conn));
        $etudiants = array();
        while($row = mysqli_fetch_assoc($req)){
            $etudiants[count($etudiants)] = renderEtudiant($row, $conn);
        }
        echo json_encode($etudiants);
        exit;
    }
    if(isset($_GET['getTotal'])){
        $id = $_GET['getTotal'];
        $req = mysqli_query($conn, "SELECT COUNT(*) as total FROM etudiants WHERE codeClasse=$id") or die(mysqli_error($conn));
        echo json_encode(['total'=>mysqli_fetch_assoc($req)['total']]);
        exit;
    }
    if(isset($_GET['delete'])){
        $id = $_GET['delete'];
        mysqli_query($conn, "DELETE FROM classes WHERE codeClasse='$id'") or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'La classe été suprimé!']);
        exit;
    }
    $req = mysqli_query($conn, "SELECT * FROM classes");
    $res = [];
    while ($row = mysqli_fetch_assoc($req)){
        $res[count($res)] = $row;
    }
    echo json_encode($res);
?>  
