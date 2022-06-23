function accetpBt(elem){
    var butid = elem.id
    var matches = butid.match(/(\d+)/)
    var notifId = matches[0] 
    $.ajax({
        method: 'PUT',
        url: '../php/notifsRequest.php/updateStatus',
        data:{ 
          id: notifId,
          newStatus: 0
        }
        }).done((data) => {})   
        console.log("Updated !")
        location.reload()
}
  
function denyBt(elem){
    var butid = elem.id
    var matches = butid.match(/(\d+)/)
    var notifId = matches[0] 
    $.ajax({
        method: 'PUT',
        url: '../php/notifsRequest.php/updateStatus',
        data:{ 
          id: notifId,
          newStatus: 1
        }
        }).done((data) => {})   
        console.log("Updated !")
        location.reload()
}

  