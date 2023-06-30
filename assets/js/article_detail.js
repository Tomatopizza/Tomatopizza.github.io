let articleId;
let commentId;


window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  articleId = urlParams.get("article_id");

  try {
    await loadArticles(articleId);
  } catch (error) {}
  // await loadArticles(articleId);
  await loadComments(articleId);
};

// 공유 게시글 불러오기

async function loadArticles(articleId) {
  const payload = localStorage.getItem("payload"); // 현재 로그인 유저 정보
  const response = await getArticle(articleId);
  const articleUsername = response.user;
  const articleUserPk = articleUsername["pk"]; // 수정·삭제 기능 노출을 위한 게시글 작성자 pk 추출
  const articleUser = document.getElementById("article_user");
  const articleContent = document.getElementById("article_content");
  const articleImage = document.getElementById("article_image");
  const articleDay = document.getElementById("article_day");
  const articleCategory = document.getElementById("article_category");
  const articleIn = document.getElementById("article_in");
  const articleOut = document.getElementById("article_out");
  const articleTime = document.getElementById("article_time");
  const articleStatus = document.getElementById("article_status");

  articleUser.innerText = articleUsername.username;
  articleContent.innerText = response.content;
  articleDay.innerText = response.select_day;

  if (response.category === "in") {
    articleCategory.innerText = "실내 운동";
  } else {
    articleCategory.innerText = "실외 운동";
  }

  const inSubCategoryMap = {
    걷기: "실내 걷기",
    뛰기: "트레드밀",
    자전거: "실내 싸이클",
    상체: "상체 웨이트",
    하체: "하체 웨이트",
    수영: "수영",
    코어: "실내 코어운동",
  };

  articleIn.innerText =
    inSubCategoryMap[response.in_subcategory] || response.in_subcategory;

  const OutSubCategoryMap = {
    걷기: "실내 걷기",
    뛰기: "트레드밀",
    자전거: "실내 싸이클",
    상체: "상체 웨이트",
    하체: "하체 웨이트",
    수영: "수영",
    코어: "실내 코어운동",
  };

  articleOut.innerText =
    OutSubCategoryMap[response.out_subcategory] || response.out_subcategory;

  articleTime.innerText = response.exercise_time;

  if (response.check_status === true) {
    articleStatus.innerText = "오운완!";
  } else {
    articleStatus.innerText = "아직 계획 중이에요";
  }
  const newImage = document.createElement("img");

  if (response.image) {
    newImage.setAttribute("src", `${backend_base_url}${response.image}`);
  } else {
    newImage.setAttribute(
      "src",
      "https://health.clevelandclinic.org/wp-content/uploads/sites/3/2022/04/exerciseHowOften-944015592-770x533-1-650x428.jpg"
    );
  }
  articleImage.appendChild(newImage);

  // 게시글 좋아요 상태 불러오기

  const token = localStorage.getItem("access")

  const likeButton = document.getElementById("likes");
  const likeCount = document.getElementById("like_count");

  const likeResponse = await fetch(
    `${backend_base_url}/articles/${articleId}/like_article/`,
    {
      // 게시글 좋아요 상태와 좋아요 수 가져오기
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,

      },
    }
  );

  const likeResponse_json = await likeResponse.json(); // 제이슨으로 변환
  if (token) {
    likeButton.innerText = likeResponse_json.message;
    likeCount.innerText = likeResponse_json.fluctuation;
  } else {
    likeButton.innerText = "🤍";
    const likeResponse = await fetch(
      `${backend_base_url}/articles/${articleId}/like_article/`,
      {
        // 게시글 좋아요 상태와 좋아요 수 가져오기
        method: "GET",
        headers: {
          "content-type": "application/json",
  
        },
      }
    );
    const likeResponse_json = await likeResponse.json(); //
    likeCount.innerText = likeResponse_json.fluctuation
  }


  // 게시글 수정·삭제 기능

  const parsedPayload = JSON.parse(payload); // 현재 로그인 유저 정보
  const currentUser = parsedPayload.user_id;

  const articleEdit = document.getElementById("article_edit"); // 게시글 수정·삭제창
  // 작성자에게만 기능 노출
  if (currentUser == articleUserPk) {
    articleEdit.style.display = "block";
  } else {
    articleEdit.style.display = "none";
  }
}

