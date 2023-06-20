let articleId
let articleLikeCount = 0


window.onload = async function() {
  const urlParams = new URLSearchParams(window.location.search);
  articleId = urlParams.get("article_id");

  await loadArticles(articleId);
  await loadComments(articleId);

}

// 게시글

async function loadArticles(articleId) {
  const response = await getArticle(articleId)
  console.log(response)
  const articleUsername = response.user

  const articleTitle = document.getElementById("article_title")
  const articleUser = document.getElementById("article_user")
  const articleContent = document.getElementById("article_content")
  const articleImage = document.getElementById("article_image")

  articleTitle.innerText = response.title
  articleUser.innerText = articleUsername.username
  articleContent.innerText = response.content
  const newImage = document.createElement("img")

  if(response.image) {
  newImage.setAttribute("width","100%")
  newImage.setAttribute("src", `${backend_base_url}${response.image}`)
  } else {
    newImage.setAttribute("width","100%")
    newImage.setAttribute("src", "https://health.clevelandclinic.org/wp-content/uploads/sites/3/2022/04/exerciseHowOften-944015592-770x533-1-650x428.jpg")
  }
  articleImage.appendChild(newImage)

}


// 댓글

async function loadComments(articleId) {
  const response = await getComments(articleId); // 해당 아티클의 댓글

  const commentList =document.getElementById("comment_list")
  commentList.innerHTML="" // 새로운 댓글을 포함한 댓글창을 새로고침 하지 않고 보여주기

  response.forEach(comment => {
    // 프로필 이미지 가져오기
    const User = comment.user
    const UserAvatar = User.avatar
    // 유저 프로필 이미지로 분할
    if(UserAvatar) {
      commentList.innerHTML +=
      `<li class="media d-flex mb-3">
      <img src="${UserAvatar}" alt="프로필 이미지" width=50 height=50>
      <div class="media-body">
        <h5 class="mt-0 mb-1">${comment.user}</h5>
        <p>${comment.content}</p>
      </div>
    </li>`
    } else {
      commentList.innerHTML +=
      `<li class="media d-flex mb-3">
      <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" class="mr-3" alt="프로필 이미지" width=50 height=50>
      <div class="media-body">
        <h5 class="mt-0 mb-1">${comment.user}</h5>
        <p>${comment.content}</p>
      </div>
    </li>`
    }
  });
}

async function submitComment() {
  const commentElement = document.getElementById("new_comment")
  const newComment = commentElement.value
  const response = await postComment(articleId, newComment)
  commentElement.value = "" // 댓글 작성 후 작성칸 초기화

  loadComments(articleId)
}

async function loadFeed() {
  window.location.href = "feed.html"
}

// 좋아요 버튼

async function articleLike() {
  
  let token = localStorage.getItem("access")

  const response = await fetch(`${backend_base_url}/articles/${articleId}/like_article/`, {
    method: 'POST',
    headers: {
      'content-type':'application/json',
      'Authorization': `Bearer ${token}`
    },

  })
  response_json = await response.json()
  console.log(response_json)

  const likeCount = document.getElementById("like_count")
  

  if (response.status == 200) {
    const likeButton = document.getElementById("likes")
    likeButton.innerText = response_json.message
    if (likeButton.innerText == "🧡") {
      articleLikeCount += 1
    } else if (likeButton.innerText == "🤍" && articleLikeCount > 0) {
      articleLikeCount -= 1
    }
    likeCount.innerText = articleLikeCount
    return {response_json, articleLikeCount}
  } else {
    alert(response.status)
  }
}

// 수정·삭제 버튼

async function postComment(articleId, newComment) {

  let token = localStorage.getItem("access")

  const response = await fetch(`${backend_base_url}/articles/comment/${articleId}/`, {
    method: 'POST',
    headers: {
      'content-type':'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      'content': newComment,
    })
  })
  if (response.status == 200) {
    response_json = await response.json()
    return response_json
  } else {
    alert(response.status)
  }
}