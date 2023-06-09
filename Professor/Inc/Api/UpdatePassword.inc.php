<?php
    include '../../../Inc/db.inc.php';
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    if(isset($_POST)){
        $data = $_POST['data'];
        $data = json_decode($data, true);
        $codeProf = json_decode($_SESSION['user'])[0];
        $hashed_pwd = json_decode($_SESSION['user'])[1];

        $old_pwd = $data['old_password'];
        $new_pwd = $data['new_password'];
        $repeated_pwd = $data['repeated_password'];
        if (md5($old_pwd) == $hashed_pwd){
            if($new_pwd == $repeated_pwd){
                $new_hashed_pwd = md5($new_pwd);
                mysqli_query($conn, "UPDATE professeurs
                                        SET password='$new_hashed_pwd'
                                        WHERE codeProf=$codeProf") or die(mysqli_error($conn));
                $_SESSION['user'] = json_encode([$codeProf, $new_hashed_pwd,'professor']);
                echo json_encode(['code'=>200, 'message'=>'Le mot de passe été changé avec succès']);
            }
        }else echo json_encode(['code'=>404, 'message'=>'Le mot de passe est incorrect']);
    }

?>