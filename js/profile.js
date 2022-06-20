import {ajaxRequest, getCookie, dynPage} from './tool.js';

$(() => {
    console.log(getCookie('sportisen'))
    let accessToken = getCookie('sportisen')
    if(accessToken.length == 0){
      let url = window.location.href.replace(/search\.html.*/i, 'connexion.html')
      window.location.href = url
    }
    
    ajaxRequest('GET', `../php/profileRequest.php/user?accessToken=${accessToken}`, distribution)
  })

function distribution(infos){
    dynPage(infos)
}
