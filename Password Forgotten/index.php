<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require '../assests/phpmailer/src/Exception.php';
    require '../assests/phpmailer/src/PHPMailer.php';
    require '../assests/phpmailer/src/SMTP.php';

    include '../Inc/db.inc.php';

    session_start();
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
    $addScript = false;
    if (isset($_POST['submit'])){
        $mail = new PHPMailer(true);

        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'devops72023@gmail.com';
        $mail->Password = 'kayhrfsxapgacddg';
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;

        $username = $_POST['username'];
        $req = mysqli_query($conn, "SELECT * FROM professeurs WHERE email = '$username' LIMIT 1");
        $user = mysqli_fetch_assoc($req);
        if($user){
            $token = bin2hex(random_bytes(32));
            $email = $user['email'];
            $query = "UPDATE professeurs SET reset_token='$token' WHERE email = '$email'";
            mysqli_query($conn, $query) or die(mysqli_error($conn));

            $mail->setFrom('devops72023@gmail.com');
            $mail->addAddress($email);
            $mail->isHTML(true);
            $mail->Subject = "Reinitialization de mot de passe";

            $resetLink = "http://".$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT']."/Password%20Forgotten/reset.php?token=".urlencode($token);
            
            $mail->Body = "Clicker sur le lien pour changer votre mot de passe: $resetLink";
            $mail->send();
            
            $addScript = true;

        }else{
            $_SESSION['errors']['user'] = "Email not found!";
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion d'absence M6 - MOT DE PASSE OUBLIER</title>
    <!-- LINK THE FONT AWESOME LIBRARY -->
    <link rel="stylesheet" href="/Styles/fonts/Awesome/css/all.min.css">
    <!-- LINK THE RSET CSS FILE -->
    <link rel="stylesheet" href="/Styles/reset.css">
    <!-- LINK THE STYLE FILE -->
    <link rel="stylesheet" href="/Styles/login.css">


    <!-- LINK THE JAVASCRIPT FILES -->
    <script src="/Scripts/animations.js" defer></script>
    <style>
        .alerts-container{
            all: unset;
            width: 100%;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            pointer-events: none;
        }

    </style>
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
                <h2 class="connexion" style="text-align:center">RÉINITIALISATION DE MOT DE PASSE</h2>
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
                <div class="form-group submit-group">
                    <input type="submit" value="Envoyer un lien" name="submit">
                </div>
                <div class="form-group other-group">
                    <a href="/" class="forgot-pwd" style="margin-right: auto">Voulez-vous vous connecter?</a>
                </div>
            </form>
        </div>
    </div>
    <div class="alerts-container" id="alerts-container"></div>
    <?php if($addScript){?>
        <script type='module' src='/Scripts/reset.js'></script>
    <?php } ?>
</body>
</html>