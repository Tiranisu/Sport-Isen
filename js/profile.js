import {ajaxRequest, getCookie, dynPage, disconnect, displayImage} from './tool.js';

let accessToken = getCookie('sportisen')
var passValid = false;



/**
 * Use to distribute information across function or ajaxrequest
 * @param infos contain all the information about the user 
 */
function distribution(infos){
  let firstname = infos[0]['firstname']
  let lastname = infos[0]['lastname']

  // display user name & profil picture
  dynPage(infos)

  // display profile image in nav bar
  ajaxRequest('GET', `../php/profileRequest.php/picture?id=${infos[0]['id']}`, displayImage)

  // display the name in the modification section
  document.getElementById("userName").textContent = firstname + " " + lastname

  // call the function to lock all the input
  inputLock()

  // initiate the value in the input and lock them
  document.getElementById('firstname').value = firstname
  document.getElementById('lastname').value = lastname
  document.getElementById('email').value = infos[0]['email']
  document.getElementById('age').value = infos[0]['age']
  document.getElementById('profilPicture').value = infos[0]['link_image']

  console.log(infos[0])
  console.log(infos[0]['link_image'])

  $.ajax({
    method: 'GET',
    url: '../php/profileRequest.php/city',
    data:{ id: infos[0]['id']}
    }).done((data) => {
      document.getElementById('city').value = data[0]['city']
  })

  var fitnessSelect
  $.ajax({
    method: 'GET',
    url: '../php/profileRequest.php/fitnessUser',
    data:{ id: infos[0]['id']}
    }).done((data) => {
      if(data.length > 0){
        fitnessSelect = data[0]['type']
      }
      $.ajax({
        method: 'GET',
        url: '../php/profileRequest.php/fitness',
        }).done((data) => {
          data.forEach(fitness => {
            if(fitness['type'] == fitnessSelect){
              $("#fitness").append("<option value='"+fitness['type']+"' selected>"+fitness['type']+"</option>");
            }
            else{
              $("#fitness").append("<option value='"+fitness['type']+"'>"+fitness['type']+"</option>");
            }
          });
      })
  })

  ajaxRequest('GET', `../php/profileRequest.php/picture?id=${infos[0]['id']}`, profilPicture)
  if (infos[0]['nb_match'] == 0) {
    document.getElementById('nbMatch').innerHTML = infos[0]['nb_match']
  }else{
    document.getElementById('nbMatch').innerHTML = 0
  }
 }

function profilPicture(infos){
  document.getElementById('profilePicture').value = infos[0]['link_image']
}

function inputLock(){
  $("#firstname, #lastname, #email, #age, #city, #postalCode, #fitness, #profilPicture").prop('disabled', true)
}

function inputUnlock(){
  $("#firstname, #lastname, #email, #password, #age, #city, #postalCode, #fitness, #profilPicture").prop('disabled', false)
}



$(() => {
  console.log(accessToken)
  if(accessToken.length == 0){
    window.location.href = 'connexion.html'
  }
  ajaxRequest('GET', `../php/profileRequest.php/accessToken?accessToken=${accessToken}`, distribution)
  document.getElementById('saveBt').style.display = 'none'
  document.getElementById('cancelBt').style.display = 'none'
})

$("#disconnect").click(function(){
  disconnect()
})  

$("#modificationBt").click(function(){  
  document.getElementById('modificationBt').style.display = 'none'
  document.getElementById('saveBt').style.display = 'block'
  document.getElementById('cancelBt').style.display = 'block'
  inputUnlock();
  inputUnlock();
}) 

$("#cancelBt").click(function(){
  document.getElementById('modificationBt').style.display = 'block'
  document.getElementById('saveBt').style.display = 'none'
  document.getElementById('cancelBt').style.display = 'none'
  inputLock();

  document.getElementById("fitness").options.length = 0; // delete all the option in the select
  ajaxRequest('GET', `../php/profileRequest.php/accessToken?accessToken=${accessToken}`, distribution) // 
}) 

$("#saveBt").click(function(){
  console.log($('#profilPicture').val())
  $.ajax({
    method: 'PUT',
    url: '../php/profileRequest.php/updateUser',
    data:{ 
      firstname: document.getElementById('firstname').value,
      lastname: document.getElementById('lastname').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      age: document.getElementById('age').value,
      city: document.getElementById('city').value,
      fitness: document.getElementById('fitness').value,
      profilPicture: document.getElementById('profilPicture').value,
      accessToken: accessToken
    }
    }).done((data) => {})
    setTimeout(()=>{
      console.log("Saved ! : ")
      document.getElementById('modificationBt').style.display = 'block'
      document.getElementById('saveBt').style.display = 'none'
      document.getElementById('cancelBt').style.display = 'none'
      inputLock();
      document.getElementById("fitness").options.length = 0; // delete all the option in the select
      ajaxRequest('GET', `../php/profileRequest.php/accessToken?accessToken=${accessToken}`, distribution)

    }, 50)
})

$("#rePassword").change(function(){
  if($("#password").val() != $("#rePassword").val()){
    document.getElementById("passError").style.display = "block";
    document.getElementById("passError").innerHTML = "Les mots de passe ne correspondent pas !"
    passValid = false;
  }else{
    document.getElementById("passError").style.display = "none";
    passValid = true;
  }
})

$("#modificationPasswdBt").click(function(){
  if(passValid){
    $.ajax({
      method: 'PUT',
      url: '../php/profileRequest.php/updatePass',
      data:{ 
        password: $("#password").val(),
        accessToken: accessToken
      }
      }).done((data) => {})
    }
})