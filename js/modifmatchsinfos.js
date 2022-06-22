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
          // console.log(xhr.responseText);
          callback(JSON.parse(xhr.responseText));
          break;
        default:
          httpErrors(xhr.status);
      }
    };
  
    // Send XML HTTP request.
    xhr.send(data);
}




function modify(elem){
    var butid = elem.id
    var matches = butid.match(/(\d+)/)
    var matchId = matches[0]

    let scoreDisplay = document.getElementById('score'+matchId)
    let bestplayerDisplay = document.getElementById('bestplayer'+matchId)

    scoreDisplay.textContent = 'Score: '
    bestplayerDisplay.textContent = 'Meilleur joueur: '




    ajaxRequest('GET', `../php/searchRequest.php/players?matchid=${matchId}`, function(infos){

        let cancelBut = document.createElement('button')
        cancelBut.id = 'cancel' + matchId
        cancelBut.className = 'btn'
        cancelBut.style = 'background : rgba(255, 174, 0, 0.65); margin-left: 2em;'
        cancelBut.setAttribute('onclick', 'cancel(this)')
        cancelBut.textContent = 'Annuler'

        let blocBut = document.getElementById('blocbut'+matchId)

        blocBut.append(cancelBut)


        let score = document.getElementById('score'+matchId)
        let input1 = document.createElement('input')
        input1.type = 'number'
        input1.setAttribute('value', 0)
        input1.setAttribute('min', 0)
        input1.id = 'matchscore1'
        input1.style = 'width: 50px'

        let input2 = document.createElement('input')
        input2.type = 'number'
        input2.setAttribute('value', 0)
        input2.setAttribute('min', 0)
        input2.id = 'matchscore2'
        input2.style = 'width: 50px'

        let span = document.createElement('span')
        span.id = 'span'
        span.textContent = ' - '

        score.append(input1)
        score.append(span)
        score.append(input2)


        let bestplayer = document.getElementById('bestplayer'+matchId)
        let selectplayer = document.createElement('select')
        selectplayer.id = 'bestplayer'
        bestplayer.append(selectplayer)

        for(let i=0; i<infos.length; i++){
            let option = document.createElement('option')
            option.id = infos[i]['id']
            option.textContent = infos[i]['firstname'] + ' ' + infos[i]['lastname']
            selectplayer.add(option)
        }
        elem.textContent = 'Sauvegarder'
        elem.style = 'background: rgba(0, 123, 12, 0.65)'
        elem.setAttribute('onclick', 'save(this)')
    })
  }


  function save(elem){

    var butid = elem.id
    var matches = butid.match(/(\d+)/)
    var matchId = matches[0]

    let matchscore = $('#matchscore1').val() + '-' + $('#matchscore2').val()

    let bestPlayer = $('#bestplayer').children(":selected").attr("id")


    console.log(matchscore)
    console.log(bestPlayer)


    $.ajax('../php/matchRequest.php/updatematch', {
        method: 'PUT', data: {
            score: matchscore,
            bestplayer: bestPlayer,
            matchid: matchId
        }
    })

    $('#matchscore1').remove()
    $('#matchscore2').remove()
    $('#bestplayer').remove()
    $('#span').remove()
    elem.textContent = 'Entrer les résultats du match'
    elem.style = 'background: rgba(255, 174, 0, 0.65);'
    elem.setAttribute('onclick', 'modify(this)')
    location.reload()
  }

  function cancel(elem){

    var butid = elem.id
    var matches = butid.match(/(\d+)/)
    var matchId = matches[0]

    let but = document.getElementById('modifBut'+matchId)
    let score1 = document.getElementById('matchscore1')
    let score2 = document.getElementById('matchscore2')
    let span = document.getElementById('span')
    let bestplayer = document.getElementById('bestplayer')

    but.textContent = 'Entrer les résultats du match'
    but.style = 'background: rgba(255, 174, 0, 0.65);'
    but.setAttribute('onclick', 'modify(this)')
    score1.remove()
    score2.remove()
    span.remove()
    bestplayer.remove()
    elem.remove()
  }