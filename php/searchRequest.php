<?php

require_once('../resources/database.php');

  // Enable all warnings and errors.
  ini_set('display_errors', 1);
  error_reporting(E_ALL);

  // Database connexion.
  $db = dbConnect();

  // Check the request.
  $requestMethod = $_SERVER['REQUEST_METHOD'];
  $request = substr($_SERVER['PATH_INFO'], 1);
  $request = explode('/', $request);
  $requestRessource = array_shift($request);

  if ($requestRessource == "user"){
    switch($requestMethod){
      case 'GET':
        if(isset($_GET['accessToken'])){
          $data = getUser($db, $_GET['accessToken']);
          // $data = array(
          //   'data' => $user
          // );
        }
        break;
    }
  }

  if ($requestRessource == "picture"){

    $data = false;

    switch($requestMethod){
        case 'GET':
            if(isset($_GET['id'])){
                $data = getImage($db, $_GET['id']);
            }
            
            break;
        }
  }

  if($requestRessource == 'cities'){
    $data = false;

    switch($requestMethod){
        case "GET":
          $data = getCities($db);
          break;
    }
  }

  if($requestRessource == 'sports'){
    $data = false;

    switch($requestMethod){
        case "GET":
          $data = getSports($db);
          break;
    }
  }

  if($requestRessource == 'matchs'){
    $data = false;

    switch($requestMethod){
      case 'GET':
        if(isset($_GET['cityid'])){
          $data = cityFilter($db, $_GET['cityid']);
        }
        elseif(isset($_GET['sportid'])){
          $data = sportFilter($db,$_GET['sportid']);
        }
        elseif(isset($_GET['time'])){
          $data = timeFilter($db,$_GET['time']);
        }
        elseif(isset($_GET['capacity'])){
          $data = capacityFilter($db, $_GET['capacity']);
        }
        elseif(isset($_GET['matchid'])){
          $data = getMatchsFromId($db, $_GET['matchid']);
        }
        else{
          $data = getMatchs($db);
        }
       
        break;
    }
  }

  if($requestRessource == 'participants'){
    $data = false;

    switch($requestMethod){
      case 'GET':
        if(isset($_GET['matchid'])){
          $data = getParticipants($db, $_GET['matchid']);
        }
        
        break;
    }
  }

  if($requestRessource == 'capacity'){
    $data = false;

    switch($requestMethod){
      case 'GET':
        if(isset($_GET['matchid'])){
          $data = getCapacity($db, $_GET['matchid']);
        }
        
        break;
    }
  }

  if($requestRessource == 'isregister'){
    $data = false;

    switch($requestMethod){
      case 'GET':
        if(isset($_GET['matchid']) && isset($_GET['userid'])){
          $data = checkUserRegister($db, $_GET['userid'], $_GET['matchid']);
        }
        
        break;
    }
  }


  if($requestRessource == 'orga'){
    $data = false;
    switch($requestMethod){
      case "GET":
        if(isset($_GET['orgid'])){
          $data = getOrganizator($db, $_GET['orgid']);
        }
        break;
        
    }
  }

  if($requestRessource == 'players'){
    $data = false;
    switch($requestMethod){
      case "GET":
        if(isset($_GET['matchid'])){
          $data = getPlayers($db, $_GET['matchid']);
        }
        break;
        
    }
  }

  if($requestRessource == 'register'){
    $data = false;

    switch($requestMethod){
      case 'POST':
        $result = registerMatch($db, $_POST['matchid'], $_POST['userid']);
        if($result){
          $data = true;
        }
        break;
    }
  }

  if($requestRessource == 'rate'){
    $data = false;
    
    switch($requestMethod){
      case 'GET':
        if(isset($_GET['userid'])){
          $data = getRateOfUser($db, $_GET['userid']);
        }
        break;


      case 'PUT':
        
        parse_str(file_get_contents('php://input'), $_PUT);
        if(isset($_PUT['userid']) && isset($_PUT['rate'])){
          echo 'test';
          $result = rateApp($db, $_PUT['userid'], $_PUT['rate']);
          if($result){
            $data = true;
          }
        }
        break;        
    }
  }


  header('Content-Type: application/json; charset=utf-8');
  header('Cache-control: no-store, no-cache, must-revalidate');
  header('Pragma: no-cache');
  if($requestMethod == 'POST'){
    header('HTTP/1.1 200 Created');
  }else{
    header('HTTP/1.1 200 OK');
  }
  echo json_encode($data);