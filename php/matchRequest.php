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


  if($requestRessource == 'matchs'){

    $data = false;

    switch($requestMethod){
        case 'GET':

            $data = getMatchOfUser($db, $_GET['userid']);

            break;
    }

  }

  if($requestRessource == 'bestplayer'){

    $data = false;

    switch($requestMethod){
        case 'GET':

            $data = getBestplayer($db, $_GET['matchid']);

            break;
    }

  }

  if($requestRessource == 'status'){

    $data = false;

    switch($requestMethod){
        case 'GET':

            $data = getStatus($db, $_GET['userid'], $_GET['matchid']);

            break;
    }

  }

  if($requestRessource == 'updatematch'){

    $data = false;

    switch($requestMethod){
        case 'PUT':
            parse_str(file_get_contents('php://input'), $_PUT);
            if(isset($_PUT['score']) && isset($_PUT['bestplayer']) && isset($_PUT['matchid'])){
                $data = updateMatch($db, $_PUT['score'], $_PUT['bestplayer'], $_PUT['matchid']); 
            }
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