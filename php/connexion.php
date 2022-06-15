<?php
  require_once('../resources/database.php');
  // Enable all warnings and errors.
  ini_set('display_errors', 1);
  error_reporting(E_ALL);
          
  // Database connection.
  $db = dbConnect();
?>