
// 댓글
async function getComments(articleId) {
  const response = await fetch(`${backend_base_url}/articles/comment/${articleId}/`,)

  if (response.status == 200) {
    response_json = await response.json()
    return response_json
  } else {
    alert(response.status)
  }
}

async function postComment(articleId, newComment) {

  let token = localStorage.getItem("access")

  const response = await fetch(`${backend_base_url}/articles/comment/${articleId}/`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
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

async function commentPut() {

}

async function commentDelete() {
  let token = localStorage.getItem("access");

  const confirmDelete = confirm("댓글을 삭제하시겠습니까?");
  if (confirmDelete) {
    const response = await fetch(`${backend_base_url}/articles/comment/${articleId}/${commentId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'DELETE',
    });

    if (response.status === 204) {
      alert("댓글이 삭제되었습니다.");
      window.location.href = `${frontend_base_url}/article_detail.html?article_id=${articleId}`;
    } else {
      alert("댓글 삭제에 실패했습니다.");
    }
  }

}

// 피드페이지

async function getArticles() {
  const response = await fetch(`${backend_base_url}/articles/`) // 공유한 게시글만 불러오기

  if (response.status == 200) {
    const response_json = await response.json()
    return response_json
  } else {
    alert("불러오는데 실패했습니다.")
  }
}

// 상세페이지

async function getArticle(articleId) {
  const response = await fetch(`${backend_base_url}/articles/${articleId}/detail`,)
  // const response = await fetch(`${backend_base_url}/articles/${articleId}/detail`,) // 각 게시글 상세보기

  if (response.status == 200) {
    response_json = await response.json()
    return response_json
  } else {
    alert(response.status)
  }
}