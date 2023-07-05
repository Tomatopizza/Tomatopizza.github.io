// 댓글
async function getComments(articleId) {
  const response = await fetch(
    `${backend_base_url}/articles/comment/${articleId}/`
  );

  if (response.status == 200) {
    response_json = await response.json();
    return response_json;
  } else {
    alert(response.status);
  }
}

async function postComment(articleId, newComment) {
  let token = localStorage.getItem("access");

  const response = await fetch(
    `${backend_base_url}/articles/comment/${articleId}/`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: newComment,
      }),
    }
  );

  if (response.status == 201) {
  response_json = await response.json();
  alert("댓글이 작성되었습니다.");
  return response_json;
  } else if (response.status == 400) {
    alert("댓글은 최대 100자까지만 작성하실 수 있습니다.")
  } else {
    alert("댓글 작성은 로그인이 필요합니다!")
  }
}

// 댓글 수정
async function commentPut(commentId) {
  const a = document.getElementsByClassName("comment_edit_complete");
  for (let i = 0; i < a.length; i++) {
    a[i].addEventListener("click", () => saveNewComment(a[i].dataset.id));
  } // 이해필요

  const beforeComment = document.getElementById(`comment_content${commentId}`);
  const editComment = document.getElementById(`comment_edit_${commentId}`);
  const editInput = document.getElementById(`comment_edit_input${commentId}`);
  editInput.value = beforeComment.innerText; // 이전 댓글 내용 그대로 표시
  editComment.style.display = "block";
}

// 수정된 댓글 저장
async function saveNewComment(commentId) {
  const newEditComment = document.getElementById(
    `comment_edit_input${commentId}`
  ).value; // 수정된 댓글을 받는 인풋창
  const newComment = document.getElementById(`comment_content${commentId}`);

  let token = localStorage.getItem("access");

  const confirmPut = confirm("댓글을 수정하시겠습니까?");
  if (confirmPut) {
    const response = await fetch(
      `${backend_base_url}/articles/comment/${articleId}/${commentId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          content: newEditComment,
        }),
      }
    );
  }
  alert("댓글이 수정되었습니다.");
  location.reload();
}

// 댓글 삭제
async function commentDelete(commentId) {
  let token = localStorage.getItem("access");

  const confirmDelete = confirm("댓글을 삭제하시겠습니까?");
  if (confirmDelete) {
    const response = await fetch(
      `${backend_base_url}/articles/comment/${articleId}/${commentId}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }
    );

    if (response.status === 204) {
      alert("댓글이 삭제되었습니다.");
      window.location.href = `${frontend_base_url}/template/article_detail.html?article_id=${articleId}`;
    } else {
      alert("댓글 삭제에 실패했습니다.");
    }
  }
}

// 피드페이지

async function getArticles(page) {
  const response = await fetch(`${backend_base_url}/articles/?page=${page}`);

  if (response.status == 200) {
    const response_json = await response.json();
    return response_json;
  } else {
    alert("불러오는데 실패했습니다.");
  }
}

// 상세페이지

async function getArticle(articleId) {
  const response = await fetch(
    `${backend_base_url}/articles/${articleId}/detail`
  ); // 각 게시글 상세보기

  if (response.status == 200) {
    response_json = await response.json();
    return response_json;
  } else {
    alert(response.status);
  }
}
