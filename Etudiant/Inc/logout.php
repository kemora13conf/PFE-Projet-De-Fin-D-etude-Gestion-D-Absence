<?php
    session_start();
    include '../Inc/etudiant_auth.inc.php';
    session_destroy();
    header('Location:/');
?>