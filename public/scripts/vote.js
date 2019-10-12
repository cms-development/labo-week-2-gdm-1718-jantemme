upvote = (e) => {
    const URL = "/api/vote";
    let id = e.target.parentNode.id
    let data = {"id": id,"vote": "up"}

    if(addToLikes(id, e)) {
        fetch(URL, {
            method: 'post',
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                document.getElementById(id + "p").innerHTML = parseInt(document.getElementById(id + "p").innerHTML) + 1
            })
            .catch(error => {
            });
    }
}

downvote = (e) => {
    const URL = "/api/vote";
    let id = e.target.parentNode.id
    let data = {
        "id": id,
        "vote": "down"
    }
    if(addToDislikes(id, e)) {
        fetch(URL, {
            method: 'post',
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                document.getElementById(id + "p").innerHTML = parseInt(document.getElementById(id + "p").innerHTML) - 1
            })
            .catch(error => {
            });
    }
}

addToLikes = (id, e) => {
    let alreadyLiked = false
    let situation
    if(window.localStorage.getItem('likes')) {
        let likes = JSON.parse(window.localStorage.getItem('likes'))
        alreadyLiked = likes.includes(id)

        if(!alreadyLiked) {
            if(window.localStorage.getItem('dislikes'))
            {
                situation = returnCurrentSituation('like', id);
            } else {
                situation = 'neutral'
            }
            if(situation == 'dislike') {
                // set this id to neutral
                e.target.parentNode.querySelector("#a-vote__down").style.borderTop = "20px solid gray"
                const dislikes = JSON.parse(window.localStorage.getItem('dislikes'))
                const index = dislikes.indexOf(id);
                dislikes.splice(index, 1);
                window.localStorage.setItem('dislikes', JSON.stringify(dislikes))
                return true
            }
            if(situation == 'neutral') {
                // set to like
                e.target.style.borderBottom = "20px solid green"
                likes.push(id)
                window.localStorage.setItem('likes', JSON.stringify(likes))
                return true
            }
        } else {
            return false
        }

    } else {
        let likes = new Array()
        let situation
        if(window.localStorage.getItem('dislikes'))
        {
            situation = returnCurrentSituation('like', id);
        } else {
            situation = 'neutral'
        }
        if(situation == 'dislike') {
            // set this id to neutral
            e.target.parentNode.querySelector("#a-vote__down").style.borderTop= "20px solid gray"
            const dislikes = JSON.parse(window.localStorage.getItem('dislikes'))
            const index = dislikes.indexOf(id);
            console.log(index)
            dislikes.splice(index, 1);
            window.localStorage.setItem('dislikes', JSON.stringify(dislikes))
            return true
        }
        if(situation == 'neutral') {
            // set to like
            e.target.style.borderBottom = "20px solid green"
            likes.push(id)
            window.localStorage.setItem('likes', JSON.stringify(likes))
            return true
        }
    }
}

addToDislikes = (id, e) => {
    let alreadyDisliked = false
    let situation
    if(window.localStorage.getItem('dislikes')) {
        let dislikes = JSON.parse(window.localStorage.getItem('dislikes'))
        alreadyDisliked = dislikes.includes(id)

        if(!alreadyDisliked) {
            if(window.localStorage.getItem('likes'))
            {
                situation = returnCurrentSituation('dislike', id);
            } else {
                situation = 'neutral'
            }
            if(situation == 'like') {
                // set this id to neutral
                e.target.parentNode.querySelector("#a-vote__up").style.borderBottom = "20px solid gray"
                const likes = JSON.parse(window.localStorage.getItem('likes'))
                const index = likes.indexOf(id);
                likes.splice(index, 1)
                window.localStorage.setItem('likes', JSON.stringify(likes))
                return true
            }
            if(situation == 'neutral') {
                // set to like
                e.target.style.borderTop = "20px solid red"
                dislikes.push(id)
                window.localStorage.setItem('dislikes', JSON.stringify(dislikes))
                return true
            }
        } else {
            return false
        }

    } else {
        let dislikes = new Array()
        let situation
        if(window.localStorage.getItem('likes'))
        {
            situation = returnCurrentSituation('dislike', id);
        } else {
            situation = 'neutral'
        }
        if(situation == 'like') {
            // set this id to neutral
            e.target.parentNode.querySelector("#a-vote__up").style.borderBottom = "20px solid gray"
            const likes = JSON.parse(window.localStorage.getItem('likes'))
            const index = likes.indexOf(id);
            likes.splice(0, 1);
            window.localStorage.setItem('likes', JSON.stringify(likes))
            return true
        }
        if(situation == 'neutral') {
            // set to like
            e.target.style.borderTop = "20px solid red"
            dislikes.push(id)
            window.localStorage.setItem('dislikes', JSON.stringify(dislikes))
            return true
        }
    }
}

function returnCurrentSituation(likeOrDislike, id) {

    const likes = JSON.parse(window.localStorage.getItem('likes'))
    const dislikes = JSON.parse(window.localStorage.getItem('dislikes'))

    // if user wants to like the post

    if(likeOrDislike == 'like') {

        if(dislikes.includes(id)) {
            return 'dislike';
        }
        else {
            return 'neutral';
        }

    }

    // if user wants to like the post
    if(likeOrDislike == 'dislike') {
        if(likes.includes(id)) {
            return 'like';
        }
        else {
            return 'neutral';
        }

    }
}

document.addEventListener('DOMContentLoaded', () => {
    let upArrows = document.getElementsByClassName("a-vote__up")
    let downArrows = document.getElementsByClassName("a-vote__down")

    const likes = JSON.parse(window.localStorage.getItem('likes'))
    const dislikes = JSON.parse(window.localStorage.getItem('dislikes'))

    let likeContainers = document.getElementsByClassName("m-container__vote")

    for(let element of likeContainers) {
        likes.forEach((likeId) => {
            if(likeId == element.id) {
                element.querySelector("#a-vote__up").style.borderBottom = "20px solid green"
            }
        })
        dislikes.forEach((dislikeId) => {
            if(dislikeId == element.id) {
                element.querySelector("#a-vote__down").style.borderTop = "20px solid red"
            }
        })

    }

    Array.prototype.forEach.call(upArrows, arrow => {
        arrow.addEventListener('click', upvote)
    })

    Array.prototype.forEach.call(downArrows, arrow => {
        arrow.addEventListener('click', downvote)
    })
})