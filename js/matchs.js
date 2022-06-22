import {ajaxRequest, getCookie, disconnect, dynPage, displayImage} from './tool.js';

$(() => {
  // console.log(getCookie('sportisen'))
  let accessToken = getCookie('sportisen')
  if(accessToken.length == 0){
    window.location.href = 'connexion.html'
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
//--------------------------- Display matchs -----------------------------------
//------------------------------------------------------------------------------

let token = getCookie('sportisen')
ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${token}`, function(infos){

  let userId = infos[0]['id']

  let actual_day = new Date(Date.now())



  //------------------------------------------------------------------------------
  //--------------------------- Future matchs ------------------------------------
  //------------------------------------------------------------------------------



  ajaxRequest('GET', `../php/matchRequest.php/matchs?userid=${userId}`, displayFutureMatch)


  function displayFutureMatch(infos){
    let zone = document.getElementById('futurematchs')
    // if(!infos){
    //   document.getElementById('nofuturematch').style.display = 'block'
    // }
    // else{

      for(let i=0; i<infos.length; i++){

          let date = new Date(infos[i]['date_time'])

          if(date > actual_day){
              document.getElementById('nofuturematch').style.display = 'none'
              // console.log(infos[i])
              const matchId = infos[i]['id']
              // console.log(infos[i]['id'])
        
              futureCardCreate(zone, matchId)

              ajaxRequest('GET', `../php/matchRequest.php/status?userid=${userId}&matchid=${infos[i]['id']}`, function(data){

                // console.log(data)

                if(data['isOrga']){
                  document.getElementById('isorgaorplayer'+matchId).innerHTML += 'Organisateur' 

                  if(data['isPlayer'] && data['playerStatus'] == 'accepted'){
                    document.getElementById('isorgaorplayer'+matchId).innerHTML += ' et Joueur (accepté)'
                  }
                  else{
                    if(data['isPlayer'] && data['playerStatus'] == 'waiting'){
                      document.getElementById('isorgaorplayer'+matchId).innerHTML += ' et Joueur (en attente)'
                    }
                    else{
                      if(data['playerStatus'] == 'not accepted'){
                        let card = document.getElementById('match'+matchId)
                        card.remove()
                        document.getElementById('nofuturematch').style.display = 'block'
                      }
                    }
                  }
                }
                else{
                  if(data['isPlayer'] && data['playerStatus'] == 'accepted'){
                    document.getElementById('isorgaorplayer'+matchId).innerHTML += 'Joueur (accepté)'
                  }
                  else{
                    if(data['isPlayer'] && data['playerStatus'] == 'waiting'){
                      document.getElementById('isorgaorplayer'+matchId).innerHTML += 'Joueur (en attente)'
                    }
                    else{
                      if(data['playerStatus'] == 'not accepted'){
                        let card = document.getElementById('match'+idMatch)
                        card.remove()
                        document.getElementById('nofuturematch').style.display = 'block'
                      }
                    }
                  }
                }
              })

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
        
                if(infos[i]['stade_name'] != null){
                  document.getElementById('address'+matchId).innerHTML += infos[i]['stade_name'] + ',<br> ' + infos[i]['street']
                }
                else{
                  document.getElementById('address'+matchId).innerHTML += infos[i]['street']
                }
              
            }
    }
  }
 
  
  //------------------------------------------------------------------------------
  //--------------------------- Past matchs --------------------------------------
  //------------------------------------------------------------------------------
  
  ajaxRequest('GET', `../php/matchRequest.php/matchs?userid=${userId}`, displayPastMatch)
  
  function displayPastMatch(infos){

    let zone = document.getElementById('pastmatchs')
    // if(!infos){
    //   document.getElementById('nofuturematch').style.display = 'block'
    // }
    // else{

      for(let i=0; i<infos.length; i++){

          let date = new Date(infos[i]['date_time'])

          if(date < actual_day){
              document.getElementById('nopastmatch').style.display = 'none'
              // console.log(infos[i])
              const matchId = infos[i]['id']
              // console.log(infos[i]['id'])
        
              pastCardCreate(zone, matchId)

              ajaxRequest('GET', `../php/matchRequest.php/status?userid=${userId}&matchid=${infos[i]['id']}`, function(data){

                // console.log(data)

                if(data['isOrga']){
                  document.getElementById('isorgaorplayer'+matchId).innerHTML += 'Organisateur' 
                  document.getElementById('modifBut'+matchId).style.display = 'block'

                  if(data['isPlayer'] && data['playerStatus'] == 'accepted'){
                    document.getElementById('isorgaorplayer'+matchId).innerHTML += ' et Joueur (accepté)'
                  }
                  else{
                    if(data['isPlayer'] && data['playerStatus'] == 'waiting'){
                      document.getElementById('isorgaorplayer'+matchId).innerHTML += ' et Joueur (en attente)'
                    }
                    else{
                      if(data['playerStatus'] == 'not accepted'){
                        let card = document.getElementById('match'+matchId)
                        card.remove()
                        document.getElementById('nofuturematch').style.display = 'block'
                      }
                    }
                  }
                }
                else{
                  if(data['isPlayer'] && data['playerStatus'] == 'accepted'){
                    document.getElementById('isorgaorplayer'+matchId).innerHTML += 'Joueur (accepté)'
                  }
                  else{
                    if(data['isPlayer'] && data['playerStatus'] == 'waiting'){
                      document.getElementById('isorgaorplayer'+matchId).innerHTML += 'Joueur (en attente)'
                    }
                    else{
                      if(data['playerStatus'] == 'not accepted'){
                        let card = document.getElementById('match'+idMatch)
                        card.remove()
                        document.getElementById('nofuturematch').style.display = 'block'
                      }
                    }
                  }
                }
              })

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
        
                if(infos[i]['stade_name'] != null){
                  document.getElementById('address'+matchId).innerHTML += infos[i]['stade_name'] + ',<br> ' + infos[i]['street']
                }
                else{
                  document.getElementById('address'+matchId).innerHTML += infos[i]['street']
                }

                if(infos[i]['score'] != null){
                  document.getElementById('score'+matchId).innerHTML += infos[i]['score']
                }

                

                if(infos[i]['best_player_id'] != null){
                  ajaxRequest('GET', `../php/matchRequest.php/bestplayer?matchid=${matchId}`, function(data){
                    document.getElementById('bestplayer'+matchId).innerHTML += data['firstname'] + ' ' + data['lastname']
                  })
                }
              
          }
    }
  }
})



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
  '1' : 'Lundi',
  '2' : 'Mardi',
  '3' : 'Mercredi',
  '4' : 'Jeudi',
  '5' : 'Vendredi',
  '6' : 'Samedi',
  '0' : 'Dimanche'
})



//------------------------------------------------------------------------------
//--------------------------- Card Creation ------------------------------------
//------------------------------------------------------------------------------


function futureCardCreate(zone, idMatch){

  let area = zone;

  //creation container of card bloc
  let cont = document.createElement('div')
  cont.className = 'container'
  cont.id = 'match' + idMatch

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

  //isorga or player item
  let isOrgaOrPlayer = document.createElement('li')
  isOrgaOrPlayer.className = 'align-items-center'
  isOrgaOrPlayer.id = 'isorgaorplayer' + idMatch
  isOrgaOrPlayer.style = 'padding: 10px'
  isOrgaOrPlayer.textContent = 'Statut: '

  list2.append(isOrgaOrPlayer)

  let jumpCard = document.createElement('br')
  area.append(jumpCard)
}


function pastCardCreate(zone, idMatch){

  let area = zone;

  //creation container of card bloc
  let cont = document.createElement('div')
  cont.className = 'container'
  cont.id = 'match' + idMatch

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

  //isorga or player item
  let isOrgaOrPlayer = document.createElement('li')
  isOrgaOrPlayer.className = 'align-items-center'
  isOrgaOrPlayer.id = 'isorgaorplayer' + idMatch
  isOrgaOrPlayer.style = 'padding: 10px'
  isOrgaOrPlayer.textContent = 'Statut: '

  list2.append(isOrgaOrPlayer)

  //match score item
  let matchScore = document.createElement('li')
  matchScore.className = 'align-items-center'
  matchScore.id = 'score' + idMatch
  matchScore.style = 'padding: 10px'
  matchScore.textContent = 'Score: '

  list2.append(matchScore)

  //best player item
  let bestPlayer = document.createElement('li')
  bestPlayer.className = 'align-items-center'
  bestPlayer.id = 'bestplayer' + idMatch
  bestPlayer.style = 'padding: 10px'
  bestPlayer.textContent = 'Meilleur joueur: '

  list2.append(bestPlayer)

  //create button bloc
  let blocBut = document.createElement('div')
  blocBut.className = 'col-lg-3'
  blocBut.id = 'blocbut' + idMatch
  blocBut.style = 'margin-left: 7em; margin-top: 6.5em;'

  row2.append(blocBut)

  //create orga modif button
  let modifBut = document.createElement('button')
  modifBut.className = 'btn'
  modifBut.id = 'modifBut' + idMatch
  modifBut.style = 'background: rgba(255, 174, 0, 0.65); display:none'
  modifBut.textContent = 'Entrer les résultats du match'
  modifBut.setAttribute('onclick', 'modify(this)')

  blocBut.append(modifBut)

  let jumpCard = document.createElement('br')
  area.append(jumpCard)
}