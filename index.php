<?php
    session_start();
    include 'Inc/db.inc.php';

    // Check if the user is already logged in!!
    if(isset($_SESSION['user'])){
        $uid = json_decode($_SESSION['user']);
        if($uid[2] == 'professor'){
            $req = mysqli_query($conn, "SELECT * From professeurs WHERE codeProf='$uid[0]' AND password='$uid[1]'");
            $res = mysqli_fetch_assoc($req);
            if(!mysqli_error($conn) and isset($res) == 1){
                header('Location:/Professor/');
            }
        }
        if($uid[2] == 'etudiant'){
            $req = mysqli_query($conn, "SELECT * From etudiants WHERE CNE='$uid[0]' AND password='$uid[1]'");
            $res = mysqli_fetch_assoc($req);
            if(!mysqli_error($conn) and isset($res) == 1){
                header('Location:/Etudiant/');
            }
        }
    }

    if (isset($_POST['submit'])){
        $username = $_POST['username'];
        $pwd = md5($_POST['password']);
        if(isset($_POST['isWho'])){
            $isWho = $_POST['isWho'];
            if($isWho === 'professor'){
                $req = mysqli_query($conn, "SELECT * FROM professeurs WHERE email = '$username' LIMIT 1");
                $user = mysqli_fetch_assoc($req);
                if($user){
                    if($user['password'] === $pwd){
                        $_SESSION['user'] = json_encode([$user['codeProf'], $user['password'],'professor']);
                        header('Location:/Professor/');
                    }else{
                        $_SESSION['errors']['pwd'] = "Wrong Password!";
                    }
                }else{
                    $_SESSION['errors']['user'] = "User not found!";
                }
            }
            else if($isWho === 'etudiant'){
                $req = mysqli_query($conn, "SELECT * FROM etudiants WHERE email = '$username' LIMIT 1");
                $user = mysqli_fetch_assoc($req);
                if($user){
                    if($user['password'] === $pwd){
                        if(isset($_SESSION['admin'])) unset($_SESSION['admin']);
                        $_SESSION['user'] = json_encode([$user['CNE'], $user['password'],'etudiant']);
                        header('Location:/Etudiant/');
                    }else{
                        $_SESSION['errors']['pwd'] = "Wrong Password!";
                    }
                }else{
                    $_SESSION['errors']['user'] = "User not found!";
                }
            }
        }else{
            $_SESSION['errors']['isWho'] = "Who are you?!";
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
    <link rel="stylesheet" href="/Styles/fonts/Awesome/css/all.min.css">
    <!-- LINK THE RSET CSS FILE -->
    <link rel="stylesheet" href="/Styles/reset.css">
    <!-- LINK THE STYLE FILE -->
    <link rel="stylesheet" href="/Styles/login.css">


    <!-- LINK THE JAVASCRIPT FILES -->
    <script src="/Scripts/animations.js" defer></script>
</head>
<body>
    <div class="container">
        <div class="main">
            <div class="about">
                <div class="logo">
                    <img src="/Images/logo/logo-transparent.png" alt="M6 logo">
                </div>
                <h1 class="school">BTS MOHAMMED VI</h1>
                <h2 class="second--title">System de gestion d'absence</h2>
                <p class="rights">All rights reserved &copy; 2023</p>
            </div>
    
            <form method="post" class="login-form">
                <h2 class="connexion">CONNEXION</h2>
                <div class="form-group username-group">
                    <div class="input-box">
                        <label for="username" class="label">Addresse Email</label>
                        <input type="text" id="username" name="username" onfocus="onFocusInput(this)" onblur="onBlurInput(this)">
                        <i class="fas fa-user"></i>
                    </div>
                    <?php
                        if(isset($_SESSION['errors']['user'])){
                            echo "<span class='error'>{$_SESSION['errors']['user']}</span>";
                        }
                        unset($_SESSION['errors']['user']);
                    ?>
                        
                </div>
                <div class="form-group password-group">
                    <div class="input-box">
                        <label for="password" class="label">Mot de passe</label>
                        <input type="password" id="password" name="password" onfocus="onFocusInput(this)" onblur="onBlurInput(this)">
                        <i class="fas fa-lock"></i>
                    </div>
                    <?php 
                        if(isset($_SESSION['errors']['pwd'])){
                            echo "<span class='error'>{$_SESSION['errors']['pwd']}</span>";
                        }
                        unset($_SESSION['errors']['pwd']);
                    ?>
                </div>
                <div class="form-group isWho-group">
                    <?php 
                        if(isset($_SESSION['errors']['isWho'])){
                            echo "<span class='error' style='margin:0px;'>{$_SESSION['errors']['isWho']}</span>";
                        }
                        unset($_SESSION['errors']['isWho']);
                    ?>
                    <div class="etudiant">
                        <input type="radio" id="etudiant" value="etudiant" name="isWho">
                        <label for="etudiant">Etudiant</label>
                    </div>
                    <div class="professor">
                        <input type="radio" id="professor" value="professor" name="isWho">
                        <label for="professor">Professeur</label>
                    </div>
                </div>
                <div class="form-group submit-group">
                    <input type="submit" value="SE CONNECTER" name="submit">
                </div>
                <div class="form-group other-group">
                    <a href="/Password Forgotten/" class="forgot-pwd">Mot de passe oublié?</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>