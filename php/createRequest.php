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


  if($requestRessource == 'create'){
    $data = false;

    switch($requestMethod){
      case 'POST':
        
        $checkSport = checkSport($db, $_POST['event_sport']);
        if(!$checkSport['sport_exists']){
            addSport($db, $_POST['event_sport']);
        }
        

        $checkAddress = checkAddress($db, $_POST['event_city'], $_POST['event_address'], $_POST['event_postalcode']);
        if(!$checkAddress['address_exists']){
            addAddress($db, $_POST['event_address'], $_POST['event_city'], $_POST['event_postalcode']);
        }


        $sportId = returnSportId($db, $_POST['event_sport']);
        $addressId = returnAddressId($db, $_POST['event_address'], $_POST['event_city'], intval($_POST['event_postalcode']));
        
        $data = createMatch($db, intval($_POST['event_orga']), $_POST['event_name'], $sportId, $addressId, intval($_POST['event_minplayers']), intval($_POST['event_maxplayers']), $_POST['event_date'], $_POST['event_duration'], intval($_POST['event_price']));
        
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