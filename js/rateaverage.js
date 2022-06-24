import {ajaxRequest} from './tool.js';


//------------------------------------------------------------------------------
//--------------------------- Rate ---------------------------------------------
//------------------------------------------------------------------------------

let star1 = document.getElementById('star1')
let star2 = document.getElementById('star2')
let star3 = document.getElementById('star3')
let star4 = document.getElementById('star4')
let star5 = document.getElementById('star5')


ajaxRequest('GET', `php/indexRequest.php/rating`, function(infos){
    
    let sum = 0

    for(let i=0; i<infos.length; i++){
        sum += infos[i]['score']
    }

    let moy = sum/infos.length

    for(let i=0.5; i<=moy; i+=0.5){
        let star = document.getElementById(i)
        star.style = 'color:orange'
    }

    
    

})