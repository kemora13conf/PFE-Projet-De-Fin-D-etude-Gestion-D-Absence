<?php
    include '../../../Inc/db.inc.php';
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    $uploads_dir = '../../../Profile-pictures/Etudiants';
    if(isset($_POST)){
        $data = $_POST['data'];
        $data = json_decode($data, true);
        
        $cne = json_decode($_SESSION['user'])[0];
        $hashed_pwd = json_decode($_SESSION['user'])[1];
        $email = $data['email'];

        $old_pwd = $data['old_password'];
        $new_pwd = $data['new_password'];
        $repeated_pwd = $data['repeated_password'];

        if(!isCurrentUser($conn, 'etudiants', 'email', $email)){
            mysqli_query($conn, "UPDATE etudiants
                                        SET email='$email'
                                        WHERE cne='$cne'") or die(mysqli_error($conn));
        }
        if(isset($_FILES['image'])){
            $tmp_name = $_FILES['image']['tmp_name'];
            $name = basename($_FILES['image']['name']);
            move_uploaded_file($tmp_name, "$uploads_dir/$name");
            mysqli_query($conn, "UPDATE etudiants
                                        SET image='$name'
                                        WHERE cne='$cne'") or die(mysqli_error($conn));
        }

        if(!empty($old_pwd)){
            if (md5($old_pwd) == $hashed_pwd){
                if($new_pwd == $repeated_pwd){
                    $new_hashed_pwd = md5($new_pwd);
                    mysqli_query($conn, "UPDATE etudiants
                                            SET password='$new_hashed_pwd'
                                            WHERE cne='$cne'") or die(mysqli_error($conn));
                    $_SESSION['user'] = json_encode([$cne, $new_hashed_pwd,'etudiant']);
                }else{
                    echo json_encode(['code'=>404, 'message'=>'Les deux mot de passe sont pas les meme']);
                    exit;
                }
            }else{
                echo json_encode(['code'=>404, 'message'=>'Le mot de passe est incorrect']);
                exit;
            }
        }

        echo json_encode(['code'=>200, 'message'=>'Les données sont enregistré avec succès']);
    }
?>