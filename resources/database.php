<?php
include 'constants.php';

function dbConnect(){
    $dsn = 'pgsql:dbname='.DB_NAME.';host='.DB_SERVER.';port='.DB_PORT;
    try {
        $conn = new PDO($dsn, DB_USER, DB_PASSWORD);
    } catch (PDOException $e) {
        echo 'Connexion échouée : ' . $e->getMessage();
    }
    return $conn;
}


function return_password($email){
    $request = 'SELECT passwd FROM users WHERE email = :email; ';
    $statement = $conn->prepare($request);
    $statement->bindParam(':email', $email);
    $statement->execute();
    $phrase_out = $statement->fetch(PDO::FETCH_ASSOC);
    return $phrase_out['passwd'];
}

function check_alreadyexist_user($email){
    $request = 'SELECT * FROM users WHERE email = :email';
    $statement = $this->PDO->prepare($request);
    $statement->bindParam(':email', $email);
    $statement->execute();
    $result = $statement->fetch(PDO::FETCH_ASSOC);

    if($result){
        return true;
    }
    return false;
}

function create_user($firstname, $lastname, $city, $email, $password){
    if(!check_alreadyexist_user($email)){
        $request = 'INSERT INTO users (firstname, lastname, email, passwd)
        VALUES (:firstname, :lastname, :email, :password)';

        $statement = $this->PDO->prepare($request);

        $statement->bindParam(':firstname', $firstname);
        $statement->bindParam(':lastname', $lastname);
        $statement->bindParam(':email', $email);
        $statement->bindParam(':passwd', $password);
        $statement->execute();
    }
    
    
}

function update_user(){

}

?>