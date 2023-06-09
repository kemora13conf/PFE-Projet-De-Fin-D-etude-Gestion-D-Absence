<?php
    include '../../../Inc/db.inc.php';
    include '../../../Inc/utils.inc.php';
    include 'api_func.inc.php';

    if(!isAuthenticated($conn)){
        echo json_encode(['code'=>401, 'message'=>'User not logged in']);
        exit;
    }
    
    if(
        isset($_GET['isAbsent']) 
        and isset($_GET['cne']) 
        and isset($_GET['codeSeance']) 
        and isset($_GET['date']) 
        and isset($_GET['hour'])
    ){
        $cne = $_GET['cne'];
        $codeSeance = $_GET['codeSeance'];
        $date = $_GET['date']; 
        $hour = $_GET['hour'];
        $checkAbsence = isAbsent($conn, $cne, $codeSeance, $date, $hour);
        if($checkAbsence['isAbsent']){
            echo json_encode($checkAbsence);
        }else{
            echo json_encode($checkAbsence);
        }
    }
    if(isset($_POST)){
        $data = file_get_contents('php://input');
        $data = json_decode($data, true);
        $arr = array();
        if(isset($data)){
            foreach($data['data'] as $item){
                $cne=$item['cne'];
                $codeSeance=$item['codeSeance'];
                $date=$item['date'];
                $hour=$item['hour'];
                $cmnt=$item['comment'];
                $checkAbsence = isAbsent($conn, $cne, $codeSeance, $date, $hour);
                if($checkAbsence['isAbsent'] and !$item['absent']){
                    $req = mysqli_query($conn, "DELETE FROM abscenter WHERE CNE='$cne' AND codeSeance='$codeSeance' AND date='$date' AND heure='$hour'") or die(mysqli_error($conn));
                }
                elseif(!$checkAbsence['isAbsent'] and $item['absent']){
                    $req = mysqli_query($conn, "INSERT INTO `abscenter`(`CNE`, `codeSeance`, `date`, `heure`, `justification`, `commentaire`) VALUES ('$cne', '$codeSeance', '$date','$hour','0','$cmnt')") or die(mysqli_error($conn));
                }
            }
            echo json_encode(['code'=>200, 'message'=>'Labsence été enregistrer']);
        }
    }
?>
