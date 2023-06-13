<?php 

include './Inc/db.inc.php';
require './assests/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$spreadsheet = IOFactory::load('./Exported-Files/Etudiants-648857929fd2b.xlsx');
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
echo "imported to the database successfully";