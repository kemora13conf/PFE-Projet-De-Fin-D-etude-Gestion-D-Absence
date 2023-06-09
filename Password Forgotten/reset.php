<?php
    session_start();
    include '../Inc/db.inc.php';

    // Check if the user is already logged in!!
    if(isset($_SESSION['user'])){
        $uid = json_decode($_SESSION['user']);
        $req = mysqli_query($conn, "SELECT * From professeurs WHERE codeProf='$uid[0]' AND password='$uid[1]'");
        $res = mysqli_fetch_assoc($req);
        if(!mysqli_error($conn) and isset($res) == 1 and $uid[2] == 'professor'){
            header('Location:/Professor/');
        }
        if(!mysqli_error($conn) and isset($res) == 1 and $uid[2] == 'etudiant'){
            header('Location:/Etudiant/');
        }
    }

    if(isset($_GET['token'])){
        $token = $_GET['token'];
        $req = mysqli_query($conn, "SELECT * FROM professeurs WHERE reset_token='$token' LIMIT 1") or die(mysqli_error($conn));
        $res = mysqli_fetch_assoc($req);

        if(!isset($res)){
            header('Location:/');
        }
    }

    if (isset($_POST['submit'])){
        $token = $_GET['token'];
        $pwd = md5($_POST['pwd']);
        $re_pwd = md5($_POST['re-pwd']);
        if(strlen($pwd) >= 6 ){
            if($pwd === $re_pwd){
                mysqli_query($conn, "UPDATE professeurs SET password='$pwd' WHERE reset_token='$token' LIMIT 1") or die(mysqli_error($conn));
                header('Location:/');
            }else{
                $_SESSION['errors']['re-pwd'] = "Les deux mot de passe sont pas les meme!";
            }
        }else{
            $_SESSION['errors']['pwd'] = "le mot de passe est tres courte!";
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion d'absence M6 - LOGIN</title>
    <!-- LINK THE FONT AWESOME LIBRARY -->
    <link rel="stylesheet" href="../Styles/fonts/Awesome/css/all.min.css">
    <!-- LINK THE RSET CSS FILE -->
    <link rel="stylesheet" href="../Styles/reset.css">
    <!-- LINK THE STYLE FILE -->
    <link rel="stylesheet" href="../Styles/login.css">


    <!-- LINK THE JAVASCRIPT FILES -->
    <script src="../Scripts/animations.js" defer></script>
</head>
<body>
    <div class="container">
        <div class="main">
            <div class="about">
                <div class="logo">
                    <img src="../Images/logo/logo-transparent.png" alt="M6 logo">
                </div>
                <h1 class="school">BTS MOHAMMED VI</h1>
                <h2 class="second--title">System de gestion d'absence</h2>
                <p class="rights">All rights reserved &copy; 2023</p>
            </div>
    
            <form method="post" class="login-form">
                <h2 class="connexion" style="text-align: center;">CHANGER LE MOT DE PASSE</h2>
                <div class="form-group password-group">
                    <div class="input-box">
                        <label for="password" class="label">Nouveau mot de passe</label>
                        <input type="password" id="password" name="pwd" onfocus="onFocusInput(this)" onblur="onBlurInput(this)">
                        <i class="fas fa-lock"></i>
                    </div>
                    <?php 
                        if(isset($_SESSION['errors']['pwd'])){
                            echo "<span class='error'>{$_SESSION['errors']['pwd']}</span>";
                        }
                        unset($_SESSION['errors']['pwd']);
                    ?>
                </div>
                <div class="form-group password-group">
                    <div class="input-box">
                        <label for="re-password" class="label">Re-ecrire le mot de passe</label>
                        <input type="password" id="re-password" name="re-pwd" onfocus="onFocusInput(this)" onblur="onBlurInput(this)">
                        <i class="fas fa-lock"></i>
                    </div>
                    <?php 
                        if(isset($_SESSION['errors']['re-pwd'])){
                            echo "<span class='error'>{$_SESSION['errors']['re-pwd']}</span>";
                        }
                        unset($_SESSION['errors']['re-pwd']);
                    ?>
                </div>
                <div class="form-group submit-group">
                    <input type="submit" value="CHANGER LE MOT DE PASSE" name="submit">
                </div>
                <div class="form-group other-group">
                    <a href="/" class="forgot-pwd" style="margin-right: auto">Voulez-vous vous connecter?</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>