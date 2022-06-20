import {ajaxRequest, getCookie, disconnect, dynPage, displayImage} from './tool.js';

$(() => {
  // console.log(getCookie('sportisen'))
  let accessToken = getCookie('sportisen')
  if(accessToken.length == 0){
    let url = window.location.href.replace(/search\.html.*/i, 'connexion.html')
    window.location.href = url
  }
  ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${accessToken}`, distribution)
})

$("#disconnect").click(function(){
  disconnect()
})

/**
 * Use to distribute information across function or ajaxrequest
 * @param infos contain all the information about the user 
 */
function distribution(infos){
  // display user name & profil picture
  dynPage(infos)

  //display profile image in nav bar
  ajaxRequest('GET', `../php/searchRequest.php/picture?id=${infos[0]['id']}`, displayImage)
}

//------------------------------------------------------------------------------
//---------------------------Ajax Search Requests ------------------------------
//------------------------------------------------------------------------------


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

let noFilters = true

let area = document.getElementById('matchsArea')

//no filters active
if(noFilters){
  area.innerHTML = ""
  ajaxRequest('GET', '../php/searchRequest.php/matchs', displaySports)
}

//city filter active
$("#city").change(function(){
  
  if(($("#city")).val() != 'default'){
    noFilters = false;
    area.innerHTML = ""
    ajaxRequest('GET',  `../php/searchRequest.php/matchs?cityid=${($("#city")).val()}`, displaySports)
    document.getElementById('sport').value = 'default'
    document.getElementById('period').value = 'default'
    document.getElementById('capacity').value = 'default'
  }
  else{
    noFilters = true;
  }
})

//sport filter active
$("#sport").change(function(){
  
  if(($("#sport")).val() != 'default'){
    noFilters = false;
    area.innerHTML = ""
    ajaxRequest('GET',  `../php/searchRequest.php/matchs?sportid=${($("#sport")).val()}`, displaySports)
    document.getElementById('city').value = 'default'
    document.getElementById('period').value = 'default'
    document.getElementById('capacity').value = 'default'
  }
  else{
    noFilters = true;
  }
})

//time filter active
$("#period").change(function(){
  
  if(($("#period")).val() != 'default'){
    noFilters = false;
    area.innerHTML = ""
    ajaxRequest('GET',  `../php/searchRequest.php/matchs?time=${($("#period")).val()}`, displaySports)
    document.getElementById('city').value = 'default'
    document.getElementById('sport').value = 'default'
    document.getElementById('capacity').value = 'default'
  }
  else{
    noFilters = true;
  }
})

//capacity filter active
$("#capacity").change(function(){
  
  if(($("#capacity")).val() != 'default'){
    noFilters = false;
    area.innerHTML = ""
    ajaxRequest('GET',  `../php/searchRequest.php/matchs?capacity=${($("#capacity")).val()}`, displaySports)
    document.getElementById('city').value = 'default'
    document.getElementById('sport').value = 'default'
    document.getElementById('period').value = 'default'
  }
  else{
    noFilters = true;
  }
})

//delete filters
$('reset').on('click', () => {
  noFilters = true
  document.getElementById('city').value = 'default'
  document.getElementById('sport').value = 'default'
  document.getElementById('period').value = 'default'
  document.getElementById('capacity').value = 'default'
})

//display matchs card
function displaySports(infos){

  const currentDate = new Date(Date.now())

  for(let i=0; i<infos.length; i++){
    const date = new Date(infos[i]['date_time'])

    console.log(infos[i])
    const matchId = infos[i]['id']
    // console.log(infos[i]['id'])

    cardCreate(matchId)
    
    console.log(date)
    console.log(currentDate)

    if(date > Date.now()){
      document.getElementById('matchTitle'+matchId).innerHTML = infos[i]['name'] + " | " + days[0][date.getDay()] + ' ' + date.getDate() + ' ' + months[0][date.getMonth()] + ' ' + date.getFullYear()
      document.getElementById('matchSport'+matchId).innerHTML = infos[i]['sport_name']
      document.getElementById('hour'+matchId).innerHTML += date.getHours() + ':'

      //display minutes format :mm
      if(date.getMinutes()<10){
        document.getElementById('hour'+matchId).innerHTML += '0' + date.getMinutes()
      }
      else{
        document.getElementById('hour'+matchId).innerHTML += date.getMinutes()
      }



      document.getElementById('matchcity'+matchId).innerHTML += infos[i]['city']
      document.getElementById('address'+matchId).innerHTML += infos[i]['stade_name'] + ',<br> ' + infos[i]['street']
      document.getElementById('maxplayers'+matchId).innerHTML += infos[i]['nb_player_max']
      document.getElementById('matchplayers'+matchId).innerHTML += infos[i]['nb_participants']
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

function cardCreate(idMatch){

  let area = document.getElementById('matchsArea');

  //creation container of card bloc
  let cont = document.createElement('div')
  cont.className = 'container'

  area.append(cont)


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
  matchTitle.id = 'matchTitle' + idMatch

  //create match sport row
  let matchSport = document.createElement('h6')
  matchSport.id = 'matchSport' + idMatch

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
  hourItem.id = 'hour' + idMatch
  hourItem.style = 'padding: 10px'
  hourItem.textContent = 'Heure: '

  //city item
  let cityItem = document.createElement('li')
  cityItem.className = 'align-items-center'
  cityItem.id = 'matchcity' + idMatch
  cityItem.style = 'padding: 10px'
  cityItem.textContent = 'Ville: '

  //address item
  let addressItem = document.createElement('li')
  addressItem.className = 'align-items-center'
  addressItem.id = 'address' + idMatch
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
  maxPlayersItem.id = 'maxplayers' + idMatch
  maxPlayersItem.style = 'padding: 10px'
  maxPlayersItem.textContent = 'Joueurs max: '

  //matchplayers item
  let matchPlayers = document.createElement('li')
  matchPlayers.className = 'align-items-center'
  matchPlayers.id = 'matchplayers' + idMatch
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
  let detailsbut = document.createElement('button')
  detailsbut.className = 'btn'
  detailsbut.id = 'detailBut' + idMatch
  detailsbut.style = 'background: rgba(0, 123, 12, 0.65);'
  detailsbut.textContent = 'Voir détail'
  detailsbut.setAttribute('onclick', 'details(this)')

  blocBut.append(detailsbut)

  //create register button
  let registerbut = document.createElement('button')
  registerbut.className = 'btn'
  registerbut.id = 'registerBut' + idMatch
  registerbut.style = 'background: rgba(245, 147, 0, 0.65); margin-left: 2em'
  registerbut.textContent = 'S\'inscrire'
  registerbut.setAttribute('onclick', 'register(this)')

  blocBut.append(registerbut)

  let jumpCard = document.createElement('br')
  area.append(jumpCard)
}