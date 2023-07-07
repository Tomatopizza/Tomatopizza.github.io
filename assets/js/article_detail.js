let articleId;
let commentId;

window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  articleId = urlParams.get("article_id");

  try {
    await loadArticles(articleId);
  } catch (error) {}
  await loadComments(articleId);
};
/**
 * 공유 게시글 불러오기
 */

async function loadArticles(articleId) {
  const payload = localStorage.getItem("payload");
  const response = await getArticle(articleId);
  const articleUsername = response.user;
  const articleUserPk = articleUsername["pk"];
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
    실외걷기: "실외 걷기",
    야외런닝: "야외 런닝",
    야외싸이클: "야외 싸이클",
    구기종목: "구기종목",
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
      "http://127.0.0.1:5500/assets/images/exercise.jpg"
    );
  }
  articleImage.appendChild(newImage);

  /**
   * 게시글 좋아요 상태 불러오기
   */

  const token = localStorage.getItem("access");

  const likeButton = document.getElementById("likes");
  const likeCount = document.getElementById("like_count");

  const likeResponse = await fetch(
    `${backend_base_url}/articles/${articleId}/like_article/`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const likeResponse_json = await likeResponse.json();
  if (token) {
    likeButton.innerText = likeResponse_json.message;
    likeCount.innerText = likeResponse_json.fluctuation;
  } else {
    likeButton.innerText = "🤍";
    const likeResponse = await fetch(
      `${backend_base_url}/articles/${articleId}/like_article/`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const likeResponse_json = await likeResponse.json(); //
    likeCount.innerText = likeResponse_json.fluctuation;
  }

  /**
   * 게시글 수정·삭제 기능
   */

  const parsedPayload = JSON.parse(payload);
  const currentUser = parsedPayload.user_id;

  const articleEdit = document.getElementById("article_edit");

  const articlePut = document.querySelector("#put");

  const articleDelete = document.querySelector("#delete");
 
  /**
   * 작성자에게만 기능 노출
   */

  if (currentUser == articleUserPk) {
    articleEdit.style.display = "grid";
    articleEdit.style.alignItems = "center";
    articleEdit.style.justifyContent = "center";
    articleEdit.style.gridTemplateColumns = "70px 60px 10px 60px";

    articlePut.style.display = "flex";
    articlePut.style.gridColumn = "2/3";
    articlePut.style.gridRow = "1/2";
    articlePut.innerText = "수정";

    articleDelete.style.display = "flex";
    articleDelete.style.gridColumn = "4/5";
    articleDelete.style.gridRow = "1/2";
    articleDelete.innerText = "삭제";
  } else {
    articleEdit.style.display = "none";
  }
}

/**
 * 댓글 불러오기
 */

async function loadComments(articleId) {
  const payload = localStorage.getItem("payload");

  const response = await getComments(articleId);

  /**
  * 댓글 edit기능을 위한 유저 식별
  */ 

  try {
    const parsedPayload = JSON.parse(payload);
    const currentUser = parsedPayload.user_id;
  } catch {
    const commentList = document.getElementById("comment_list");
    commentList.innerHTML = "";
    response.forEach((comment) => {
      commentId = comment["id"];
      
  /**
  * 프로필 이미지 가져오기
  */
      const User = comment.user;
      const UserAvatar = User.avatar;

      commentList.innerHTML += `<div class="comment-wrapper">
        <div class="media">
          <div class="comment-profile-img">
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" class="mr-3" alt="프로필 이미지" width=50 height=50>
          </div>
          <div class="comment_username">
            <h5 class="mt-0 mb-1">${comment.username}</h5>
          </div>
          <div class="comment_content">
            <p id="comment_content${commentId}">${comment.content}</p>
          </div>
          <div class="comment_like_icon">  
            <button class="btn btn_org" id="comment_Like" onclick="commentLike()">🤍</button>
          </div>
          <div class="comment_like_icon_count">  
            <div id="comment_like_count">${comment.like_count}</div>
          </div>  
        </div>
      </div>`;
    });
  }
  const parsedPayload = JSON.parse(payload);
  const currentUser = parsedPayload.user_id;
  const commentList = document.getElementById("comment_list");
  commentList.innerHTML = "";

  /**
  * 댓글 작성하기
  */
  response.forEach((comment) => {
    commentId = comment["id"];
  /**
  * 프로필 이미지 가져오기
  */
    const User = comment.user;
    let avatar = null;

    if (comment.user.avatar) {
      avatar = comment.user.avatar;
    } else {
      avatar =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
    }

    if (comment.user === currentUser) {
      commentList.innerHTML += `<div class="comment-wrapper">
          <div class="media">
            <div class="comment-profile-img">
              <img src="${avatar}" alt="프로필 이미지" width=50 height=50>
            </div>
            <div class="comment_username">
              <h5 class="mt-0 mb-1">${comment.username}</h5>
            </div>
            <div class="comment_content"> 
              <p id="comment_content${commentId}">${comment.content}</p>
            </div>
            <div class="comment_like_icon">  
              <button class="btn btn_org" id="comment_Like${commentId}" class="commentImg" onclick="commentLike(${commentId})">🤍</button>
            </div>
            <div class="comment_like_icon_count">  
              <div id="comment_like_count${commentId}">${comment.like_count}</div>
            </div>
            <div class="comment_btn_box">
              <div id="comment_edit${commentId}" data-value="${commentId}">
                <button id="comment_put" onclick="commentPut(${commentId})" class="btn btn-outline-dark">수정</button>
                <button id="comment_delete" onclick="commentDelete(${commentId})" class="btn btn-outline-dark" >삭제</button>
              </div>
            </div>
          </div>

        </div>`;
    } else {
      commentList.innerHTML += `<div class="comment-wrapper">
          <div class="media">
            <div class="comment-profile-img">
              <img src="${avatar}" alt="프로필 이미지" width=50 height=50>
            </div>
            <div class="comment_username">
              <h5 class="mt-0 mb-1">${comment.username}</h5>
            </div>
            <div class="comment_content">
              <p id="comment_content${commentId}">${comment.content}</p>
            </div>
            <div class="comment_like_icon">
              <button class="btn btn_org" id="comment_Like${commentId}" class="commentImg" onclick="commentLike(${commentId})">🤍</button>
            </div>
            <div class="comment_like_icon_count">  
              <div id="comment_like_count${commentId}">${comment.like_count}</div>
            </div>
          </div>
        </div>`;
    }
    /**
    * 댓글 수정창
    */ 

    const commentEditForm = document.createElement("div");
    commentEditForm.setAttribute("id", `comment_edit_${commentId}`);
    commentEditForm.setAttribute("class", "comment_edit_form");
    commentEditForm.style.display = "none";

    
    const commentEditInput = document.createElement("textarea");
    commentEditInput.setAttribute("id", `comment_edit_input${commentId}`);
    commentEditInput.setAttribute("type", "text");
    commentEditForm.appendChild(commentEditInput);
    
    commentEditForm.style.alignItems="center";
    commentEditInput.style.width = "550px";
    commentEditInput.style.fontSize = "16px";
    commentEditInput.style.resize = "none";

    commentEditInput.style.border = "1px solid black";

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

  /**
  * 댓글 좋아요 표시
  */ 
    const likeButton = document.getElementById(`comment_Like${commentId}`);
    if (comment.likes.includes(currentUser)) {
      likeButton.innerText = "🧡";
    }
  });
}

/**
  * 댓글 작성하기 버튼
  */ 
async function submitComment() {
  const commentElement = document.getElementById("new_comment");
  const newComment = commentElement.value;
  const response = await postComment(articleId, newComment);
  commentElement.value = "";

  const textLengthCheck = document.getElementById("textLengthCheck")
  textLengthCheck.innerText = "(0 / 100)"

  loadComments(articleId);
}

async function loadFeed() {
  window.location.href = "feed.html";
}

function articleLoadPut() {
  window.location.href = `${frontend_base_url}/template/article_update2.html?article_id=${articleId}`;
}

/**
* 게시글 좋아요 버튼
*/ 

async function articleLike() {
  let token = localStorage.getItem("access");
  const likeButton = document.getElementById("likes");
  const likeCount = document.getElementById("like_count");

  const response = await fetch(
    `${backend_base_url}/articles/${articleId}/like_article/`,
    {
    /**
     * 게시글 좋아요/좋아요취소 요청
     */ 
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const response_json = await response.json();

  if (response.status == 200) {
    if (likeButton.innerText === "🧡") {
      likeButton.innerText = "🤍";
      likeCount.innerText = response_json.fluctuation;
      alert("좋아요 취소");
    } else if (likeButton.innerText === "🤍") {
      likeButton.innerText = "🧡";
      likeCount.innerText = response_json.fluctuation;
      alert("이 게시물을 좋아합니다");
    }
  } else {
    alert("로그인 해주세요!");
  }
}

/**
  * 게시글 삭제
  */ 
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

async function commentLike(commentId) {
  let token = localStorage.getItem("access");
  const likeButton = document.getElementById(`comment_Like${commentId}`);
  const likeCount = document.getElementById(`comment_like_count${commentId}`);
  try {
    const response = await fetch(
      `${backend_base_url}/articles/comment/${commentId}/like_comment/`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response_json = await response.json();

    if (response.status === 200) {
      if (likeButton.innerText === "🧡") {
        likeButton.innerText = "🤍";
        likeCount.innerText = response_json.comment_like;
        alert("좋아요 취소");
      } else if (likeButton.innerText === "🤍") {
        likeButton.innerText = "🧡";
        likeCount.innerText = response_json.comment_like;
        alert("이 댓글을 좋아합니다.");
      }
    }
  } catch {
    alert("로그인 해주세요!");
  }
}

