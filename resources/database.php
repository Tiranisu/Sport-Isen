<?php

/**
 * PHP version 7.4.0
 * 
 * @author Enzo Peigne <enzo.peigne@isen-ouest.yncrea.fr>
 * @author Maël Grellier Neau <mael.grelneau@gmail.com>
 * 
 */

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
    try{
        if(!check_alreadyexist_user($conn, $email)){
            $password_hash = password_hash($password, PASSWORD_BCRYPT);
            if($img == NULL){
                $request = 'INSERT INTO users (firstname, lastname, age, email, password, address_id, link_image, nb_match, fitness_id, access_token)
                VALUES (:firstname, :lastname, NULL, :email, :passwd, :address_id,  NULL, NULL, 1, NULL)';
    
                $statement = $conn->prepare($request);
                $statement->bindParam(':address_id', $city);
                $statement->bindParam(':firstname', $firstname);
                $statement->bindParam(':lastname', $lastname);
                $statement->bindParam(':email', $email);
                $statement->bindParam(':passwd', $password_hash);
                $statement->execute();
            }
            else{
                $request = 'INSERT INTO users (firstname, lastname, age, email, password, address_id, link_image, nb_match, fitness_id, access_token)
                VALUES (:firstname, :lastname, NULL, :email, :passwd, :address_id, :img, NULL, 1, NULL)';
    
                $statement = $conn->prepare($request);
                $statement->bindParam(':address_id', $city);
                $statement->bindParam(':firstname', $firstname);
                $statement->bindParam(':lastname', $lastname);
                $statement->bindParam(':email', $email);
                $statement->bindParam(':passwd', $password_hash);
                $statement->bindParam(':img', $img);
                $statement->execute();
            }   
        }
    }
    catch(PDOException $e){
        return $e;
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
        $request = 'INSERT INTO address (city) VALUES (:city)';
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
        $request = 'SELECT password FROM users WHERE email=:email';
        $statement = $conn->prepare($request);
        $statement->bindParam(':email', $email);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
        $password_hash = $result[0]['password'];
        if(password_verify($password, $password_hash)){
            return true;
        }else{
            return false;
        }
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
        $request = 'SELECT DISTINCT ON (a.postal_code) a.id, a.postal_code, a.city FROM address a, matchs m WHERE m.address_id=a.id';
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
        $request = 'SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price FROM matchs m, sports s, address a WHERE m.sport_id=s.id AND m.address_id=a.id';
        $statement = $conn->prepare($request);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function getParticipants($conn, $matchId){
    try{
        $request = 'SELECT count(*) as nb_participants FROM participant WHERE status=1 AND match_id=:matchid';

        $statement = $conn->prepare($request);
        $statement->bindParam(':matchid', $matchId);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
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
        $request = 'SELECT u.id, u.link_image, u.firstname, u.lastname, u.age, f.type FROM users u, fitness f, participant p WHERE p.user_id = u.id AND f.id = u.fitness_id AND p.status = 1 AND p.match_id = :matchid';
        $statement = $conn->prepare($request);
        $statement->bindParam(':matchid', $matchId);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
    
}

function getBestplayer($conn, $matchId){
    try{
        $request = 'SELECT u.firstname, u.lastname FROM users u, matchs m WHERE m.best_player_id=u.id AND m.id=:matchid';

        $statement = $conn->prepare($request);
        $statement->bindParam(':matchid', $matchId);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}
 

function cityFilter($conn, $cityId){
    try{
        $request = 'SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, (SELECT count(*) as nb_participants FROM participant WHERE status=1 ) FROM matchs m, sports s, address a WHERE m.sport_id=s.id AND m.address_id=a.id AND a.city = :cityname';

        $statement = $conn->prepare($request);
        $statement->bindParam(':cityname', $cityId);
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

function getCityById($conn, $userId){
    try{
        $request = 'SELECT a.city, a.postal_code FROM address a INNER JOIN users u ON u.address_id = a.id WHERE u.id = :id;';
        $statement = $conn->prepare($request);
        $statement->bindParam(':id', $userId);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
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

function getFitnessById($conn, $userId){
    try{
        $request = 'SELECT f.type FROM fitness f INNER JOIN users u ON u.fitness_id = f.id WHERE u.id = :id;';
        $statement = $conn->prepare($request);
        $statement->bindParam(':id', $userId);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
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

function returnFitnessId($conn, $name){
    try{
        $request = 'SELECT id FROM fitness WHERE type = :name';
        $statement = $conn->prepare($request);
        $statement->bindParam(':name', $name);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
        print_r($result);
        return $result['id'];
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

function getFitness($conn){
    try{
        $request = 'SELECT * FROM fitness';
        $statement = $conn->prepare($request);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function updateUser($conn, $firstname, $lastname, $email, $age, $cityId, $fitness, $accessToken, $img = NULL){
    try{
        $fitnessId = returnFitnessId($conn, $fitness);
        $request = 'UPDATE users SET firstname = :firstname, lastname = :lastname, email = :email, age = :age, address_id = :cityId, fitness_id = :fitnessId, link_image = :img WHERE access_token = :accessToken';

        $statement = $conn->prepare($request);
        $statement->bindParam(':firstname', $firstname);
        $statement->bindParam(':lastname', $lastname);
        $statement->bindParam(':email', $email);
        $statement->bindParam(':age', $age);
        $statement->bindParam(':cityId', $cityId);
        $statement->bindParam(':fitnessId', $fitnessId);
        $statement->bindParam(':img', $img);
        $statement->bindParam(':accessToken', $accessToken);
        $statement->execute(); 
        return true;
    }
    catch(PDOException $e){
        return $e;
    }         
}

function getMatchOfUser($conn, $userId){
    try{

        $request = 'SELECT m.id, m.name, s.name as sport_name, a.name as stade_name, a.street, a.city, m.nb_player_min, m.nb_player_max, m.date_time, m.duration, m.price, p.user_id, m.score, m.best_player_id FROM matchs m, sports s, address a, participant p WHERE m.sport_id=s.id AND m.address_id=a.id AND p.user_id=:userid AND m.id = p.match_id AND p.status!=0';
    
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

function getStatus($conn, $userId, $matchId){

    $orgaRequest = 'SELECT * FROM matchs WHERE organization_id=:userid AND id=:matchid';

    $orgStatement = $conn->prepare($orgaRequest);
    $orgStatement->bindParam(':userid', $userId);
    $orgStatement->bindParam(':matchid', $matchId);
    $orgStatement->execute();
    $result1 = $orgStatement->fetch(PDO::FETCH_ASSOC);

    if($result1 != NULL){
        $isOrga = true;
    }
    else{
        $isOrga = false;
    }

    $playerRequest = 'SELECT status FROM participant WHERE match_id =:matchid AND user_id=:userid';

    $playerStatement = $conn->prepare($playerRequest);
    $playerStatement->bindParam(':matchid', $matchId);
    $playerStatement->bindParam(':userid', $userId);
    $playerStatement->execute();
    $result2 = $playerStatement->fetch(PDO::FETCH_ASSOC);

    if($result2 != NULL){
        $isPlayer = true;
        $playerStatus = '';
        switch($result2['status']){
            case 0:
                $playerStatus = 'not accepted';
                break;
            case 1:
                $playerStatus = 'accepted';
                break;
            case 2:
                $playerStatus = 'waiting';
                break;
        
        }
    }
    else{
        $isPlayer = false;
        $playerStatus = 'no status';
    }

    $userStatus = array(
        'isOrga' => $isOrga,
        'isPlayer' => $isPlayer,
        'playerStatus' => $playerStatus
    );

    return $userStatus;

}

function updatePass($conn, $password, $accessToken){
    try{
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        $request = 'UPDATE users SET password = :password WHERE access_token = :accessToken';
        $statement = $conn->prepare($request);
        $statement->bindParam(':password', $password_hash);
        $statement->bindParam(':accessToken', $accessToken);
        $statement->execute(); 
        return true;
    }
    catch(PDOException $e){
        return $e;
    }       
}


function updateMatch($conn, $score, $bestplayer, $matchId){
    try{
        $request = 'UPDATE matchs SET score=:score, best_player_id=:bestplayer WHERE id=:matchid';

        $statement = $conn->prepare($request);
        $statement->bindParam(':score', $score);
        $statement->bindParam(':bestplayer', $bestplayer);
        $statement->bindParam(':matchid', $matchId);
        $statement->execute();
        return true;
        
    }
    catch(PDOException $e){
        return false;
    }
}

function returnResponseByUserId($conn, $userId){
    try{
        $request = 'SELECT match_id, status FROM participant WHERE user_id=:userid AND status != 2';
        $statement = $conn->prepare($request);
        $statement->bindParam(':userid', $userId);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);  
    }
    catch(PDOException $e){
        return $e;
    }
}


function checkUserRegister($conn, $userId, $matchId){

    try{
        $request = 'SELECT EXISTS(SELECT * FROM participant WHERE match_id=:matchid AND user_id=:userid) AS already_register';

        $statement = $conn->prepare($request);
        $statement->bindParam(':matchid', $matchId);
        $statement->bindParam(':userid', $userId);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}


function getCapacity($conn, $matchId){
    try{
        $request = 'SELECT nb_player_max-(SELECT count(*) as nb_participants FROM participant WHERE match_id=:matchid AND status=1) as capacity FROM matchs WHERE id=:matchid';

        $statement = $conn->prepare($request);
        $statement->bindParam(':matchid', $matchId);
        $statement->execute();
        return $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function getMatchByOrga($conn, $orgaId){
    try{
        $request = 'SELECT * FROM matchs WHERE organization_id=:orgaId ';

        $statement = $conn->prepare($request);
        $statement->bindParam(':orgaId', $orgaId);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return $e;
    }

}

function returnUserWaiting($conn, $matchId){
    try{
        $request = 'SELECT * FROM participant WHERE match_id=:matchId AND status = 2';

        $statement = $conn->prepare($request);
        $statement->bindParam(':matchId', $matchId);
        $statement->execute();
        return $statement->fetchALL(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return $e;
    }
}


function getRates($conn){
    try{
        $request = 'SELECT * FROM score_app';

        $statement = $conn->query($request);
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function getUserById($conn, $userId){
    try{
        $request = 'SELECT * FROM users WHERE id = :id';
        $statement = $conn->prepare($request);
        $statement->bindParam(':id', $userId);
        $statement->execute();
        return $statement->fetchALL(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function getSportById($conn, $sportId){
    try{
        $request = 'SELECT * FROM sports WHERE id = :id';
        $statement = $conn->prepare($request);
        $statement->bindParam(':id', $sportId);
        $statement->execute();
        return $statement->fetchALL(PDO::FETCH_ASSOC);
    }
    catch(PDOException $e){
        return false;
    }
}

function updatePart($conn, $id, $newStatus){
    try{
        echo $newStatus;
        echo $id;
        $request = 'UPDATE participant SET status = :newStatus WHERE id = :id';
        $statement = $conn->prepare($request);
        $statement->bindParam(':newStatus', $newStatus);
        $statement->bindParam(':id', $id);
        $statement->execute(); 
        return true;
    }
    catch(PDOException $e){
        return $e;
    }       
}

?>