// 댓글

async function loadComments(articleId) {
  const payload = localStorage.getItem("payload"); // 현재 로그인 유저 정보

  const response = await getComments(articleId); // 해당 아티클의 댓글

  // 댓글 edit기능을 위한 유저 식별

  try {
    const parsedPayload = JSON.parse(payload); // 현재 로그인 유저 정보
    const currentUser = parsedPayload.user_id;
  } catch {
    const commentList = document.getElementById("comment_list");
    commentList.innerHTML = "";
    response.forEach((comment) => {
      commentId = comment["id"];
      // 프로필 이미지 가져오기
      const User = comment.user;
      const UserAvatar = User.avatar;

      commentList.innerHTML +=
      `<li class="media d-flex mb-3">
        <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" class="mr-3" alt="프로필 이미지" width=50 height=50>
        <div class="media-body">
          <h5 class="mt-0 mb-1">${comment.username}</h5>
          <p id="comment_content${commentId}">${comment.content}</p>
        </div>
        <div id="commentLikes" style="display: flex;">
          <button class="btn btn_org" id="comment_Like" onclick="commentLike()">🤍</button>
          <div id="comment_like_count" style="text-align: center;">${comment.like_count}</div>
        </div>
      </li>`;
    })
  }
  const parsedPayload = JSON.parse(payload); // 현재 로그인 유저 정보
  const currentUser = parsedPayload.user_id;
  const commentList = document.getElementById("comment_list");
  commentList.innerHTML = "";


  // 댓글 작성하기
  response.forEach((comment) => {
    commentId = comment["id"];
    // 프로필 이미지 가져오기
    const User = comment.user;
    let avatar = null

    if (comment.user.avatar) {
      avatar = comment.user.avatar
    } else {
      avatar = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    }
    // 유저 프로필 이미지로 분할
    if (comment.user === currentUser) {
      commentList.innerHTML +=
        `<li class="media d-flex mb-3">
          <img src="${avatar}" alt="프로필 이미지" width=50 height=50>
          <div class="media-body">
            <h5 class="mt-0 mb-1">${comment.username}</h5>
            <p id="comment_content${commentId}">${comment.content}</p>
          </div>
          <div id="commentLikes" style="display: flex;">
            <button class="btn btn_org" id="comment_Like${commentId}" class="commentImg" onclick="commentLike(${commentId})">🤍</button>
            <div id="comment_like_count${commentId}" style="text-align: center;">${comment.like_count}</div>
          </div>
          <div id="comment_edit${commentId}" data-value="${commentId}">
            <button id="comment_put" onclick="commentPut(${commentId})" class="btn btn_org" style="margin: auto; display: block; color:grey;">수정</button>
            <button id="comment_delete" onclick="commentDelete(${commentId})" class="btn btn_org" style="margin: auto; display: block; color:grey;">삭제</button>
          </div>

        </li>`;
    } else {
      commentList.innerHTML +=
        `<li class="media d-flex mb-3">
          <img src="${avatar}" alt="프로필 이미지" width=50 height=50>
          <div class="media-body">
            <h5 class="mt-0 mb-1">${comment.username}</h5>
            <p id="comment_content${commentId}">${comment.content}</p>
          </div>
          <div id="commentLikes" style="display: flex;">
            <button class="btn btn_org" id="comment_Like${commentId}" class="commentImg" onclick="commentLike(${commentId})">🤍</button>
            <div id="comment_like_count${commentId}" style="text-align: center;">${comment.like_count}</div>
          </div>
        </li>`;
    }
    // 댓글 수정창
    const commentEditForm = document.createElement("div");
    commentEditForm.setAttribute("id", `comment_edit_${commentId}`);
    commentEditForm.setAttribute("class", "comment_edit_form");
    commentEditForm.style.display = "none";

    const commentEditInput = document.createElement("input");
    commentEditInput.setAttribute("id", `comment_edit_input${commentId}`);
    commentEditInput.setAttribute("type", "text");
    commentEditForm.appendChild(commentEditInput);

    const commentEditComplete = document.createElement("button");
    commentEditComplete.setAttribute("id", `comment_edit_complete${commentId}`);
    commentEditComplete.setAttribute("data-id", `${commentId}`); // commentId를 넘기기 위함.
    commentEditComplete.innerText = "수정완료";
    commentEditComplete.setAttribute(
      "class",
      "btn btn-dark comment_edit_complete"
    );
    commentEditForm.appendChild(commentEditComplete);

    commentList.appendChild(commentEditForm);

    // 댓글 좋아요 표시
    const likeButton = document.getElementById(`comment_Like${commentId}`);
    if (comment.likes.includes(currentUser)) {
      likeButton.innerText = "🧡"
    }
  }
  )
}
// array 안에서 값이 있는지 찾을 때는  array.includes(찾는 값) -> true or false

