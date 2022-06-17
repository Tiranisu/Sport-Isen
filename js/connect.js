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

function checkMail(infos){
  if(infos == true){
      document.getElementById('validmail').style.display = 'block';
      document.getElementById('unvalidmail').style.display = 'none';
  }
  else{
    document.getElementById('validmail').style.display = 'none';
    document.getElementById('unvalidmail').style.display = 'block';
  }

  if(document.getElementById('mail').value == ""){
      document.getElementById('validmail').style.display = 'none';
      document.getElementById('unvalidmail').style.display = 'none';
  }
}

function canConnect(infos){
  if(infos == false){
    document.getElementById('errorConnect').style.display = 'block';
  } else{
    document.getElementById('errorConnect').style.display = 'none';
  }
}

// check if the email is in the database
$("#mail").change(function(){
  mail = document.getElementById('mail').value;
  ajaxRequest('GET', `../php/connectRequest.php/register?email=${mail}`, checkMail);
})

$("#form").on('submit', (event) => {
  email = document.getElementById("mail").value;
  password = document.getElementById("pass").value;
  ajaxRequest('GET', `../php/connectRequest.php/register?email=${email}&password=${password}`, canConnect);
  return false; // use to not reload the page when the form is submit
});
