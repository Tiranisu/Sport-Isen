<?php
include '../resources/database.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);
$conn = dbConnect();
?>

<form action="<?php echo $_SERVER['PHP_SELF'];?>" method="post" enctype="multipart/form-data">
<p>
Fichier <input type="file" name="fichier1"><br>
<input type="submit" value="Envoi"><br>
</p>
</form>
<?php
    move_uploaded_file($_FILES["fichier1"]["tmp_name"],"fichier1.png");

?>
