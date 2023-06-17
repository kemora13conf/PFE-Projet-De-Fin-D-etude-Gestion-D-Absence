<?php
    include "../../../Inc/db.inc.php";
    include '../../../Inc/utils.inc.php';
    include '../utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }

    $uploads_dir = "../../../Profile-pictures/Admins/";
    
    if(isset($_POST['update-admin'])){
        $data = json_decode($_POST['update-admin'], true);
        $codeAdmin = $data['codeAdmin'];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $email = $data['email'];
        $phone = $data['phone'];
        $gender = $data['gender'];

        $req = mysqli_query($conn, "SELECT * FROM administrateurs WHERE codeAdmin='$codeAdmin'");
        if(!$req){die(mysqli_error($conn));}
        $rowsCount = mysqli_num_rows($req);
        if($rowsCount > 0){
            if(!checkField($conn, 'administrateurs', 'codeAdmin', $codeAdmin, 'nom', $nom)){
                mysqli_query(
                    $conn, 
                    "UPDATE administrateurs SET nom='$nom'
                    WHERE codeAdmin='$codeAdmin'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'administrateurs', 'codeAdmin', $codeAdmin, 'prenom', $prenom)){
                mysqli_query(
                    $conn, 
                    "UPDATE administrateurs SET prenom='$prenom'
                    WHERE codeAdmin='$codeAdmin'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'administrateurs', 'codeAdmin', $codeAdmin, 'email', $email)){
                mysqli_query(
                    $conn, 
                    "UPDATE administrateurs SET email='$email'
                    WHERE codeAdmin='$codeAdmin'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'administrateurs', 'codeAdmin', $codeAdmin, 'telephone', $phone)){
                mysqli_query(
                    $conn, 
                    "UPDATE administrateurs SET telephone='$phone'
                    WHERE codeAdmin='$codeAdmin'"
                ) or die(mysqli_error($conn));
            }
            if(!checkField($conn, 'administrateurs', 'codeAdmin', $codeAdmin, 'genre', $gender)){
                mysqli_query(
                    $conn, 
                    "UPDATE administrateurs SET genre='$gender'
                    WHERE codeAdmin='$codeAdmin'"
                ) or die(mysqli_error($conn));
            }
            if(isset($_FILES['image'])){
                $tmp_name = $_FILES['image']['tmp_name'];
                $name = basename($_FILES['image']['name']);
                move_uploaded_file($tmp_name, "$uploads_dir/$name");
                mysqli_query(
                    $conn,
                    "UPDATE administrateurs
                    SET image='$name'
                    WHERE codeAdmin='$codeAdmin'"
                ) or die(mysqli_error($conn));
            }
            echo json_encode(['code' => 200, 'message' => 'Le professeur été modifier!']);
            exit;
        }
        echo json_encode(['code'=>404, 'message'=>'Aucun professeur été trouvé!']);
        exit;
    }

    
    if(isset($_POST['update-admin-password'])){
        $data = $_POST['update-admin-password'];
        $data = json_decode($data, true);
        $codeAdmin = json_decode($_SESSION['admin'])[0];
        $hashed_pwd = json_decode($_SESSION['admin'])[1];

        $old_pwd = $data['old_password'];
        $new_pwd = $data['new_password'];
        $repeated_pwd = $data['repeated_password'];
        if (md5($old_pwd) == $hashed_pwd){
            if($new_pwd == $repeated_pwd){
                $new_hashed_pwd = md5($new_pwd);
                mysqli_query($conn, "UPDATE administrateurs
                                        SET mdp='$new_hashed_pwd'
                                        WHERE codeAdmin=$codeAdmin") or die(mysqli_error($conn));
                $_SESSION['user'] = json_encode([$codeAdmin, $new_hashed_pwd]);
                echo json_encode(['code'=>200, 'message'=>'Le mot de passe été changé avec succès']);
            }
        }else echo json_encode(['code'=>404, 'message'=>'Le mot de passe est incorrect']);
    }