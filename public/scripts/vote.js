upvote = (e) => {
    const URL = "http://127.0.0.1:8000/api/vote";
    let id = e.target.parentNode.id
    let data = {"id": id,"vote": "up"}

    fetch(URL, {
        method: 'post',
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then(function(response){
            document.getElementById(id + "p").innerHTML = parseInt(document.getElementById(id + "p").innerHTML) + 1
        })
        .catch(function(error){
        });
}

downvote = (e) => {
    const URL = "http://127.0.0.1:8000/api/vote";
    let id = e.target.parentNode.id
    let data = {
        "id": id,
        "vote": "down"
    }

    fetch(URL, {
        method: 'post',
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then(function(response){
            document.getElementById(id + "p").innerHTML = parseInt(document.getElementById(id + "p").innerHTML) - 1
        })
        .catch(function(error){
        });
}

document.addEventListener('DOMContentLoaded', function(event) {
    var upArrows = document.getElementsByClassName("a-vote__up")
    var downArrows = document.getElementsByClassName("a-vote__down")

    Array.prototype.forEach.call(upArrows, function(arrow) {
        arrow.addEventListener('click', upvote)
    })

    Array.prototype.forEach.call(downArrows, function(arrow) {
        arrow.addEventListener('click', downvote)
    })
})