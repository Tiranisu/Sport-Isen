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


function createCardAccepted(infos){
  $.ajax({
    method: 'GET',
    url: '../php/notifsRequest.php/matchs',
    data:{ 
      matchId: infos['match_id'],
    }
    }).done((match) => {
      console.log(match)
      const date = new Date(match[0]['date_time'])

      // deny card
      if(infos['status'] == 0){
        console.log("a")
        $("#responseCard").append("<div class='row' style='margin-top: 1em;'><div class='input-group-text lock' style='height: 50px'><p style='margin-top: 1em; margin-left: 0.5em;'>" + match[0]['name'] + " | " + days[0][date.getDay()] + ' ' + date.getDate() + ' ' + months[0][date.getMonth()] + ' ' + date.getFullYear() + "<h6 style='color: rgb(102, 102, 102); margin-top: 0.5em; margin-left: 0.5em;'>"+ match[0]['sport_name'] +"</h6><i class='fa-solid fa-check' style='color: #007B0C; margin-left: 10em'></i><p style='margin-top: 1em; margin-left: 0.5em; color: #007B0C;'> Demande acceptée</p></p></div></div>")
      }
      if(infos['status'] == 1){
        $("#responseCard").append("<div class='row' style='margin-top: 1em;'><div class='input-group-text lock' style='height: 50px'><p style='margin-top: 1em; margin-left: 0.5em;'> " + match[0]['name'] + " | " + days[0][date.getDay()] + ' ' + date.getDate() + ' ' + months[0][date.getMonth()] + ' ' + date.getFullYear() + "<h6 style='color: rgb(102, 102, 102); margin-top: 0.5em; margin-left: 0.5em;'>"+ match[0]['sport_name'] +"</h6><i class='fa-solid fa-xmark' style='color: #cc1407; margin-left: 10em'></i><p style='margin-top: 1em; margin-left: 0.5em; color: #cc1407;'> Demande refusée</p></p></div></div>")
      }
    })
}


/**
 * Use to distribute information across function or ajaxrequest
 * @param infos contain all the information about the user 
 */
function distribution(infos){
  // display user name & profil picture
  dynPage(infos)

  //display profile image in nav bar
  ajaxRequest('GET', `../php/searchRequest.php/picture?id=${infos[0]['id']}`, displayImage)



  $.ajax({
    method: 'GET',
    url: '../php/notifsRequest.php/request',
    data:{ 
      userId: infos[0]['id'],
    }
    }).done((data) => {
      data.forEach(notif => {
        console.log(notif)
        createCardAccepted(notif)
      });
      
    })


}