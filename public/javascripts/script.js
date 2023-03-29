

function revealPassword(_id)    
{    
    //send to express to get the password and then replace the text with the password
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById(_id).innerHTML = this.responseText;
        }
    }
    xhttp.open("GET", "/passwords/getPassword/" + _id, true);
    
    //replace the text with the password
    xhttp.send();
    

}