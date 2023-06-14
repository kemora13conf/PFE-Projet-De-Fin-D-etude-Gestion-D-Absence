<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';
    include '../utils.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    $uploads_dir = '../../../Profile-pictures/Teachers';

    if(isset($_POST['add-professor'])){
        $data = json_decode($_POST['add-professor'], true);
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $email = $data['email'];
        $phone = $data['phone'];
        $gender = $data['gender'];
        $mdp = md5(uniqid(time()));
        $image = 'default.png';
        if(isset($_FILES['image'])){
            $tmp_name = $_FILES['image']['tmp_name'];
            $name = basename($_FILES['image']['name']);
            move_uploaded_file($tmp_name, "$uploads_dir/$name");
            $image = $name;
        }
        mysqli_query(
            $conn,
            "INSERT INTO `professeurs`(`codeProf`, `nomProf`, `prenomProf`, `email`, `genre`, `image`, `password`, `telephone`) 
            VALUES (null, '$nom', '$prenom', '$email', '$gender', '$image', '$mdp', '$phone')"
        ) or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'Un professeur été ajouter!']);
        exit;
    }
    
    if(isset($_POST['update-professor'])){
        $data = json_decode($_POST['update-professor'], true);
        $codeProf = $data['codeProf'];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $email = $data['email'];
        $phone = $data['phone'];
        $gender = $data['gender'];

        $req = mysqli_query($conn, "SELECT * FROM professeurs WHERE codeProf='$codeProf'");
        if(!$req){die(mysqli_error($conn));}
        $rowsCount = mysqli_num_rows($req);
        if($rowsCount > 0){
            if(!checkField($conn, 'professeurs', 'codeProf', $codeProf, 'nomProf', $nom)){
                mysqli_query(
                    $conn, 
                    "UPDATE professeurs SET nomProf='$nom'
                    WHERE codeProf='$codeProf'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'professeurs', 'codeProf', $codeProf, 'prenomProf', $prenom)){
                mysqli_query(
                    $conn, 
                    "UPDATE professeurs SET prenomProf='$prenom'
                    WHERE codeProf='$codeProf'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'professeurs', 'codeProf', $codeProf, 'email', $email)){
                mysqli_query(
                    $conn, 
                    "UPDATE professeurs SET email='$email'
                    WHERE codeProf='$codeProf'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'professeurs', 'codeProf', $codeProf, 'telephone', $phone)){
                mysqli_query(
                    $conn, 
                    "UPDATE professeurs SET telephone='$phone'
                    WHERE codeProf='$codeProf'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'professeurs', 'codeProf', $codeProf, 'genre', $gender)){
                mysqli_query(
                    $conn, 
                    "UPDATE professeurs SET genre='$gender'
                    WHERE codeProf='$codeProf'"
                ) or die(mysqli_error($conn));
            }
            if(isset($_FILES['image'])){
                $tmp_name = $_FILES['image']['tmp_name'];
                $name = basename($_FILES['image']['name']);
                move_uploaded_file($tmp_name, "$uploads_dir/$name");
                mysqli_query(
                    $conn,
                    "UPDATE professeurs
                    SET image='$name'
                    WHERE codeProf='$codeProf'"
                ) or die(mysqli_error($conn));
            }
            echo json_encode(['code' => 200, 'message' => 'Le professeur été modifier!']);
            exit;
        }
        echo json_encode(['code'=>404, 'message'=>'Aucun professeur été trouvé!']);
        exit;
    }

    if(isset($_GET['delete'])){
        $id = $_GET['delete'];
        mysqli_query($conn, "DELETE FROM professeurs WHERE codeProf='$id'") or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'Le professeur été suprimé!']);
        exit;
    }

    if(isset($_GET['by_codeProf'])){
        $codeProf = $_GET['by_codeProf'];
        $req = mysqli_query($conn,"SELECT * FROM professeurs WHERE codeProf='$codeProf'") or die(mysqli_error($conn));
        $row = mysqli_fetch_assoc($req);
        echo json_encode(renderProf($row));
        exit;
    }

    $req = mysqli_query($conn, "SELECT * FROM professeurs");
    $res = [];
    while ($row = mysqli_fetch_assoc($req)){
        $res[count($res)] = renderProf($row);
    }
    echo json_encode($res);
?>  
