import {ajaxRequest, getCookie, disconnect, dynPage, displayImage} from './tool.js';

$(() => {
  let accessToken = getCookie('sportisen')
  if(accessToken.length == 0){
    window.location.href = '../index.html'
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
//--------------------------- Create Event -------------------------------------
//------------------------------------------------------------------------------

let token = getCookie('sportisen')


//set min day to today for date select
let dateselect = document.getElementById('date')
let timestamp = Date.now()
let test = new Date(timestamp)

let actual_day = test.getFullYear() + '-' 

if((test.getMonth()+1)<10){
  actual_day += '0' + (test.getMonth()+1) + '-'
}
else{
  actual_day += (test.getMonth()+1) + '-'
}

if(test.getDate()<10){
  actual_day += '0' + test.getDate()
}
else{
  actual_day += test.getDate()
}
dateselect.setAttribute('min', actual_day)


//no possibilities to have minplayers>maxplayers
$('#minplayers').on('change', () => {

  let minplayers = $('#minplayers').val()

  let maxselect = document.getElementById('maxplayers')

  maxselect.setAttribute('value', minplayers)
  maxselect.setAttribute('min', minplayers)


})




$('#create').on('click', (event)=>{

  

  ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${token}`, function(infos){
    event.preventDefault()


    //get form values
    let name = $('#name').val()
    let sport = $('#sport').val()
    let date = $('#date').val()
    let hour = $('#hour').val()
    let minutes = $('#time').val()
    let price = $('#price').val()
    let minplayers = $('#minplayers').val()
    let maxplayers = $('#maxplayers').val()
    let address = $('#address').val()
    let city = $('#city').val()
    let postalcode = $('#postalcode').val()

    //create duration format hh:mm
    let hours = 0
    while(minutes >= 60){
      hours++
      minutes = minutes - 60
    }
    if(minutes < 10){
      minutes = '0'+minutes
    }
    let time = hours + ':' + minutes


    //create event date format 'yyyy-mm-dd hh-mm'
    let date_event = date + ' ' + hour

    //create event duration format 'actual day hh:mm'
    let duration = actual_day + ' ' + time

    let userId = infos[0]['id']

    let formValid = checkForm()

    if(formValid){
      $.ajax('../php/createRequest.php/create', {
          method: "POST", data: {
            event_orga: userId,
            event_name: name,
            event_sport: sport,
            event_date: date_event,
            event_duration: duration,
            event_price: price,
            event_minplayers: minplayers,
            event_maxplayers: maxplayers,
            event_address: address,
            event_city: city,
            event_postalcode: postalcode
          }
        })


        $('#name').val("")
        $('#sport').val("")
        $('#date').val("")
        $('#hour').val("")
        $('#time').val(0)
        $('#price').val("")
        $('#minplayers').val(0)
        $('#maxplayers').val(0)
        $('#address').val("")
        $('#city').val("")
        $('#postalcode').val("")
        alert('Le match a bien été créé')
        
    }

      
    })

    

})


function checkForm(){

  let name = $('#name').val()
  let sport = $('#sport').val()
  let date = $('#date').val()
  let hour = $('#hour').val()
  let minutes = $('#time').val()
  let price = $('#price').val()
  let minplayers = $('#minplayers').val()
  let maxplayers = $('#maxplayers').val()
  let address = $('#address').val()
  let city = $('#city').val()
  let postalcode = $('#postalcode').val()

  if(name == "" || sport == "" || date == "" || hour == "" || minutes == "" || price == "" || minplayers == "" || maxplayers == "" || address == "" || city == "" || postalcode == ""){
    return false;
  }
  else{
    return true;
  }


}


//------------------------------------------------------------------------------
//--------------------------- Rate ---------------------------------------------
//------------------------------------------------------------------------------

let star1 = document.getElementById('star1')
let star2 = document.getElementById('star2')
let star3 = document.getElementById('star3')
let star4 = document.getElementById('star4')
let star5 = document.getElementById('star5')


ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${token}`, function(infos){

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
