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
    // console.log(infos)
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

    printMap(infos[0]['stade_name'] + ', ' + infos[0]['street'])
    
}


ajaxRequest('GET', `../php/searchRequest.php/players?matchid=${matchId}`, displayPlayers)



function displayPlayers(infos){
    // console.log(infos)
    for(let i=0; i<infos.length; i++){
        createTable();

        if(infos[0]['link_image'] != null){
            document.getElementById('picture').src = infos[0]['link_image']
            
        }
        else{
            document.getElementById('picture').src = '../resources/img_profil/default_user.png'
        }

        document.getElementById('col0').innerHTML = infos[0]['firstname']
        document.getElementById('col1').innerHTML = infos[0]['lastname']
        document.getElementById('col2').innerHTML = infos[0]['age']
        document.getElementById('col3').innerHTML = infos[0]['type']
        
    }


}


//register
$('#register').on('click', () => {

  let accessToken = getCookie('sportisen')
  ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${accessToken}`, function(infos){

    let userId = infos[0]['id']
    $.ajax('../php/searchRequest.php/register', {
      method: "POST", data: {
        matchid: matchId,
        userid: userId
      },
      success: function(data){
        if(!data){
          document.getElementById('success').style.display = 'none'
          document.getElementById('errors').style.display = 'block'
        }
        else{
          document.getElementById('errors').style.display = 'none'
          document.getElementById('success').style.display = 'block'
        }
        
      }
    })

  })

})




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
    picture.style = 'heigth: 100px; width: 100px'
    picCol.append(picture)

    for(let i =0; i<4; i++){
        let col = document.createElement('td')
        col.style = 'padding-top: 2em'
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
    '1' : 'Lundi',
    '2' : 'Mardi',
    '3' : 'Mercredi',
    '4' : 'Jeudi',
    '5' : 'Vendredi',
    '6' : 'Samedi',
    '0' : 'Dimanche'
  })



  //------------------------------------------------------------------------------
//--------------------------- Rate ---------------------------------------------
//------------------------------------------------------------------------------

let star1 = document.getElementById('star1')
let star2 = document.getElementById('star2')
let star3 = document.getElementById('star3')
let star4 = document.getElementById('star4')
let star5 = document.getElementById('star5')

let token = getCookie('sportisen')
ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${token}`, function(infos){

  let userId = infos[0]['id']

  star1.onclick = function(){
    // console.log(1)
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 1,
        userid: userId
      }
    })
  }
  star2.onclick = function(){
    // console.log(2)
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 2,
        userid: userId
      }
    })
  }
  star3.onclick = function(){
    // console.log(3)
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 3,
        userid: userId
      }
    })
  }
  star4.onclick = function(){
    // console.log(4)
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 4,
        userid: userId
      }
    })
  }
  star5.onclick = function(){
    // console.log(5)
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 5,
        userid: userId
      }
    })
  }

  ajaxRequest('GET', `../php/searchRequest.php/rate?userid=${userId}`, function(infos){
    // console.log(infos);
    if(!infos){
      // console.log('no rate')
    }
    else{
      let rate = infos[0]['score']
      let star = document.getElementById('star'+rate)
      star.checked = true
    }
    
  })

})

/**
 * Print Map
 */
function printMap(street){
  $("#map").append('<iframe width="100%" height="450" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?q='+ street +'&key=AIzaSyCf4jTFkGlmjrGWUeDfARv7KUnoZvDGJyQ"></iframe>');
}