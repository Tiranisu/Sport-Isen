import {ajaxRequest, getCookie, disconnect, dynPage, displayImage} from './tool.js';

$(() => {
  // console.log(getCookie('sportisen'))
  let accessToken = getCookie('sportisen')
  if(accessToken.length == 0){
    window.location.href = '../index.html'
  }
  ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${accessToken}`, distribution)
})

$("#disconnect").click(function(){
  disconnect()
})


function cardAccepted($match){
  
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
        console.log(notif['status'])
        // deny card
        if(notif['status'] == 1){
          console.log("a")
          $("#responseCard").append("<div class='row' style='margin-top: 1em;'><div class='input-group-text lock' style='height: 50px'><p style='margin-top: 1em; margin-left: 0.5em;'> Match | Match <i class='fa-solid fa-check' style='color: #007B0C; margin-left: 30em'></i><p style='margin-top: 1em; margin-left: 0.5em; color: #007B0C;'> Demande acceptée</p></p></div></div>")
        }
        // elseif(notif[status] == 3){
          

        // }elseif(notif[status] == 2){

        // }




        
      });
      
    })


}