// 댓글 작성하기 버튼
async function submitComment() {
  const commentElement = document.getElementById("new_comment");
  const newComment = commentElement.value;
  const response = await postComment(articleId, newComment);
  commentElement.value = ""; // 댓글 작성 후 작성칸 초기화

  loadComments(articleId);
}

async function loadFeed() {
  window.location.href = "feed.html";
}

function articleLoadPut() {
  window.location.href = `${frontend_base_url}/template/article_update2.html?article_id=${articleId}`;
}

// 게시글 좋아요 버튼

async function articleLike() {
  let token = localStorage.getItem("access");
  const likeButton = document.getElementById("likes");
  const likeCount = document.getElementById("like_count");

  const response = await fetch(`${backend_base_url}/articles/${articleId}/like_article/`,{
    // 게시글 좋아요/좋아요취소 요청
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const response_json = await response.json();

    if (response.status == 200) {
      if (likeButton.innerText === "🧡") {
        likeButton.innerText = "🤍";
        likeCount.innerText = response_json.fluctuation;
        alert("좋아요 취소");
      } else if (likeButton.innerText === "🤍") {
        likeButton.innerText = "🧡";
        likeCount.innerText = response_json.fluctuation;
        alert("좋아요");
      }
    } else {
      alert("로그인 해주세요!")
    }
}

// 게시글 삭제
async function articleDelete() {
  let token = localStorage.getItem("access");

  const confirmDelete = confirm("게시글을 삭제 하시겠습니까?");
  if (confirmDelete) {
    const response = await fetch(
      `${backend_base_url}/articles/${articleId}/detail/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }
    );

    if (response.status === 204) {
      alert("게시글이 삭제되었습니다.");
      window.location.href = `${frontend_base_url}/template/feed.html`;
    } else {
      alert("게시글 삭제에 실패했습니다.");
    }
  }
}

// async function getCommentLike(commentId) {
//   const response = await fetch(`${backend_base_url}/articles/comment/${commentId}/like_comment/`,)

//   if (response.status == 200) {
//     response_json = await response.json();
//     return response_json;
//   } else {
//     alert(response.status);
//   }
// }

async function commentLike(commentId) {
  let token = localStorage.getItem("access");
  const likeButton = document.getElementById(`comment_Like${commentId}`);
  const likeCount = document.getElementById(`comment_like_count${commentId}`);
  try {
  const response = await fetch(`${backend_base_url}/articles/comment/${commentId}/like_comment/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const response_json = await response.json();
  console.log(response_json);
  console.log(response.status)

 
    if (response.status === 200) {
      if (likeButton.innerText === "🧡") {
        likeButton.innerText = "🤍";
        likeCount.innerText = response_json.comment_like;
        alert("좋아요 취소");
      } else if (likeButton.innerText === "🤍") {
        likeButton.innerText = "🧡";
        likeCount.innerText = response_json.comment_like;
        alert("좋아요");
      }
    }
  } catch {
    alert("로그인 해주세요!")
  }
}

 
