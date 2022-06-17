document.getElementById("cmtx_comment").value = localStorage.getItem("comment");

function saveComment() {
    var comment = document.getElementById("cmtx_comment").value;
    if (comment == "") {
        alert("Please enter a comment in first!");
        return false;
    }

    localStorage.setItem("comment", comment);
    alert("Your comment has been saved!");

    location.reload();
    return false;
    //return true;
}