let articleId
let commentId

window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  articleId = urlParams.get("article_id");

  await loadArticles(articleId);
  await loadComments(articleId);
}


// 공유 게시글 불러오기

async function loadArticles(articleId) {
  const payload = localStorage.getItem("payload"); // 현재 로그인 유저 정보
  const response = await getArticle(articleId);
  const articleUsername = response.user;
  const articleUserPk = articleUsername["pk"]; // 수정·삭제 기능 노출을 위한 게시글 작성자 pk 추출
  console.log(articleUsername)
  const articleUser = document.getElementById("article_user");
  const articleContent = document.getElementById("article_content");
  const articleImage = document.getElementById("article_image");


  articleUser.innerText = articleUsername.username;
  // articleContent.innerText = response.content;
  const newImage = document.createElement("img");


  if (response.image) {
    newImage.setAttribute("width", "100%");
    newImage.setAttribute("src", `${backend_base_url}${response.image}`);
  } else {
    newImage.setAttribute("width", "100%");
    newImage.setAttribute("src", "https://health.clevelandclinic.org/wp-content/uploads/sites/3/2022/04/exerciseHowOften-944015592-770x533-1-650x428.jpg");
  }
  articleImage.appendChild(newImage);

  // 좋아요 상태 불러오기

  let token = localStorage.getItem("access");
  const likeButton = document.getElementById("likes");
  const likeCount = document.getElementById("like_count");

  const likeResponse = await fetch(`${backend_base_url}/articles/${articleId}/like_article/`, { // 게시글 좋아요 상태와 좋아요 수 가져오기
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const likeResponse_json = await likeResponse.json() // 제이슨으로 변환
  // console.log(likeResponse_json.fluctuation) // 좋아요 갯수

  likeButton.innerText = likeResponse_json.message
  likeCount.innerText = likeResponse_json.fluctuation

  // 게시글 수정·삭제 기능

  const parsedPayload = JSON.parse(payload); // 현재 로그인 유저 정보
  const currentUser = parsedPayload.user_id

  const articleEdit = document.getElementById("article_edit"); // 게시글 수정·삭제창
  // 작성자에게만 기능 노출
  if (currentUser == articleUserPk) {
    articleEdit.style.display = "block";
  } else {
    articleEdit.style.display = "none";
  }
  // const currentUser = await fetch(`${backend_base_url}/users/dj-rest-auth/`, {
  //   method: 'GET',
  //   headers: {
  //     'content-type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  // }); // 게시글 작성자와 현재 로그인 유저를 비교하기 위해 현재 로그인 유저의 정보 불러오기
  
  // console.log(currentUser)
  // const currentUserData = await currentUser.json();
  // console.log(currentUserData)
  // const currentUserPk = await currentUserData["user_id"];

  // // 작성자에게만 기능 노출
  // const articleEdit = document.getElementById("article_edit");
  // if (currentUserPk == articleUserPk) {
  //   articleEdit.style.display = "block";
  // } else {
  //   articleEdit.style.display = "none";
  // }
}

// 댓글

async function loadComments(articleId) {

  const payload = localStorage.getItem("payload"); // 현재 로그인 유저 정보

  const response = await getComments(articleId); // 해당 아티클의 댓글
  let articleCommentCount = response["length"]
  console.log(articleCommentCount) // 댓글 갯수

  // 댓글 edit기능을 위한 유저 식별

  const parsedPayload = JSON.parse(payload); // 현재 로그인 유저 정보
  const currentUser = parsedPayload.user_id

  // let token = localStorage.getItem("access");

  // const currentUser = await fetch(`${backend_base_url}/users/dj-rest-auth/user`, {
  //   method: 'GET',
  //   headers: {
  //     'content-type': 'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   },
  // });

  // const currentUserData = await currentUser.json();
  // const currentUserPk = await currentUserData["pk"];

  const commentList = document.getElementById("comment_list");
  commentList.innerHTML = ""; // 새로운 댓글을 포함한 댓글창을 새로고침 하지 않고 보여주기

  // 댓글 작성하기
  response.forEach(comment => {
    commentId = comment["id"]

    // 프로필 이미지 가져오기
    const User = comment.user;
    const UserAvatar = User.avatar;

    // 유저 프로필 이미지로 분할
    if (UserAvatar) {
      if (comment.user === currentUser) {
        commentList.innerHTML +=
          `<li class="media d-flex mb-3">
          <img src="${UserAvatar}" alt="프로필 이미지" width=50 height=50>
          <div class="media-body">
            <h5 class="mt-0 mb-1">${comment.user}</h5>
            <p id="comment_content${commentId}">${comment.content}</p>
          </div>
          <div id="comment_edit${commentId}" data-value="${commentId}">
            <button id="comment_put" onclick="commentPut(${commentId})" class="btn btn-primary" style="margin: auto; display: block;">수정</button>
            <button id="comment_delete" onclick="commentDelete(${commentId})" class="btn btn-primary" style="margin: auto; display: block;">삭제</button>
          </div>
        </li>`;
      }
      else {
        commentList.innerHTML +=
          `<li class="media d-flex mb-3">
          <img src="${UserAvatar}" alt="프로필 이미지" width=50 height=50>
          <div class="media-body">
            <h5 class="mt-0 mb-1">${comment.user}</h5>
            <p id="comment_content${commentId}">${comment.content}</p>
          </div>
        </li>`}
    } else {
      if (comment.user === currentUser) {
        commentList.innerHTML +=
          `<li class="media d-flex mb-3">
          <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" class="mr-3" alt="프로필 이미지" width=50 height=50>
          <div class="media-body">
            <h5 class="mt-0 mb-1">${comment.user}</h5>
            <p id="comment_content${commentId}">${comment.content}</p>
          </div>
          <div id="comment_edit${commentId}">
            <button id="comment_put" onclick="commentPut(${commentId})" class="btn btn-primary" style="margin: auto; display: block;">수정</button>
            <button id="comment_delete" onclick="commentDelete(${commentId})" class="btn btn-primary" style="margin: auto; display: block;">삭제</button>
          </div>
        </li>`;
      } else {
        commentList.innerHTML +=
          `<li class="media d-flex mb-3">
        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" class="mr-3" alt="프로필 이미지" width=50 height=50>
        <div class="media-body">
          <h5 class="mt-0 mb-1">${comment.user}</h5>
          <p id="comment_content${commentId}">${comment.content}</p>
        </div>`}
    }

    // 댓글 수정창
    const commentEditForm = document.createElement("div")
    commentEditForm.setAttribute("id", `comment_edit_${commentId}`)
    commentEditForm.setAttribute("class", "comment_edit_form")
    commentEditForm.style.display = "none"

    const commentEditInput = document.createElement("input")
    commentEditInput.setAttribute("id", `comment_edit_input${commentId}`)
    commentEditInput.setAttribute("type", "text")
    commentEditForm.appendChild(commentEditInput)

    const commentEditComplete = document.createElement("button")
    commentEditComplete.setAttribute("id", `comment_edit_complete${commentId}`)
    commentEditComplete.setAttribute("data-id", `${commentId}`) // commentId를 넘기기 위함.
    commentEditComplete.innerText = "수정완료"
    commentEditComplete.setAttribute("class", "btn btn-primary comment_edit_complete")
    commentEditForm.appendChild(commentEditComplete)

    // const commentEditCancel = document.createElement("button")
    // commentEditCancel.innerText = "취소"
    // commentEditCancel.setAttribute("class", "btn btn-primary")
    // commentEditCancel.addEventListener("click", () => cancelNewComment(commentId))
    // commentEditForm.appendChild(commentEditCancel)

    commentList.appendChild(commentEditForm)
  });

}


// 댓글 작성하기 버튼
async function submitComment() {
  const commentElement = document.getElementById("new_comment");
  const newComment = commentElement.value;
  const response = await postComment(articleId, newComment);
  commentElement.value = ""; // 댓글 작성 후 작성칸 초기화

  loadComments(articleId);
}

async function loadFeed() {
  window.location.href = "feed.html"
}

function articleLoadPut() {
  window.location.href = `${frontend_base_url}/article_update2.html?article_id=${articleId}`;
}

// 게시글 좋아요 버튼

async function articleLike() {
  let token = localStorage.getItem("access");
  const likeButton = document.getElementById("likes");
  const likeCount = document.getElementById("like_count");

  const response = await fetch(`${backend_base_url}/articles/${articleId}/like_article/`, { // 게시글 좋아요/좋아요취소 요청
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });

  const response_json = await response.json();
  console.log(response_json)


  if (response.status == 200) {
    if (likeButton.innerText === "🧡") {
      likeButton.innerText = "🤍";
      likeCount.innerText = response_json.fluctuation;
      alert("좋아요 취소")

    } else if (likeButton.innerText === "🤍") {
      likeButton.innerText = "🧡";
      likeCount.innerText = response_json.fluctuation;
      alert("좋아요")
    }

  }
}






// 게시글 삭제
async function articleDelete() {
  let token = localStorage.getItem("access");

  const confirmDelete = confirm("게시글을 삭제 하시겠습니까?");
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

