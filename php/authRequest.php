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

  if ($requestRessource == "register"){

    $id = array_shift($request);
    switch($requestMethod){
      case "GET":
        if(isset($_GET['mail'])){
          $data = check_alreadyexist_user($db, $_GET['mail']);
        }
        elseif(isset($_GET['passwd']) && isset($_GET['confpass'])){
          if($_GET['passwd'] == $_GET['confpass']){
            $data = true;
          }
          else{
            $data = false;
          }
        }
        
        break;
    }
  }


  header('Content-Type: application/json; charset=utf-8');
  header('Cache-control: no-store, no-cache, must-revalidate');
  header('Pragma: no-cache');
  header('HTTP/1.1 200 OK');
  echo json_encode($data);
