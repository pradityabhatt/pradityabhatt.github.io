<?php
    header("Access-Control-Allow-Origin: *");
    
    try {
        $dbh = new PDO("mysql:host=localhost;dbname=000770055;", "000770055", "19960227");
    } catch (Exception $e) {
        die("Error in database connection!!!");
    }

    $query = "SELECT * FROM CatData ORDER BY name ASC";
    $statement = $dbh->prepare($query);
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
    exit;

?>