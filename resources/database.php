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


function return_password($conn, $email){
    $request = 'SELECT passwd FROM users WHERE email = :email; ';
    $statement = $conn->prepare($request);
    $statement->bindParam(':email', $email);
    $statement->execute();
    $phrase_out = $statement->fetch(PDO::FETCH_ASSOC);
    return $phrase_out['passwd'];
}

function check_alreadyexist_user($conn, $email){
    try{
        $request = 'SELECT * FROM users WHERE email = :email';
        $statement = $conn->prepare($request);
        $statement->bindParam(':email', $email);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        if($result){
            return true;
        }
        else{
            return false;
        }
    }
    catch(PDOException $e){
        return false;
    }
}

function returnCityId($conn, $city){
    try{
        $request = 'SELECT id FROM address WHERE city=:city';
        $statement = $conn->prepare($request);
        $statement->bindParam(':city', $city);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        if($result == NULL){
            return false;
        }
        else{
           return $result; 
        }
        
        
    }
    catch(PDOException $e){
        return false;
    }
    
}

function create_user($conn, $firstname, $lastname, $city, $email, $password, $img=""){
    if(!check_alreadyexist_user($conn, $email)){

        if($img == ""){
            $request = 'INSERT INTO users (firstname, lastname, age, email, passwd, address_id, link_image, nb_match, fitness_id, notifications_list, access_token)
            VALUES (:firstname, :lastname, NULL, :email, :passwd, :address_id,  NULL, NULL, NULL, NULL, NULL)';

            $statement = $conn->prepare($request);
            $statement->bindParam(':address_id', $city);
            $statement->bindParam(':firstname', $firstname);
            $statement->bindParam(':lastname', $lastname);
            $statement->bindParam(':email', $email);
            $statement->bindParam(':passwd', $password);
            $statement->execute();
        }
        else{
            $request = 'INSERT INTO users (firstname, lastname, age, email, passwd, address_id, link_image, nb_match, fitness_id, notifications_list, access_token)
            VALUES (:firstname, :lastname, NULL, :email, :passwd, :address_id, :img, NULL, NULL, NULL, NULL)';

            $statement = $conn->prepare($request);
            $statement->bindParam(':address_id', $city);
            $statement->bindParam(':firstname', $firstname);
            $statement->bindParam(':lastname', $lastname);
            $statement->bindParam(':email', $email);
            $statement->bindParam(':passwd', $password);
            $statement->bindParam(':img', $img);
            $statement->execute();
        }

        
    }
    
    
}

function checkCity($conn, $city){
    try{
        $request = 'SELECT EXISTS(SELECT * FROM address WHERE city=:city) AS city_exist';

        $statement = $conn->prepare($request);
        $statement->bindParam(':city', $city);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }
    catch(PDOException $e){
        return false;
    }
}

function addCity($conn, $city){
    try{
        $request = 'INSERT INTO address (name, street, city, postal_code) VALUES (NULL, NULL, :city, NULL)';

        $statement = $conn->prepare($request);
        $statement->bindParam(':city', $city);
        $statement->execute();
    }
    catch(PDOException $e){
        return false;
    }
}

function checkConnect($db, $email, $password){
    try{
        $request = 'SELECT * FROM users WHERE email=:email AND password=:password';
        $statement = $conn->prepare($request);
        $statement->bindParam(':email', $email);
        $statement->bindParam(':password', $password);
        $statement->execute();
        $statement->fetchAll(PDO::FETCH_ASSOC);
        if($statement == NULL){
            return false;
        }
        else{
           return true; 
        }
    }
    catch(PDOException $e){
        return false;
    }
}


function getImage($conn, $id){
    try{
        $request = 'SELECT link_image FROM users WHERE id=:id';

        $statement = $conn->prepare($request);
        $statement->bindParam(':id', $id);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}




function update_user(){

}

?>