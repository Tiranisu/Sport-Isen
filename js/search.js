function ajaxRequest(type, url, callback, data = null)
{
  let xhr

  // Create XML HTTP request.
  xhr = new XMLHttpRequest()
  if (type == 'GET' && data != null)
    url += '?' + data
  xhr.open(type, url)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')

  // Add the onload function.
  xhr.onload = () =>
  {
    switch (xhr.status)
    {
      case 200:
      case 201:
        console.log(JSON.parse(xhr.responseText))
        callback(JSON.parse(xhr.responseText))
        break
      default:
        // httpErrors(xhr.status);
    }
  }

  // Send XML HTTP request.
  xhr.send(data)
}

//------------------------------------------------------------------------------
//---------------------------Ajax Search Requests ------------------------------
//------------------------------------------------------------------------------

//display profile image

ajaxRequest('GET', `../php/searchRequest.php/picture?id=1`, displayImage)

function displayImage(infos){
    console.log(infos[0]['link_image'])
    if(infos[0]['link_image'] == null){
        document.getElementById("profilePicture").src="../resources/img_profil/default_user.png"
    }
    else{
        document.getElementById("profilePicture").src=infos[0]['link_image']
    }
    
}

//add cities with matches into select

ajaxRequest('GET', `../php/searchRequest.php/cities`, addCities)

function addCities(infos){
    var selCities = document.getElementById('city')
    for(let i = 0; i < infos.length; i++){
      var option = document.createElement("option")
      option.value = infos[i]['id']
      option.text = infos[i]['city']
      selCities.add(option)
    }
    
}

//add sports into select

ajaxRequest('GET', `../php/searchRequest.php/sports`, addSports)



function addSports(infos){
    var selSports = document.getElementById('sport')
    for(let i = 0; i < infos.length; i++){
      var option = document.createElement("option")
      option.value = infos[i]['id']
      option.text = infos[i]['name']
      selSports.add(option)
    }
    
}


//display Sports

ajaxRequest('GET', '../php/searchRequest.php/matchs', displaySports)



function displaySports(infos){

  const currentDate = new Date(Date.now())

  for(let i=0; i<infos.length; i++){
    const date = new Date(infos[i]['date_time'])
    

    console.log(date)
    console.log(currentDate)

    if(date > Date.now()){
      document.getElementById('matchTitle'+i).innerHTML = infos[i]['name'] + " | " + days[0][date.getDay()] + ' ' + date.getDate() + ' ' + months[0][date.getMonth()] + ' ' + date.getFullYear()
      document.getElementById('matchSport'+i).innerHTML = infos[i]['sport_name']
      document.getElementById('hour'+i).innerHTML += date.getHours() + ':'

      //display minutes format :mm
      if(date.getMinutes()<10){
        document.getElementById('hour'+i).innerHTML += '0' + date.getMinutes()
      }
      else{
        document.getElementById('hour'+i).innerHTML += date.getMinutes()
      }



      document.getElementById('matchcity'+i).innerHTML += infos[i]['city']
      document.getElementById('address'+i).innerHTML += infos[i]['stade_name'] + ',<br> ' + infos[i]['street']
      document.getElementById('maxplayers'+i).innerHTML += infos[i]['nb_player_max']
      document.getElementById('matchplayers'+i).innerHTML += infos[i]['nb_participants']
    }
  }

  

  

}


//------------------------------------------------------------------------------
//--------------------------- Dates --------------------------------------------
//------------------------------------------------------------------------------


let months = Array({
  '0' : 'Janvier',
  '1' : 'Février',
  '2' : 'Mars',
  '3' : 'Avril',
  '4' : 'Mai',
  '5' : 'Juin',
  '6' : 'Juillet',
  '7' : 'Août',
  '8' : 'Septembre',
  '9' : 'Octobre',
  '10' : 'Novembre',
  '11' : 'Décembre'
})

let days = Array({
  '0' : 'Lundi',
  '1' : 'Mardi',
  '2' : 'Mercredi',
  '3' : 'Jeudi',
  '4' : 'Vendredi',
  '5' : 'Samedi',
  '6' : 'Dimanche'
})



//------------------------------------------------------------------------------
//--------------------------- Card Creation ------------------------------------
//------------------------------------------------------------------------------


function cardCreate(){
  //https://www.pierre-giraud.com/javascript-apprendre-coder-cours/dom-ajout-modification-suppression/#:~:text=Pour%20cr%C3%A9er%20un%20nouvel%20%C3%A9l%C3%A9ment,que%20l'on%20souhaite%20cr%C3%A9er.
}