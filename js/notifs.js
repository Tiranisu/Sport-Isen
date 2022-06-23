import {ajaxRequest, getCookie, disconnect, dynPage, displayImage} from './tool.js';

// to convert the number un text for the date
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


/**
 * Create the waiting card with dynamic informations
 * 
 * @param infos all the information of a match
 */
function createCardWaiting(infos){
  console.log(infos)
  $.ajax({
    method: 'GET',
    url: '../php/notifsRequest.php/userWaiting',
    data:{ 
      matchId: infos['id'],
    }
    }).done((data) => { 
      if(data.length != 0){
        document.getElementById('noWaiting').style.display = 'none'
      }
      data.forEach(userWaiting => {
        var idPart = userWaiting['id']
        const date = new Date(infos['date_time'])
        $.ajax({
          method: 'GET',
          url: '../php/notifsRequest.php/infoUser',
          data:{ 
            userId: userWaiting['user_id'],
          }
          }).done((data) => {
            data.forEach(infoUser => {
              $.ajax({
                method: 'GET',
                url: '../php/notifsRequest.php/fitness',
                data:{ 
                  userId: infoUser['id'],
                }
                }).done((data) =>{
                  data.forEach(fitness => {
                  $.ajax({
                    method: 'GET',
                    url: '../php/notifsRequest.php/sport',
                    data:{ 
                      sportId: infos['sport_id'],
                    }
                    }).done((data) =>{
                      data.forEach(sport => {
                        if(infoUser["age"] == null){
                          var age = 'Pas definit'
                        }
                        else{
                          var age = infoUser["age"]
                        }
                        $("#waitingCard").append("<div class=\"col-md-12\" style=\"background-color: rgb(233, 233, 233); height: 90px; border-radius: 10px;margin-top: 1em;\"><div class=\"row\"><div style=\"margin-top: 1em; margin-left: 0.5em;\"> " + infos['name'] + " | " + days[0][date.getDay()] + ' ' + date.getDate() + ' ' + months[0][date.getMonth()] + ' ' + date.getFullYear() + " | "+ sport['name'] +" <button class=\"btInput\" id=\"btCkeck"+ idPart +"\" style=\"margin-left: 25em; background: rgba(0,0,0,0)\" onclick='accetpBt(this)'> <i class=\"fa-solid fa-circle-check\" style=\"color: #007B0C; font-size: x-large;\"></i> </button><button class=\"btInput\" id=\"btCross"+ idPart +"\" style=\"margin-left: 1em; background: rgba(0,0,0,0)\" onclick='denyBt(this)'> <i class=\"fa-solid fa-circle-xmark\" style=\"color: #cc1407; font-size: x-large;\"></i> </button></div></div><h6 style=\"color: rgb(102, 102, 102); margin-top: 0.5em; margin-left: 0.5em;\">"+infoUser['firstname'] + ' ' + infoUser ["lastname"]  + " | age : " + age + " | Forme physique : "+ fitness['type'] +"</h6></div>")
                      });
                    })
                  });
                  
                })
            });
          })
      });
    })
}


/**
 * Create the response card with dynamic informations
 * 
 * @param infos match_id, status
 */
function createCardAccepted(infos){
  $.ajax({
    method: 'GET',
    url: '../php/notifsRequest.php/matchs',
    data:{ 
      matchId: infos['match_id'],
    }
    }).done((match) => {
      console.log(match)
      if(match.length != 0){
        document.getElementById('noResponse').style.display = 'none'

      }

      const date = new Date(match[0]['date_time'])

      // deny card
      if(infos['status'] == 1){
        $("#responseCard").append("<div class='row' style='margin-top: 1em;'><div class='input-group-text lock' style='height: 50px'><p style='margin-top: 1em; margin-left: 0.5em;'>" + match[0]['name'] + " | " + days[0][date.getDay()] + ' ' + date.getDate() + ' ' + months[0][date.getMonth()] + ' ' + date.getFullYear() + "<h6 style='color: rgb(102, 102, 102); margin-top: 0.5em; margin-left: 0.5em;'>"+ match[0]['sport_name'] +"</h6><i class='fa-solid fa-check' style='color: #007B0C; margin-left: 10em'></i><p style='margin-top: 1em; margin-left: 0.5em; color: #007B0C;'> Demande acceptée </p></p></div></div>")
      }
      if(infos['status'] == 0){
        $("#responseCard").append("<div class='row' style='margin-top: 1em;'><div class='input-group-text lock' style='height: 50px'><p style='margin-top: 1em; margin-left: 0.5em;'> " + match[0]['name'] + " | " + days[0][date.getDay()] + ' ' + date.getDate() + ' ' + months[0][date.getMonth()] + ' ' + date.getFullYear() + "<h6 style='color: rgb(102, 102, 102); margin-top: 0.5em; margin-left: 0.5em;'>"+ match[0]['sport_name'] +"</h6><i class='fa-solid fa-xmark' style='color: #cc1407; margin-left: 10em'></i><p style='margin-top: 1em; margin-left: 0.5em; color: #cc1407;'> Demande refusée</p></p></div></div>")
      }
    })
}


/**
 * Used to distribute information across function or ajaxrequest
 * 
 * @param infos contain all the information about the user 
 */
function distribution(infos){
  // display user name & profil picture in header
  dynPage(infos)

  //display profile image in nav bar
  ajaxRequest('GET', `../php/searchRequest.php/picture?id=${infos[0]['id']}`, displayImage)

  // create the waiting card
  $.ajax({
    method: 'GET',
    url: '../php/notifsRequest.php/orga',
    data:{ 
      userId: infos[0]['id'],
    }
    }).done((data) => {
      data.forEach(match => {
        createCardWaiting(match)
      })
    })

  // create the response card
  $.ajax({
    method: 'GET',
    url: '../php/notifsRequest.php/request',
    data:{ 
      userId: infos[0]['id'],
    }
    }).done((data) => {
      console.log(data)
      data.forEach(notif => {
        createCardAccepted(notif)
      });
      
    })
}


/**
 * When the page is loaded, get the cookie which contain the access token and 
 * give it to the distribution function. 
 * If your not connected (no cookie) your are automaticly redirect to the home page
 */
$(() => {
  let accessToken = getCookie('sportisen')
  if(accessToken.length == 0){
    window.location.href = '../index.html'
  }
  ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${accessToken}`, distribution)
})


/**
 * When button is clicked, call the import disconnect function
 */
$("#disconnect").click(function(){
  disconnect()
})


//------------------------------------------------------------------------------
//--------------------------- Rate ---------------------------------------------
//------------------------------------------------------------------------------

let star1 = document.getElementById('star1')
let star2 = document.getElementById('star2')
let star3 = document.getElementById('star3')
let star4 = document.getElementById('star4')
let star5 = document.getElementById('star5')

let accessToken = getCookie('sportisen')
ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${accessToken}`, function(infos){

  let userId = infos[0]['id']

  star1.onclick = function(){
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 1,
        userid: userId
      }
    })
  }
  star2.onclick = function(){
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 2,
        userid: userId
      }
    })
  }
  star3.onclick = function(){
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 3,
        userid: userId
      }
    })
  }
  star4.onclick = function(){
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 4,
        userid: userId
      }
    })
  }
  star5.onclick = function(){
    $.ajax('../php/searchRequest.php/rate', {
      method: 'PUT', data : {
        rate: 5,
        userid: userId
      }
    })
  }

  ajaxRequest('GET', `../php/searchRequest.php/rate?userid=${userId}`, function(infos){
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