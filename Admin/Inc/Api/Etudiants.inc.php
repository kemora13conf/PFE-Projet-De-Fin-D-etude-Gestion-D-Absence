<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';
    include '../utils.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    $uploads_dir = '../../../Profile-pictures/Etudiants';

    if(isset($_POST['add-etudiant'])){
        $data = json_decode($_POST['add-etudiant'], true);
        $cne = $data['cne'];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $email = $data['email'];
        $birthday = $data['birthday'];
        $classe = $data['classe'];
        $gender = $data['gender'];
        $mdp = md5(uniqid(time()));
        $image = 'etudiant.png';
        if(isset($_FILES['image'])){
            $tmp_name = $_FILES['image']['tmp_name'];
            $name = basename($_FILES['image']['name']);
            move_uploaded_file($tmp_name, "$uploads_dir/$name");
            $image = $name;
        }
        mysqli_query(
            $conn,
            "INSERT INTO `etudiants`(`CNE`, `numOrdre`, `nomEtudiant`, `prenomEtudiant`, `dateDeNaissance`, `genre`, `image`, `codeClasse`, `email`, `password`)
            VALUES ('$cne', 10, '$nom', '$prenom', '$birthday', '$gender', '$image', '$classe', '$email', '$mdp')"
        ) or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'Un etudiant été ajouter!']);
        exit;
    }
    
    if(isset($_POST['update-etudiant'])){
        $data = json_decode($_POST['update-etudiant'], true);
        $cne = $data['cne'];
        $originalcne = $data['originalcne'];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $email = $data['email'];
        $birthday = $data['birthday'];
        $classe = $data['classe'];
        $gender = $data['gender'];

        $req = mysqli_query($conn, "SELECT * FROM etudiants WHERE cne='$originalcne'");
        if(!$req){die(mysqli_error($conn));}
        $rowsCount = mysqli_num_rows($req);
        if($rowsCount > 0){
            if($cne != $originalcne){
                mysqli_query(
                    $conn, 
                    "UPDATE etudiants SET cne='$cne'
                    WHERE cne='$originalcne'"
                ) or die(mysqli_error($conn));
                $originalcne = $cne;
            }
            if(!checkField($conn, 'etudiants', 'cne', $originalcne, 'nomEtudiant', $nom)){
                mysqli_query(
                    $conn, 
                    "UPDATE etudiants SET nomEtudiant='$nom'
                    WHERE cne='$originalcne'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'etudiants', 'cne', $originalcne, 'prenomEtudiant', $prenom)){
                mysqli_query(
                    $conn, 
                    "UPDATE etudiants SET prenomEtudiant='$prenom'
                    WHERE cne='$originalcne'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'etudiants', 'cne', $originalcne, 'email', $email)){
                mysqli_query(
                    $conn, 
                    "UPDATE etudiants SET email='$email'
                    WHERE cne='$originalcne'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'etudiants', 'cne', $originalcne, 'codeClasse', $classe)){
                mysqli_query(
                    $conn, 
                    "UPDATE etudiants SET codeClasse='$classe'
                    WHERE cne='$originalcne'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'etudiants', 'cne', $originalcne, 'genre', $gender)){
                mysqli_query(
                    $conn, 
                    "UPDATE etudiants SET genre='$gender'
                    WHERE cne='$originalcne'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'etudiants', 'cne', $originalcne, 'dateDeNaissance', $birthday)){
                mysqli_query(
                    $conn, 
                    "UPDATE etudiants SET dateDeNaissance='$birthday'
                    WHERE cne='$originalcne'"
                ) or die(mysqli_error($conn));
            }
            if(isset($_FILES['image'])){
                $tmp_name = $_FILES['image']['tmp_name'];
                $name = basename($_FILES['image']['name']);
                move_uploaded_file($tmp_name, "$uploads_dir/$name");
                mysqli_query(
                    $conn,
                    "UPDATE etudiants
                    SET image='$name'
                    WHERE cne='$originalcne'"
                ) or die(mysqli_error($conn));
            }
            echo json_encode(['code' => 200, 'message' => 'L\'etudiant été modifier!']);
            exit;
        }
        echo json_encode(['code'=>200, 'message'=>'Un etudiant été ajouter!']);
        exit;
    }
    if(isset($_GET['class'])){
        $id = $_GET['class'];
        if($id != '-1'){
            $req = mysqli_query($conn, "SELECT * FROM etudiants WHERE codeClasse='$id'");
            $res = [];
            while ($row = mysqli_fetch_assoc($req)){
                $res[count($res)] = renderEtudiant($row,$conn);
            }
            echo json_encode($res);
            exit;
        }
    }
    if(isset($_GET['delete'])){
        $id = $_GET['delete'];
        mysqli_query($conn, "DELETE FROM etudiants WHERE cne='$id'") or die(mysqli_error($conn));
        echo json_encode(['code'=>200, 'message'=>'L\'etudiant été suprimé!']);
        exit;
    }
    if(isset($_GET['by_cne'])){
        $cne = $_GET['by_cne'];
        $req = mysqli_query($conn,"SELECT * FROM etudiants WHERE cne='$cne'");
        $row = mysqli_fetch_assoc($req);
        echo json_encode(renderEtudiant($row, $conn));
        exit;
    }
    $req = mysqli_query($conn, "SELECT * FROM etudiants");
    $res = [];
    while ($row = mysqli_fetch_assoc($req)){
        $res[count($res)] = renderEtudiant($row,$conn);
    }
    echo json_encode($res);
?>  
