<?php
    session_start();
    function isAuthenticated($conn){
        if(isset($_SESSION['user'])){
            $uid = json_decode($_SESSION['user']);
            $req = mysqli_query($conn, "SELECT * From etudiants WHERE CNE='$uid[0]' AND password='$uid[1]'");
            $res = mysqli_fetch_assoc($req);
            if(mysqli_error($conn) or isset($res) != 1 or $uid[2] != 'etudiant'){
                return false;
            }
            return true;
        }
        return false;
    }

    