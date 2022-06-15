function ajaxRequest(type, url, callback, data = null)
{
  let xhr;

  // Create XML HTTP request.
  xhr = new XMLHttpRequest();
  if (type == 'GET' && data != null)
    url += '?' + data;
  xhr.open(type, url);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // Add the onload function.
  xhr.onload = () =>
  {
    switch (xhr.status)
    {
      case 200:
      case 201:
        console.log(xhr.responseText);
        callback(JSON.parse(xhr.responseText));
        break;
      default:
        // httpErrors(xhr.status);
    }
  };

  // Send XML HTTP request.
  xhr.send(data);
}

function displayInfo(infos){

    

    if(infos == true){
        document.getElementById('validmail').style.display = 'none';
        document.getElementById('unvalidmail').style.display = 'block';
    }
    else{
        document.getElementById('validmail').style.display = 'block';
        document.getElementById('unvalidmail').style.display = 'none';
    }

    if(document.getElementById('mail').value == ""){
        document.getElementById('validmail').style.display = 'none';
        document.getElementById('unvalidmail').style.display = 'none';
    }

}

function passCheck(infos){
    if(infos == false){
        document.getElementById("passcheck").style.display = "block";
        document.getElementById("passcheck").style.color = "red";
        document.getElementById("passcheck").innerHTML = "Les mots de passe ne correspondent pas."
    }
    else{
        document.getElementById("passcheck").style.display = "none";
    }
}

//check if mails already exists
$( "#mail" ).change(function()
{
    mail = document.getElementById('mail').value;
    console.log(mail);
    ajaxRequest('GET', `../php/authRequest.php/register?mail=${mail}`, displayInfo);
});

//check if passwds are the same
$("#confpass").change(function(){
    pass = document.getElementById("pass").value;
    confpass = document.getElementById("confpass").value;
    ajaxRequest('GET', `../php/authRequest.php/register?passwd=${pass}&confpass=${confpass}`, passCheck);
})
