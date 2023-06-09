<?php 
    require realpath(__DIR__.'/../assests/vendor/autoload.php');
    use Dotenv\Dotenv;

    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $host = $_ENV["DATABASE_HOST"];
    $username = $_ENV['DATABASE_USERNAME'];
    $password = $_ENV['DATABASE_PASSWORD'];
    $database = $_ENV['DATABASE_NAME'];
    
    $conn = mysqli_connect($host, $username, $password, $database) or die("Couldn't connect to the database");