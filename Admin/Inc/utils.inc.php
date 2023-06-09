<?php
    function checkField($conn, $table, $idCol, $idVal, $column, $value){
        $res = mysqli_query($conn, "SELECT * FROM `$table` WHERE `$idCol`='$idVal' AND $column='$value'");
        if(!$res){die(mysqli_error($conn));}
        return mysqli_num_rows($res) > 0;
    }