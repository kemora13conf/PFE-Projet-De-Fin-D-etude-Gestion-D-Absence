<?php
    session_start();
    function isAuthenticated($conn){
        if(isset($_SESSION['admin'])){
            $uid = json_decode($_SESSION['admin']);
            $req = mysqli_query(
                $conn,
                "SELECT * From Administrateurs WHERE codeAdmin='$uid[0]' AND mdp='$uid[1]'"
            );
            $res = mysqli_fetch_assoc($req);
            if(mysqli_error($conn) or !$res){
                return false;
            }
            return true;
        }
        return false;
    }

    