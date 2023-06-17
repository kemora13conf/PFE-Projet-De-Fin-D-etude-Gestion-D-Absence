<?php

    // Include the PhpSpreadsheet library
    require __DIR__.'/../assests/vendor/autoload.php';

    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
    use PhpOffice\PhpSpreadsheet\Style\Font;
    use PhpOffice\PhpSpreadsheet\Style\Alignment;
    use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
    use PhpOffice\PhpSpreadsheet\IOFactory;


    function renderAdmin($user){
        $userObj = array(
            'code' => $user['codeAdmin'],
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
            'nomProf' => $items['nomProf'],
            'prenomProf' => $items['prenomProf'],
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
        if(isset($res)) return ['isAbsent'=>true, 'comment'=>$res['commentaire'], 'justification'=>$res['justification']];
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

    function export_professeurs($conn){
        $id = uniqid();
        $export_to = __DIR__.'/../Exported-Files/';

        // Retrieve data from the table
        $query = "SELECT prenomProf, nomProf, genre, email, telephone FROM professeurs";
        $result = mysqli_query($conn, $query);

        // Create a new Excel workbook and worksheet
        $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();

        // Set the table headers
        $headers = ['Prenom', 'Nom', 'Genre', 'Email', 'Telephone'];

        // Set the table data
        $data = [];

        // fetch the data
        while ($row = mysqli_fetch_assoc($result)){
            $line = [$row['prenomProf'], $row['nomProf'], $row['genre'], $row['email'], $row['telephone']];
            $data[count($data)] = $line;
        }

        // Set the starting cell for the table
        $headerStartCell = 'B3';
        $dataStartCel = 'B4';

        // Write the headers to the worksheet
        $headerRange = $worksheet->fromArray($headers, null, $headerStartCell, true);

        // Apply style to each cell of the header
        $headerStyleArray = [
            'font' => [
                'size' => 14,
            ],
            'alignment' => [
                'wrapText' => true,
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startColor' => ['argb' => 'FFA0A0A0'],
                'endColor' => ['argb' => 'FFFFFFFF'],
            ],
            'padding' => [
                'top' => 20,
                'right' => 10,
                'bottom' => 20,
                'left' => 10,
            ],
        ];
        $worksheet->getStyle('B3:F3')->applyFromArray($headerStyleArray);
        $worksheet->getRowDimension(3)->setRowHeight(30);

        // Write the data to the worksheet
        $worksheet->fromArray($data, null, $dataStartCel, true);

        // Style the table
        // Apply styles to the table
        $styleArray = [
            'borders' => [
                'outline' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ];
        $tableRange = $headerStartCell . ':' . $worksheet->getCellByColumnAndRow(count($headers)+1, count($data) + 1+2)->getColumn() . (count($data) + 1+2);
        $worksheet->getStyle($tableRange)->applyFromArray($styleArray);

        // Auto-size columns for better readability
        foreach (range('B', 'F') as $column) {
            $worksheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Create a new Excel writer object and save the spreadsheet as an XLSX file
        $writer = new Xlsx($spreadsheet);
        $name = "Professors-$id";
        $writer->save($export_to.$name.'.xlsx');
        return $name.'.xlsx';
    }

    function export_etudiants($conn, $filter=-1){
        $id = uniqid();
        $export_to = __DIR__.'/../Exported-Files/';

        // Retrieve data from the table
        $query = "SELECT * FROM etudiants";
        if($filter != -1) $query = "SELECT * FROM etudiants WHERE codeClasse='$filter'";
        $result = mysqli_query($conn, $query);

        // Create a new Excel workbook and worksheet
        $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();

        // Set the table headers
        $headers = ['CNE', 'Numéro d\'ordre', 'Prenom', 'Nom', 'Date de naissance', 'Genre', 'Classe', 'Email'];

        // Set the table data
        $data = [];

        // fetch the data
        while ($row = mysqli_fetch_assoc($result)){
            $etd = renderEtudiant($row, $conn);
            $line = [$etd['cne'], $etd['orderNb'], $etd['prenom'], $etd['nom'], $etd['birthday'], $etd['gender'], $etd['classe'], $etd['email']];
            $data[count($data)] = $line;
        }

        // Set the starting cell for the table
        $headerStartCell = 'B3';
        $dataStartCel = 'B4';

        // Write the headers to the worksheet
        $headerRange = $worksheet->fromArray($headers, null, $headerStartCell, true);

        // Apply style to each cell of the header
        $headerStyleArray = [
            'font' => [
                'size' => 14,
            ],
            'alignment' => [
                'wrapText' => true,
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startColor' => ['argb' => 'FFA0A0A0'],
                'endColor' => ['argb' => 'FFFFFFFF'],
            ],
            'padding' => [
                'top' => 20,
                'right' => 10,
                'bottom' => 20,
                'left' => 10,
            ],
        ];
        $worksheet->getStyle('B3:I3')->applyFromArray($headerStyleArray);
        $worksheet->getRowDimension(3)->setRowHeight(30);

        // Write the data to the worksheet
        $worksheet->fromArray($data, null, $dataStartCel, true);

        // Style the table
        // Apply styles to the table
        $styleArray = [
            'borders' => [
                'outline' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ];
        $tableRange = $headerStartCell . ':' . $worksheet->getCellByColumnAndRow(count($headers)+1, count($data) + 1+2)->getColumn() . (count($data) + 1+2);
        $worksheet->getStyle($tableRange)->applyFromArray($styleArray);

        // Auto-size columns for better readability
        foreach (range('B', 'I') as $column) {
            $worksheet->getColumnDimension($column)->setAutoSize(true);
        }

        // Create a new Excel writer object and save the spreadsheet as an XLSX file
        $writer = new Xlsx($spreadsheet);
        $name = "Etudiants-$id";
        $writer->save($export_to.$name.'.xlsx');
        return $name.'.xlsx';

    }

    function export_template($who='etudiants'){
        $export_to = __DIR__.'/../Exported-Files/';

        // Create a new Excel workbook and worksheet
        $spreadsheet = new Spreadsheet();
        $worksheet = $spreadsheet->getActiveSheet();

        // Set the table headers
        $headers = ['CNE', 'Numéro d\'ordre', 'Prenom', 'Nom', 'Date de naissance', 'Genre', 'Classe', 'Email'];
        if($who == 'professors'){
            $headers = ['Prenom', 'Nom', 'Genre', 'Email', 'Telephone'];
        }

        // Set the starting cell for the table
        $headerStartCell = 'B3';

        // Write the headers to the worksheet
        $headerRange = $worksheet->fromArray($headers, null, $headerStartCell, true);

        // Apply style to each cell of the header
        $headerStyleArray = [
            'font' => [
                'size' => 14,
            ],
            'alignment' => [
                'wrapText' => true,
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startColor' => ['argb' => 'FFA0A0A0'],
                'endColor' => ['argb' => 'FFFFFFFF'],
            ],
            'padding' => [
                'top' => 20,
                'right' => 10,
                'bottom' => 20,
                'left' => 10,
            ],
        ];

        $worksheet->getRowDimension(3)->setRowHeight(30);

        if($who == 'etudiants'){
            $worksheet->getStyle('B3:I3')->applyFromArray($headerStyleArray);

            // Auto-size columns for better readability
            foreach (range('B', 'I') as $column) {
                $worksheet->getColumnDimension($column)->setAutoSize(true);
            }
        }
        else{
            $worksheet->getStyle('B3:F3')->applyFromArray($headerStyleArray);

            // Auto-size columns for better readability
            foreach (range('B', 'F') as $column) {
                $worksheet->getColumnDimension($column)->setAutoSize(true);
            }
        }

        // Create a new Excel writer object and save the spreadsheet as an XLSX file
        $writer = new Xlsx($spreadsheet);
        $name = $who == 'etudiants' ? 'Etudiants-template' : 'Professors-template';
        $writer->save($export_to.$name.'.xlsx');
        return $name.'.xlsx';
    }

function import_etudiants($file, $conn){
    $spreadsheet = IOFactory::load($file['tmp_name']);
    $worksheet = $spreadsheet->getActiveSheet();

    $query = "INSERT INTO 
                `etudiants`(`CNE`, `numOrdre`, `nomEtudiant`, `prenomEtudiant`, `dateDeNaissance`, `genre`, `codeClasse`, `email`, `password`) 
                VALUES ";

    $etudiants = [];
    foreach ($worksheet->getRowIterator() as $row) {
        $rowData = [];
        foreach ($row->getCellIterator() as $cell) {

            if ($cell->getValue() == null) continue;
            if ($cell->getValue() == 'CNE') continue;
            if ($cell->getValue() == 'Numéro d\'ordre') continue;
            if ($cell->getValue() == 'Prenom') continue;
            if ($cell->getValue() == 'Nom') continue;
            if ($cell->getValue() == 'Date de naissance') continue;
            if ($cell->getValue() == 'Genre') continue;
            if ($cell->getValue() == 'Classe') continue;
            if ($cell->getValue() == 'Email') continue;

            $rowData[] = $cell->getValue();
        }
        $rowData != [] ? $etudiants[] = $rowData : null;
    }
    foreach($etudiants as $etd){
        $cne = $etd[0].chr(rand(97, 122));
        $orderNb = $etd[1];
        $prenom = $etd[2];
        $nom = $etd[3];
        $birthday = $etd[4];
        $genre = $etd[5];
        $classe = explode('-', $etd[6]);
        $niveauClasse = $classe[0];
        $nomClasse = $classe[1];
        $email = $etd[7];
        $mdp = md5(uniqid(time()));

        $req = mysqli_query(
            $conn, 
            "SELECT codeClasse FROM classes WHERE nomClasse='$nomClasse' AND niveauClasse='$niveauClasse' LIMIT 1",
        );
        $codeClasse = mysqli_fetch_assoc($req)['codeClasse'];

        $query .= "('$cne', '$orderNb', '$nom', '$prenom', '$birthday', '$genre', '$codeClasse', '$email', '$mdp'),";
    }
    $query = substr($query, 0, strlen($query)-1);
    mysqli_query($conn, $query) or die(mysqli_error($conn));
    return true;
}

function import_professors($file, $conn){
    $spreadsheet = IOFactory::load($file['tmp_name']);
    $worksheet = $spreadsheet->getActiveSheet();

    $query = "INSERT INTO 
                `professeurs`(`codeProf`, `nomProf`, `prenomProf`, `email`, `genre`, `password`, `telephone`) 
                VALUES";

    $professors = [];
    foreach ($worksheet->getRowIterator() as $row) {
        $rowData = [];
        foreach ($row->getCellIterator() as $cell) {

            if ($cell->getValue() == null) continue;
            if ($cell->getValue() == 'Prenom') continue;
            if ($cell->getValue() == 'Nom') continue;
            if ($cell->getValue() == 'Genre') continue;
            if ($cell->getValue() == 'Email') continue;
            if ($cell->getValue() == 'Telephone') continue;

            $rowData[] = $cell->getValue();
        }
        $rowData != [] ? $professors[] = $rowData : null;
    }
    foreach($professors as $prof){
        $prenom = $prof[0];
        $nom = $prof[1];
        $genre = $prof[2];
        $email = $prof[3];
        $phone = $prof[4];
        $mdp = md5(uniqid(time()));

        $query .= "(null, '$nom', '$prenom', '$email', '$genre', '$mdp', '$phone'),";
    }
    $query = substr($query, 0, strlen($query)-1);
    mysqli_query($conn, $query) or die(mysqli_error($conn));
    return true;
}