function ajaxRequest(type, url, callback)
{
    let xhr = new XMLHttpRequest();
    xhr.open(type, url);


    xhr.onload = () => {
        switch (xhr.status){
            case 200:
            case 201: 
                console.log(xhr.responseText);
                var data = JSON.parse(xhr.responseText);
                console.log(data);
                callback(data);
                break;
            default:
                console.log('HTTP error: ' + xhr.status);
                httpErrors(xhr.status);
                break;
        }
    };

    
    xhr.send();
}

function displayInfo(infos){

    

    if(infos == true){
        document.getElementById('validmail').style.display = 'none';
        document.getElementById('unvalidmail').style.display = 'block';
    }
    else{
        document.getElementById('validmail').style.display = 'block';
        document.getElementById('unvalidmail').style.display = 'none';
    }

    if(document.getElementById('mail').value == ""){
        document.getElementById('validmail').style.display = 'none';
        document.getElementById('unvalidmail').style.display = 'none';
    }

}
$( "#mail" ).change(function()
{
    mail = document.getElementById('mail').value;
    console.log(mail);
    ajaxRequest('GET', `../php/authRequest.php/register?mail=${mail}`, displayInfo);
});
