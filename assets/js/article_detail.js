let articleId
let articleLikeCount = parseInt(localStorage.getItem("articleLikeCount")) || 0;



window.onload = async function() {
  const urlParams = new URLSearchParams(window.location.search);
  articleId = urlParams.get("article_id");

  await loadArticles(articleId);
  await loadComments(articleId);

}

// 공유 게시글 불러오기

async function loadArticles(articleId) {
  const response = await getArticle(articleId)
  console.log(response)
  const articleUsername = response.user
  const articleUserPk = articleUsername["pk"] // 수정·삭제 기능 노출을 위한 게시글 작성자 pk 추출
  console.log(articleUserPk)

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

  // 게시글 수정·삭제 기능
  let token = localStorage.getItem("access")

  const currentUser = await fetch (`${backend_base_url}/users/dj-rest-auth/user`, {
    method: 'GET',
    headers: {
      'content-type':'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }) // 게시글 작성자와 현재 로그인 유저를 비교하기 위해 현재 로그인 유저의 정보 불러오기

  const currentUserData = await currentUser.json()
  const currentUserPk = await currentUserData["pk"]
  console.log(currentUserPk)

  // 작성자에게만 기능 노출
  const articleEdit = document.getElementById("article_edit")
  if (currentUserPk == articleUserPk) {
    articleEdit.style.display = "block"
  } else {
    articleEdit.style.display = "none"
  }
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

    if (likeButton.innerText === "🧡") {
      articleLikeCount = parseInt(articleLikeCount) + 1;
    } else if (likeButton.innerText === "🤍" && articleLikeCount > 0) {
      articleLikeCount = parseInt(articleLikeCount) - 1;
    }

    likeCount.innerText = articleLikeCount
    localStorage.setItem("articleLikeCount", String(articleLikeCount));
    return {response_json, articleLikeCount}
  } else {
    alert(response.status)
  }
}

// 게시글 수정

async function articlePut() {
  // 수정
}

// 게시글 삭제
async function articleDelete() {
  let token = localStorage.getItem("access")
  
  const confirmDelete = confirm("정말 삭제하시겠습니까?");
  if (confirmDelete) {
    const response = await fetch(`${backend_base_url}/articles/${articleId}/detail/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'DELETE',
    });

    if (response.status === 204) {
      alert("게시글이 삭제되었습니다.");
      window.location.href = `${frontend_base_url}/feed.html`;
    } else {
      alert("게시글 삭제에 실패했습니다.");
    }
  }
}