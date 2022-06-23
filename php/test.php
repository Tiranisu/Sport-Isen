<?php
include '../resources/database.php';
ini_set('display_errors', 1);
error_reporting(E_ALL);
$conn = dbConnect();
// if(check_alreadyexist_user($conn, "mc@test.fr")){
//     echo 'exists';
// }
// else{
//     echo 'nope';
// }
?>

<form action="<?php echo $_SERVER['PHP_SELF'];?>" method="post" enctype="multipart/form-data">
<p>
Fichier <input type="file" name="fichier1"><br>
<input type="submit" value="Envoi"><br>
</p>
</form>
<?php
    move_uploaded_file($_FILES["fichier1"]["tmp_name"],"../resources/library/backgroundIndex.jpg");


    // $a = '123456';
    // echo password_hash($a, PASSWORD_BCRYPT);

?>

