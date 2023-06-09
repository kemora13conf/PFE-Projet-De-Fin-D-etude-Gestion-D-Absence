<?php
    include 'admin_auth.inc.php';
    session_destroy();
    header('Location:/');
?>