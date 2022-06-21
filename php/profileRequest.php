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
    if ($requestRessource == "accessToken"){
      if(isset($_GET['accessToken'])){
        $data = getUser($db, $_GET['accessToken']);
      } 
    }

    if ($requestRessource == "picture"){
      if(isset($_GET['id'])){
        $data = getImage($db, $_GET['id']);
      }
    }
    
    if ($requestRessource == "city"){
      if(isset($_GET['id'])){
        $data = getCityById($db, $_GET['id']);
      }
    }

    if ($requestRessource == "fitness"){
      $data = getFitness($db);
    }

    if ($requestRessource == "fitnessUser"){
      if(isset($_GET['id'])){
        $data = getFitnessById($db, $_GET['id']);
      }
    }

    if ($requestRessource == "fitness"){
      if(isset($_GET['id'])){
        $data = getFitnessById($db, $_GET['id']);
      }
    }

    // if ($requestRessource == "updateUser"){
    //   $data = 'done';
    //   $checkCities = checkCity($db, $_GET['city']);
    //   if(!$checkCity['city_exist']){
    //     addCity($db, $_GET['city']);
    //   }
    //   $addressIds = returnCityId($db, $_GET['city']);

    //   if(isset($_GET['profilePicture'])){
    //     updateUser($db,$_GET['firstname'],$_GET['lastname'],$_GET['email'],$_GET['password'],$_GET['age'], $addressIds['id'], $_GET['fitness'], $_GET['accessToken'], $_GET['profilePicture']);
    //   }else{
    //     updateUser($db,$_GET['firstname'],$_GET['lastname'],$_GET['email'],$_GET['password'],$_GET['age'], $addressIds['id'], $_GET['fitness'], $_GET['accessToken']);
    //   }
    //   $data = 'done!';
  

  break;

  case 'PUT':
    if ($requestRessource == "updateUser"){
      parse_str(file_get_contents('php://input'), $_PUT);
      $checkCities = checkCity($db, $_PUT['city']);
      foreach($checkCities as $checkCity){
        if(!$checkCity['city_exist']){
          addCity($db, $_PUT['city']);
        }
      }
      
      $addressIds = returnCityId($db, $_PUT['city']);
      foreach($addressIds as $addressId){
        if(isset($_PUT['profilePicture'])){
          $data = updateUser($db, $_PUT['firstname'], $_PUT['lastname'], $_PUT['email'], $_PUT['password'], intval($_PUT['age']), $addressId['id'], $_PUT['fitness'], $_PUT['accessToken'], $_PUT['profilePicture']);
        }else{
          $data = updateUser($db, $_PUT['firstname'], $_PUT['lastname'], $_PUT['email'], $_PUT['password'], intval($_PUT['age']), $addressId['id'], $_PUT['fitness'], $_PUT['accessToken']);
        }
      }
      echo "end";
    }


    // if ($requestRessource == "updateUser2"){
    //   parse_str(file_get_contents('php://input'), $_PUT);
    //   // echo $_PUT['age'];
    //   $data = update_user($db, intval($_PUT['age']),  $_PUT['accessToken']);
    //   // die();
    // }

  break;
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