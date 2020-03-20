    const upButton = document.getElementById("upvote");
    const downButton = document.getElementById("downvote");
    const score = document.querySelector('.score')
    const formSubmit = document.querySelector(".comment-form");
    const comment = document.getElementById("user-comment");
    const commentList = document.querySelector('.comments');

    function fetchImg(){
        let err = document.querySelector('.error');
        let load = document.querySelector('.loader');
        load.innerHTML = "Loading...";
        fetch('/kitten/image')
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            return res.json();
        })
        .then(myImg => {
            let pic = document.querySelector('.cat-pic');
            pic.src = myImg.src;
            load.innerHTML = "";
            score.innerHTML = "0";
        })
        .catch(async (error) => {
           let msg = await error.json();
           err.innerHTML = msg.message;
        })
    }

    function updateComments(commentArray) {
        commentList.innerHTML = "";
        commentArray.forEach((comment, index) => {
           const newComment = document.createElement('div');
           newComment.setAttribute('id', `comment-${index}`);
           newComment.innerHTML = `${comment} <button id=Bcomment-${index}>Delete</button`;
           commentList.appendChild(newComment);
        });
    }

    function updateVote(vote){
        fetch(vote, {method: "PATCH"})
        .then(res => {
         if (!res.ok) {
             throw res;
         }
         return res.json();
     })
         .then(point =>{
             score.innerHTML = point.score;
         })
         .catch(async (error) => {
            let msg = await error.json();
            err.innerHTML = msg.message;
         })
     }

    fetchImg();
        const newPicButton = document.getElementById("new-pic");

        newPicButton.addEventListener("click", fetchImg);
        upButton.addEventListener("click", () =>{
            updateVote("/kitten/upvote");
        });
        downButton.addEventListener("click", () =>{
            updateVote("/kitten/downvote");
        });

        formSubmit.addEventListener("submit", (ev) =>{
            ev.preventDefault();
            let formRes = new FormData(formSubmit);
            let body = formRes.get("user-comment");
            comment.value = "";
            fetch('/kitten/comments', {method: 'POST', body: JSON.stringify({comment: body}), headers: {'Content-Type': 'application/json'}})
                .then(res => {
                    return res.json()
                })
                .then(res => {
                    updateComments(res.comments);
                })
        });

        commentList.addEventListener("click", ev =>{
            if (ev.target.id[0] ==="B"){
                let commentId = ev.target.id.split('').splice(9).join('');
               fetch(`/kitten/comments/${commentId}`, {method: "DELETE"})
                .then(res =>{
                    console.log("delete res: ",res);
                    return res.json();
                })
                .then(del =>{
                    updateComments(del.comments);                    
                })
            }
        })

