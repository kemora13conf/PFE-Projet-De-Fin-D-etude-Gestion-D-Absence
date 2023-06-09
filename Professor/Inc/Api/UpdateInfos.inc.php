<?php
    include '../../../Inc/db.inc.php';
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    $uploads_dir = '../../../Profile-pictures/Teachers';
    if(isset($_POST)){
        $data = $_POST['data'];
        $data = json_decode($data, true);

        
        $codeProf = json_decode($_SESSION['user'])[0];
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $telephone = $data['telephone'];
        $email = $data['email'];
        $gender = $data['gender'];

        if(!isCurrentUser($conn, 'professeurs', 'nomProf', $nom)){
            mysqli_query($conn, "UPDATE professeurs
                                        SET nomProf='$nom'
                                        WHERE codeProf='$codeProf'") or die(mysqli_error($conn));
            
        }
        if(!isCurrentUser($conn, 'professeurs', 'prenomProf', $prenom)){
            mysqli_query($conn, "UPDATE professeurs
                                        SET prenomProf='$prenom'
                                        WHERE codeProf='$codeProf'") or die(mysqli_error($conn));
        }
        if(!isCurrentUser($conn, 'professeurs', 'email', $email)){
            mysqli_query($conn, "UPDATE professeurs
                                        SET email='$email'
                                        WHERE codeProf='$codeProf'") or die(mysqli_error($conn));
        }
        if(!isCurrentUser($conn, 'professeurs', 'telephone', $telephone)){
            mysqli_query($conn, "UPDATE professeurs
                                        SET telephone='$telephone'
                                        WHERE codeProf='$codeProf'") or die(mysqli_error($conn));
        }
        if(!isCurrentUser($conn, 'professeurs', 'genre', $gender)){
            mysqli_query($conn, "UPDATE professeurs
                                        SET genre='$gender'
                                        WHERE codeProf='$codeProf'") or die(mysqli_error($conn));
        }
        if(isset($_FILES['image'])){
            $tmp_name = $_FILES['image']['tmp_name'];
            $name = basename($_FILES['image']['name']);
            move_uploaded_file($tmp_name, "$uploads_dir/$name");
            mysqli_query($conn, "UPDATE professeurs
                                        SET image='$name'
                                        WHERE codeProf='$codeProf'") or die(mysqli_error($conn));
        }

        echo json_encode(['code'=>200, 'message'=>'Les données sont enregistré avec succès']);
    }
?>