<?php
//   require_once('../resources/database.php');
//   // Enable all warnings and errors.
//   ini_set('display_errors', 1);
//   error_reporting(E_ALL);
          
//   // Database connection.
//   $db = dbConnect();

?>

<!DOCTYPE HTML>
<html lang='fr'>
  <head>
    <meta charset='utf-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title> Inscription </title>
    <link href="../styles/auth.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  </head>
  <body>
    <!-- menu bootstrap -->
    <nav class="navbar navbar-expand-md navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand mb-0 h1" href="#">
                <p>Sport'Isen</p>
            </a>
        </div>
    </nav>

    <br>
    <div id="form">
      <p id="registertext">Inscription</p>
      <form action="connexion.php" method="post" >
        <p><input id="text" type="text" name="nom" placeholder= "Nom*" required></p>
        <p><input id="text" type="text" name="prenom" placeholder= "Prénom*" required></p>
        <p><input id="text" type="text" name="city" placeholder= "Ville*" required></p>
        <p><input id="text" type="email" name="mail" placeholder= "E-mail*" required></p>
        <p class="validmail" style="display: block; color: #13D802;"><img src="../resources/library/approved mail.png" style="padding-bottom: 5px;" ></img> Adresse mail valide! </p>
        <p class="unvalidmail" style="display: none; color: #FF0000;"><img src="../resources/library/cancel mail.png" style="padding-bottom: 5px;"></img> Vous avez déjà un compte! </p>
        <p><input id="text" type="password" name="passwd" placeholder= "Mot de passe (6 caractères minimum)" required minlength="6"></p>
        <p><input id="text" type="password" name="confpasswd" placeholder= "Confirmation mot de passe" required></p>
        <p>
            <img src="../resources/library/upload.png" style="padding-bottom: 5px;"></img> Choisir une image
            <input type="file" id="selectedFile" name="image" style="color:transparent;" onchange="this.style.color = 'black'; accept="image/*"/>
            <!-- <input type="button" value="Browse..." onclick="document.getElementById('selectedFile').click(); document.getElementById('file').innerHTML = document.getElementById('selectedFile').title;" /> -->
            <!-- <p id="file"></p> -->
        </p>
        <input type="submit" id="register" name="register" value="S'inscrire">
      </form>
    </div>
</body>
</html>