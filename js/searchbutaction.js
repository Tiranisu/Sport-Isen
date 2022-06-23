function ajaxRequest(type, url, callback, data = null){
    let xhr;

    // Create XML HTTP request.
    xhr = new XMLHttpRequest();
    if (type == 'GET' && data != null)
        url += '?' + data;
    xhr.open(type, url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Add the onload function.
    xhr.onload = () =>
    {
        switch (xhr.status)
        {
        case 200:
        case 201:
            callback(JSON.parse(xhr.responseText));
            break;
        default:
            httpErrors(xhr.status);
        }
    };

    // Send XML HTTP request.
    xhr.send(data);
}

function getCookie(c_name) {
    let c_start
    let c_end
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

function register(elem){
    var butid = elem.id
    var matches = butid.match(/(\d+)/)
    var matchId = matches[0]

    let token = getCookie('sportisen')
    ajaxRequest('GET', `../php/searchRequest.php/user?accessToken=${token}`, function(infos){

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

    
}

function details(elem){
    var butid = elem.id
    var matches = butid.match(/(\d+)/)
    var matchId = matches[0]

    document.location.href="details.html?matchid=" + matchId
}