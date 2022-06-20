import {ajaxRequest, getCookie, disconnect, dynPage, displayImage} from './tool.js';

$(() => {
//   console.log(getCookie('sportisen'))
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
//---------------------------Display Match Infos -------------------------------
//------------------------------------------------------------------------------

var queryString = location.search.substring(1);
var infos = queryString.split("=")
var matchId = infos[1]

ajaxRequest('GET', `../php/searchRequest.php/matchs?matchid=${matchId}`, displayInfos)

function displayInfos(infos){
    console.log(infos)
    const date = new Date(infos[0]['date_time'])
    document.getElementById('matchname').innerHTML = infos[0]['name'] + " | " + days[0][date.getDay()] + ' ' + date.getDate() + ' ' + months[0][date.getMonth()] + ' ' + date.getFullYear()
    document.getElementById('hour').innerHTML += date.getHours() + ':'

      //display minutes format :mm
      if(date.getMinutes()<10){
        document.getElementById('hour').innerHTML += '0' + date.getMinutes()
      }
      else{
        document.getElementById('hour').innerHTML += date.getMinutes()
      }
    
    const duration = new Date(infos[0]['duration'])
    document.getElementById('duration').innerHTML += duration.getHours() + 'h'
    if(date.getMinutes()<10){
        document.getElementById('duration').innerHTML += '0' + duration.getMinutes()
      }
      else{
        document.getElementById('duration').innerHTML += duration.getMinutes()
      }

    document.getElementById('city').innerHTML += infos[0]['city']
    document.getElementById('address').innerHTML += infos[0]['stade_name'] + ', ' + infos[0]['street']
    document.getElementById('price').innerHTML += infos[0]['price'] + '€'
    document.getElementById('maxplayers').innerHTML += infos[0]['nb_player_max'] + ' joueur(s)'
    document.getElementById('matchplayers').innerHTML += infos[0]['nb_participants'] + ' joueur(s)'

    ajaxRequest('GET', `../php/searchRequest.php/orga?orgid=${infos[0]['organization_id']}`, function(data){
        document.getElementById('orga').innerHTML += data[0]['firstname'] + ' ' + data[0]['lastname']
    })

}

ajaxRequest('GET', `../php/searchRequest.php/players?matchid=${matchId}`, displayPlayers)

function displayPlayers(data){

    for(let i=0; i<data.length; i++){
        createTable();

        if(data[0]['link_image'] != 'NULL'){
            document.getElementById('picture').src = data[0]['link_image']
        }
        else{
            document.getElementById('picture').src = '../resources/img_profil/default_user.png'
        }
        
    }


}

//------------------------------------------------------------------------------
//--------------------------- Create tab ---------------------------------------
//------------------------------------------------------------------------------

function createTable(){
    let tabBody = document.getElementById('tablebody')

    let row = document.createElement('tr')
    tabBody.append(row)

    let picCol = document.createElement('td')
    tabBody.append(picCol)

    let picture = document.createElement('img')
    picture.id = 'picture'
    picCol.append(picture)

    for(let i =0; i<3; i++){
        let col = document.createElement('td')
        col.id = 'col' + i
        tabBody.append(col)
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