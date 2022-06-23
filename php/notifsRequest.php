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

switch($requestMethod){
    case 'GET':
        if($requestRessource == "request"){
            if(isset($_GET['userId'])){
                $data = returnResponseByUserId($db, $_GET['userId']);
            }
        }
        if($requestRessource == "matchs"){
            if(isset($_GET['matchId'])){
                $data = getMatchsFromId($db, $_GET['matchId']);
            }

        }
        if($requestRessource == "orga"){
            if(isset($_GET['userId'])){
                $data = getMatchByOrga($db, $_GET['userId']);
            }
        }
        if($requestRessource == "userWaiting"){
            if(isset($_GET['matchId'])){
                $data = returnUserWaiting($db, $_GET['matchId']);
            }
        }
        if($requestRessource == "infoUser"){
            if(isset($_GET['userId'])){
                $data = getUserById($db, $_GET['userId']);
            }
        }
        if($requestRessource == "fitness"){
            if(isset($_GET['userId'])){
                $data = getFitnessById($db, $_GET['userId']);
            }
        }
        if($requestRessource == "sport"){
            if(isset($_GET['sportId'])){
                $data = getSportById($db, $_GET['sportId']);
            }
        }
    break;
    case 'PUT':
        if ($requestRessource == "updateStatus"){
          parse_str(file_get_contents('php://input'), $_PUT);
          $data = updatePart($db, $_PUT['id'], $_PUT['newStatus']);
        }
    break;
}

header('Content-Type: application/json; charset=utf-8');
header('Cache-control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('HTTP/1.1 200 OK');
echo json_encode($data);
  