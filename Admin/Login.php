<?php
    session_start();
    include '../Inc/db.inc.php';

    // Check if the user is already logged in!!
    if(isset($_SESSION['admin'])){
        $uid = json_decode($_SESSION['admin'])[0];
        $mdp = json_decode($_SESSION['admin'])[1];
        $req=mysqli_query(
            $conn,
            "SELECT * FROM Administrateurs WHERE codeAdmin='$uid'"
        ) or die(mysqli_error($conn));
        $admin=mysqli_fetch_assoc($req);
        if($admin and $mdp == $admin['mdp']){
            header('Location:/Admin/Admin.php');
        }
    }

    if (isset($_POST['submit'])){
        $email = $_POST['username'];
        $pwd = md5($_POST['password']);
        $req=mysqli_query(
            $conn,
            "SELECT * FROM Administrateurs WHERE email='$email'"
        ) or die(mysqli_error($conn));
        $admin=mysqli_fetch_assoc($req);
        if($admin){
            if($pwd == $admin['mdp']){
                if(isset($_SESSION['user'])) unset($_SESSION['user']);
                $_SESSION['admin'] = json_encode([$admin['codeAdmin'],$pwd]);
                header('Location:/Admin/');
            }else{
                $_SESSION['errors']['pwd'] = "Wrong Password!";
            }
        }else{
            $_SESSION['errors']['user'] = "User not found!";
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ADMIN M6 - LOGIN</title>
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
                <h2 class="connexion">ADMIN</h2>
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
                <div class="form-group submit-group">
                    <input type="submit" value="SE CONNECTER" name="submit">
                </div>
                <div class="form-group other-group">
                    <a href="#" class="forgot-pwd">Mot de passe oublié?</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>