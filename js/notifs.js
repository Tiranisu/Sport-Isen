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