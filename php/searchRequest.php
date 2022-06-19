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
        $data = getMatchs($db);
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