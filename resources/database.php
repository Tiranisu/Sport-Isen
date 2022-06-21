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
    $request = 'SELECT password FROM users WHERE email = :email; ';
    $statement = $conn->prepare($request);
    $statement->bindParam(':email', $email);
    $statement->execute();
    $phrase_out = $statement->fetch(PDO::FETCH_ASSOC);
    return $phrase_out['password'];
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

function create_user($conn, $firstname, $lastname, $city, $email, $password, $img = NULL){
    if(!check_alreadyexist_user($conn, $email)){

        if($img == NULL){
            $request = 'INSERT INTO users (firstname, lastname, age, email, password, address_id, link_image, nb_match, fitness_id, access_token)
            VALUES (:firstname, :lastname, NULL, :email, :passwd, :address_id,  NULL, NULL, NULL, NULL)';

            $statement = $conn->prepare($request);
            $statement->bindParam(':address_id', $city);
            $statement->bindParam(':firstname', $firstname);
            $statement->bindParam(':lastname', $lastname);
            $statement->bindParam(':email', $email);
            $statement->bindParam(':passwd', $password);
            $statement->execute();
        }
        else{
            $request = 'INSERT INTO users (firstname, lastname, age, email, password, address_id, link_image, nb_match, fitness_id, access_token)
            VALUES (:firstname, :lastname, NULL, :email, :passwd, :address_id, :img, NULL, NULL, NULL)';

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
        return $statement->fetchALl(PDO::FETCH_ASSOC);

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

function getAccessToken($conn, $email){
    $access_token = hash('sha256', $email . time());
    $request = 'UPDATE users SET access_token = :access_token WHERE email = :email';
    $statement = $conn->prepare($request);
    $statement->bindParam(':email', $email);
    $statement->bindParam(':access_token', $access_token);
    $statement->execute();

    return $access_token;
}

function checkConnect($conn, $email, $password){
    try{
        $request = 'SELECT EXISTS(SELECT * FROM users WHERE email=:email AND password=:password) AS user_exist';
        $statement = $conn->prepare($request);
        $statement->bindParam(':email', $email);
        $statement->bindParam(':password', $password);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function getUser($conn, $accessToken){
    try{
        $request = 'SELECT * FROM users WHERE access_token=:accessToken';
        $statement = $conn->prepare($request);
        $statement->bindParam(':accessToken', $accessToken);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
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

function getSports($conn){
    try{

        $request = 'SELECT * FROM sports';
        $statement = $conn->prepare($request);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);

    }
    catch(PDOException $e){
        return false;
    }
}

function getCities($conn){
    try{
        $request = 'SELECT a.id, a.postal_code, a.city FROM address a, matchs m WHERE m.address_id = a.id';
        $statement = $conn->prepare($request);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}


function getMatchs($conn){
    try{
        $request = 'SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, (SELECT count(*) as nb_participants FROM participant WHERE status=1 ) FROM matchs m, sports s, address a WHERE m.sport_id=s.id AND m.address_id=a.id';
        $statement = $conn->prepare($request);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function getMatchsFromId($conn, $matchid){
    try{
        $request = 'SELECT m.id, m.name, m.organization_id, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, (SELECT count(*) as nb_participants FROM participant WHERE status=1 AND match_id=:matchid ) FROM matchs m, sports s, address a WHERE m.sport_id=s.id AND m.address_id=a.id AND m.id = :matchid';
        $statement = $conn->prepare($request);
        $statement->bindParam(':matchid', $matchid);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function getPlayers($conn, $matchId){
    try{
        $request = 'SELECT u.link_image, u.firstname, u.lastname, u.age, f.type FROM users u, fitness f, participant p WHERE p.user_id = u.id AND f.id = u.fitness_id AND p.status = 1 AND p.match_id = :matchid';
        $statement = $conn->prepare($request);
        $statement->bindParam(':matchid', $matchId);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
    
}
 

function cityFilter($conn, $cityId){
    try{
        $request = 'SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, (SELECT count(*) as nb_participants FROM participant WHERE status=1 ) FROM matchs m, sports s, address a WHERE m.sport_id=s.id AND m.address_id=a.id AND address_id = :id';

        $statement = $conn->prepare($request);
        $statement->bindParam(':id', $cityId);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        if($result){
            return $result;
        }
        else{
            return false;
        }
    }
    catch(PDOException $e){
        return false;
    }
}

function sportFilter($conn, $sportId){
    try{
        $request = 'SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, (SELECT count(*) as nb_participants FROM participant WHERE status=1 ) FROM matchs m, sports s, address a WHERE m.sport_id=s.id AND m.address_id=a.id AND sport_id = :id';

        $statement = $conn->prepare($request);
        $statement->bindParam(':id', $sportId);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        if($result){
            return $result;
        }
        else{
            return false;
        }
    }
    catch(PDOException $e){
        return false;
    }
}

function timeFilter($conn, $time){

    $actualDate = date('Y-m-d H:i');
    $timeDiff = date('Y-m-d H:i', strtotime($time, strtotime($actualDate)));

    try{
        $request = 'SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, (SELECT count(*) as nb_participants FROM participant WHERE status=1 ) FROM matchs m, sports s, address a WHERE m.sport_id=s.id AND m.address_id=a.id AND date_time <= :time';

        $statement = $conn->prepare($request);
        $statement->bindParam(':time', $timeDiff);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        if($result){
            return $result;
        }
        else{
            return false;
        }
    }
    catch(PDOException $e){
        return false;
    }
}

function capacityFilter($conn, $capacity){

    try{
        $request = 'SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, (SELECT count(*) as nb_participants FROM participant WHERE status=1 ) FROM matchs m, sports s, address a WHERE m.sport_id=s.id AND m.address_id=a.id AND nb_player_max-(SELECT count(*) as nb_participants FROM participant WHERE status=1) ';

        if($capacity == 'full'){
            $request .= '= 0';
        }
        else{
            $request .= '> 0';
        }
        $statement = $conn->prepare($request);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        if($result){
            return $result;
        }
        else{
            return false;
        }
    }
    catch(PDOException $e){
        return false;
    }
}

function getOrganizator($conn, $orgId){
    try{
        $request = 'SELECT firstname, lastname FROM users WHERE id = :orgid';

        $statement = $conn->prepare($request);
        $statement->bindParam(':orgid', $orgId);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }

    

}


function registerMatch($conn, $matchId, $userId){
    try{
        if(!checkRegister($conn, $matchId, $userId)){
            $request = 'INSERT INTO participant(match_id, user_id, status) VALUES (:matchid, :userid, 2)';
            $statement = $conn->prepare($request);
            $statement->bindParam(':matchid', $matchId);
            $statement->bindParam(':userid', $userId);
            $statement->execute();
            return true;
        }
        
    }
    catch(PDOException $e){
        return false;
    }
    
}

function checkRegister($conn, $matchId, $userId){
    $request = 'SELECT * FROM participant WHERE match_id=:matchid AND user_id=:userid';

    $statement = $conn->prepare($request);
    $statement->bindParam(':matchid', $matchId);
    $statement->bindParam(':userid', $userId);
    $statement->execute();
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    if($result){
        return true;
    }
    else{
        return false;   
    }
}

function getRateOfUser($conn, $userId){
    try{
        $request = 'SELECT * FROM score_app WHERE user_id=:userid';

        $statement = $conn->prepare($request);
        $statement->bindParam(':userid', $userId);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        if($result){
            return $result;
        }
        else{
            return false;
        }
    }
    catch(PDOException $e){
        return false;
    }
}


function rateApp($conn, $userId, $rate){
    try{
        if(!getRateOfUser($conn, $userId)){
            $request = 'INSERT INTO score_app(user_id, score) VALUES (:userid, :rate)';
        }
        else{
            $request = 'UPDATE score_app SET score=:rate WHERE user_id=:userid';
        }
        $statement = $conn->prepare($request);
        $statement->bindParam(':rate', $rate);
        $statement->bindParam(':userid', $userId);
        $statement->execute();
        return true;
    }
    catch(PDOException $e){
        return false;
    }
}



function checkSport($conn, $sport){
    try{
        $request = 'SELECT EXISTS(SELECT * FROM sports WHERE name=:sport) AS sport_exists';

        $statement = $conn->prepare($request);
        $statement->bindParam(':sport', $sport);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function addSport($conn, $sport){

    try{
        $request = 'INSERT INTO sports(name) VALUES (:sport)';

        $statement = $conn->prepare($request);
        $statement->bindParam(':sport', $sport);
        $statement->execute();
        return true;
    }
    catch(PDOException $e){
        return false;
    }

}

function returnSportId($conn, $sport){
    try{
        $request = 'SELECT id FROM sports WHERE name=:sport';

        $statement = $conn->prepare($request);
        $statement->bindParam(':sport', $sport);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}


function checkAddress($conn, $city, $address, $postalcode){
    try{
        $request = 'SELECT EXISTS(SELECT * FROM address WHERE city=:city AND street=:street AND postal_code=:postalcode) AS address_exists';

        $statement = $conn->prepare($request);
        $statement->bindParam(':city', $city);
        $statement->bindParam(':street', $address);
        $statement->bindParam(':postalcode', $postalcode);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);

    }
    catch(PDOException $e){
        return false;
    }
}

function addAddress($conn, $address, $city, $postalcode){
    try{
        $request = 'INSERT INTO address(name,street,city,postal_code) VALUES (NULL, :street, :city, :postalcode)';

        $statement = $conn->prepare($request);
        $statement->bindParam(':street', $address);
        $statement->bindParam(':city', $city);
        $statement->bindParam(':postalcode', $postalcode);
        $statement->execute();
        return true;
    }
    catch(PDOException $e){
        return false;
    }
}

function returnAddressId($conn, $address, $city, $postalcode){
    try{
        $request = 'SELECT id FROM address WHERE street=:street AND city=:city AND postal_code=:postalcode';

        $statement = $conn->prepare($request);
        $statement->bindParam(':street', $address);
        $statement->bindParam(':city', $city);
        $statement->bindParam(':postalcode', $postalcode);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}


function createMatch($conn, $orgId, $name, $sportId, $addressId, $minplayers, $maxplayers, $date, $duration, $price){

    try{
        $request = 'INSERT INTO matchs(name, score, organization_id, sport_id, address_id, nb_player_min, nb_player_max, date_time, duration, price, best_player_id) VALUES(:matchname, NULL, :orgid, :sportid, :addressid, :minplayers, :maxplayers, :eventdate, :duration, :price, NULL)';

        $statement = $conn->prepare($request);
        $statement->bindParam(':matchname', $name);
        $statement->bindParam(':orgid', $orgId);
        $statement->bindParam(':sportid', $sportId);
        $statement->bindParam(':addressid', $addressId);
        $statement->bindParam(':minplayers', $minplayers);
        $statement->bindParam(':maxplayers', $maxplayers);
        $statement->bindParam(':eventdate', $date);
        $statement->bindParam(':duration', $duration);
        $statement->bindParam(':price', $price);
        $statement->execute();
        return true;
        
    }
    catch(PDOException $e){
        return false;
    }


}


function update_user(){

}

?>