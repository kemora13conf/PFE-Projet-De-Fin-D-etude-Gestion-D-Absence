<?php
    session_start();
    include '../Inc/prof_auth.inc.php';
    session_destroy();
    header('Location:/');
?>