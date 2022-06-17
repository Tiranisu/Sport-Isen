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
        console.log(JSON.parse(xhr.responseText));
        callback(JSON.parse(xhr.responseText));
        break;
      default:
        // httpErrors(xhr.status);
    }
  };

  // Send XML HTTP request.
  xhr.send(data);
}

function displayImage(infos){
    console.log(infos[0]['link_image']);
    if(infos[0]['link_image'] == null){
        document.getElementById("profilePicture").src="../resources/img_profil/default_user.png";
    }
    else{
        document.getElementById("profilePicture").src=infos[0]['link_image'];
    }
    
}

function addCities(infos){
    document.getElementById('city');

}

function addSports(infos){
    document.getElementById('sports');
    
}

ajaxRequest('GET', `../php/searchRequest.php/picture?id=1`, displayImage);

ajaxRequest('GET', `../php/searchRequest.php/cities`, addCities);

ajaxRequest('GET', `../php/searchRequest.php/sports`, addSports);



