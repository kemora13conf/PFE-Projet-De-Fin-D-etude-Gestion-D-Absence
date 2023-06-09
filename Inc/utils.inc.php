<?php
    function renderAdmin($user){
        $userObj = array(
            'codeProf' => $user['codeAdmin'],
            'nom' => $user['nom'],
            'prenom' => $user['prenom'],
            'email' => $user['email'],
            'telephone' => $user['telephone'],
            'image' => $user['image'],
            'gender' => $user['genre']
        );
        return $userObj;
    }
    function renderProf($user){
        $userObj = array(
            'codeProf' => $user['codeProf'],
            'nomProf' => $user['nomProf'],
            'prenomProf' => $user['prenomProf'],
            'email' => $user['email'],
            'telephone' => $user['telephone'],
            'gender' => $user['genre'],
            'image' => $user['image']
        );
        return $userObj;
    }
    function renderEtudiant($user, $conn){
        $classe = mysqli_fetch_assoc(
            mysqli_query(
                $conn,
                "SELECT * FROM classes WHERE codeClasse='".$user['codeClasse']."'"
            )
        );
        $userObj = array(
            'cne' => $user['CNE'],
            'orderNb' => $user['numOrdre'],
            'nom' => $user['nomEtudiant'],
            'prenom' => $user['prenomEtudiant'],
            'birthday' => $user['dateDeNaissance'],
            'gender' => $user['genre'],
            'image' => $user['image'],
            'email' => $user['email'],
            'codeClasse' => $user['codeClasse'],
            'classe' => $classe['niveauClasse']."-".$classe['nomClasse']
        );
        return $userObj;
    }
    function renderHour(int $hour){
        switch ($hour){
            case 1: return '8:30';
            case 2: return '9:30';
            case 3: return '10:30';
            case 4: return '11:30';
            case 5: return '2:30';
            case 6: return '3:30';
            case 7: return '4:30';
            case 8: return '5:30';
        }
    }
    function renderPeriode($hour, int $duree){
        $str = '';
        for($i = 0; $i < strlen($hour); $i++){
            if ($hour[$i] == ':') break;
            $str .= $hour[$i];
        }
        $num = (int) $str;
        $v = $num + $duree;
        return $v . ':30';
    }
    function renderSeances($items, $total=0){
        $seanceObj = array(
            'codeProf' => $items['codeProf'],
            'codeClass' => $items['codeClasse'],
            'nomClass' => $items['nomClasse'],
            'niveauClass' => $items['niveauClasse'],
            'codeMatiere' => $items['codeMatiere'],
            'nomMatiere' => $items['nomMatiere'],
            'codeSeance' => $items['codeSeance'],
            'jour' => $items['jour'],
            'heure' => $items['heure'],
            'duree' => $items['duree'],
            'period' => renderHour($items['heure']).' - '.renderPeriode(renderHour($items['heure']), $items['duree']),
            'total' => $total
        );
        return $seanceObj;
    }

    function isAbsent($conn, $cne, $codeSeance, $date, $hour){
        $req = mysqli_query($conn, "SELECT * FROM abscenter WHERE CNE='$cne' AND codeSeance='$codeSeance' AND date='$date' AND heure='$hour'") or die(mysqli_error($conn));
        $res = mysqli_fetch_array($req);
        if(isset($res)) return ['isAbsent'=>true, 'comment'=>$res['commentaire']];
        return ['isAbsent' => false];
    }

    function isCurrentUser($conn, $table, $name, $item){
        $id = mysqli_real_escape_string($conn, json_decode($_SESSION['user'])[0]);

        $query = "";
        if ($table == 'professeurs') {
            $query = "SELECT * FROM professeurs WHERE codeProf='$id' AND `$name`='$item'";
        } elseif ($table == 'etudiants') {
            $query = "SELECT * FROM etudiants WHERE CNE='$id' AND `$name`='$item'";
        }

        $result = mysqli_query($conn, $query);
        if (!$result) {
            // Handle query error gracefully, e.g., log the error or display an error message
            die(mysqli_error($conn));
        }

        $rowCount = mysqli_num_rows($result);
        return $rowCount > 0;
    }