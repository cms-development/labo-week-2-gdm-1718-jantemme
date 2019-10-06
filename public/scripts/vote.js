upvote = (e) => {
    const URL = "http://127.0.0.1:8000/api/vote";
    let id = e.target.parentNode.id
    let data = {"id": id,"vote": "up"}

    if(addToLikes(id)) {
        fetch(URL, {
            method: 'post',
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                document.getElementById(id + "p").innerHTML = parseInt(document.getElementById(id + "p").innerHTML) + 1
            })
            .catch(function (error) {
            });
    }
}

downvote = (e) => {
    const URL = "http://127.0.0.1:8000/api/vote";
    let id = e.target.parentNode.id
    let data = {
        "id": id,
        "vote": "down"
    }
    if(addToDislikes(id)) {
        fetch(URL, {
            method: 'post',
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                document.getElementById(id + "p").innerHTML = parseInt(document.getElementById(id + "p").innerHTML) - 1
            })
            .catch(function (error) {
            });
    }
}

addToLikes = (id) => {
    let double = false
    if(window.localStorage.getItem('likes')) {
        let likes = JSON.parse(window.localStorage.getItem('likes'))
        likes.forEach(function(like){
            if(like == id) {
                double = true
            }
        })
        if(!double) {
            checkIfDislike(id)
            likes.push(id)
            window.localStorage.setItem('likes', JSON.stringify(likes))
            return true
        } else {
            return false
        }
    } else {
        let likes = new Array()
        likes.push(id)
        window.localStorage.setItem('likes', JSON.stringify(likes))
        return true
    }
}

addToDislikes = (id) => {
    let double = false
    if(window.localStorage.getItem('dislikes')) {
        let dislikes = JSON.parse(window.localStorage.getItem('dislikes'))
        dislikes.forEach(function(dislike){
            if(dislike == id) {
                double = true
            }
        })
        if(!double) {
            checkIfLike(id)
            dislikes.push(id)
            window.localStorage.setItem('dislikes', JSON.stringify(dislikes))
            return true
        } else {
            return false
        }
    } else {
        checkIfLike(id)
        let dislikes = new Array()
        dislikes.push(id)
        window.localStorage.setItem('dislikes', JSON.stringify(dislikes))
        return true
    }
}

checkIfLike = (id) => {
    if(window.localStorage.getItem('likes')) {
        let likes = JSON.parse(window.localStorage.getItem('likes'))
        likes.forEach(function (like, index) {
            if (like == id) {
                likes.splice(index, 1)
                window.localStorage.setItem('likes', JSON.stringify(likes))
            }
        })
    }
}

checkIfDislike = (id) => {
    if(window.localStorage.getItem('dislikes')) {
        let dislikes = JSON.parse(window.localStorage.getItem('dislikes'))
        dislikes.forEach(function (dislike, index) {
            if (dislike == id) {
                dislikes.splice(index, 1)
                window.localStorage.setItem('dislikes', JSON.stringify(dislikes))
            }
        })
    }
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