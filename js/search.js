import {getCookie, deleteCookie} from './tool.js';

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
        console.log(xhr.responseText)
        callback(JSON.parse(xhr.responseText))
        break
      default:
        // httpErrors(xhr.status);
    }
  }

  // Send XML HTTP request.
  xhr.send(data)
}

$(() => {
  console.log(getCookie('sportisen'))
  let accessToken = getCookie('sportisen')
  if(accessToken.length == 0){
    let url = window.location.href.replace(/search\.html.*/i, 'connexion.html')
    window.location.href = url
  }
  ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${accessToken}`, dynPage)
})


/**
 * taken from https://stackoverflow.com/questions/260857/changing-website-favicon-dynamically
 * @param {*} infos 
 */
function dynPage(infos){
  console.log(infos)

  var link = document.querySelector("link[rel~='icon']");
  if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
  }

  document.title = infos[0]['firstname'] + " " + infos[0]['lastname']
  if(infos[0]['link_image'] == null){
    link.href = "../resources/img_profil/default_user.png"
  }
  else{
      link.href = "infos[0]['link_image']"
  }
}

$("#disconnect").click(function(){
  deleteCookie('sportisen')
  let url = window.location.href.replace(/search\.html.*/i, 'connexion.html')
  window.location.href = url
})


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

    cardCreate(i)
    
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

function cardCreate(numCard){

  let b = document.body

  //creation container of card bloc
  let cont = document.createElement('div')
  cont.className = 'container'

  b.append(cont)


  // creation card bloc + append to container
  let matchCard = document.createElement('div')
  matchCard.id = 'matchCard'

  cont.append(matchCard)

  // creation card elements bloc
  let card = document.createElement('div')
  card.className = 'card'
  card.style = 'border-radius: 10px; background: rgba(235, 235, 235, 0.5)'

  matchCard.append(card)

  //creation title bloc
  let cardTitleBloc = document.createElement('div')
  cardTitleBloc.className = 'container-fluid'

  card.append(cardTitleBloc)

  //first row property (title)
  let row1 = document.createElement('div')
  row1.className = 'row'

  cardTitleBloc.append(row1)

  //title properties
  let titleGroup = document.createElement('div')
  titleGroup.className = 'col-md-12'
  titleGroup.style = 'background-color: #c9c9c9; height: auto; border-radius: 10px;'

  row1.append(titleGroup)

  //create match title row
  let matchTitle = document.createElement('h3')
  matchTitle.id = 'matchTitle' + numCard

  //create match sport row
  let matchSport = document.createElement('h6')
  matchSport.id = 'matchSport' + numCard

  titleGroup.append(matchTitle)
  titleGroup.append(matchSport)


  let br = document.createElement('br')
  card.append(br)

  //row 2 properties (description)
  let row2 = document.createElement('div')
  row2.className = 'row'
  row2.style = 'margin-left: 7em;'

  card.append(row2)


  //first col of description
  let col1 = document.createElement('div')
  col1.className = 'col-lg-3 gy-2'
  
  row2.append(col1)


  //first list of description
  let list1 = document.createElement('ul')
  col1.append(list1)

  //create list1 elems

  //hour item
  let hourItem = document.createElement('li')
  hourItem.className = 'align-items-center'
  hourItem.id = 'hour' + numCard
  hourItem.style = 'padding: 10px'
  hourItem.textContent = 'Heure: '

  //city item
  let cityItem = document.createElement('li')
  cityItem.className = 'align-items-center'
  cityItem.id = 'matchcity' + numCard
  cityItem.style = 'padding: 10px'
  cityItem.textContent = 'Ville: '

  //address item
  let addressItem = document.createElement('li')
  addressItem.className = 'align-items-center'
  addressItem.id = 'address' + numCard
  addressItem.style = 'padding: 10px'
  addressItem.textContent = 'Adresse: '

  list1.append(hourItem)
  list1.append(cityItem)
  list1.append(addressItem)


  //second col of description
  let col2 = document.createElement('div')
  col2.className = 'col-lg-3 gy-2'
  col2.style = 'margin-left: 10em;'

  row2.append(col2)


  //second list of description
  let list2 = document.createElement('ul')
  
  col2.append(list2)

  //create list2 elems

  //maxplayers item
  let maxPlayersItem = document.createElement('li')
  maxPlayersItem.className = 'align-items-center'
  maxPlayersItem.id = 'maxplayers' + numCard
  maxPlayersItem.style = 'padding: 10px'
  maxPlayersItem.textContent = 'Joueurs max: '

  //matchplayers item
  let matchPlayers = document.createElement('li')
  matchPlayers.className = 'align-items-center'
  matchPlayers.id = 'matchplayers' + numCard
  matchPlayers.style = 'padding: 10px'
  matchPlayers.textContent = 'Joueurs inscrits: '

  list2.append(maxPlayersItem)
  list2.append(matchPlayers)


  //create button bloc
  let blocBut = document.createElement('div')
  blocBut.className = 'col-lg-3'
  blocBut.style = 'margin-left: 7em; margin-top: 6.5em;'

  row2.append(blocBut)

  //create details button
  let but = document.createElement('button')
  but.className = 'btn'
  but.id = 'detailBut' + numCard
  but.style = 'background: rgba(0, 123, 12, 0.65);'
  but.onclick = ''
  but.textContent = 'Voir détail'

  blocBut.append(but)

  let jumpCard = document.createElement('br')
  b.append(jumpCard)
}