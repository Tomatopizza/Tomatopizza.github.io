const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

async function getComments(articleId) {
  const response = await fetch(`${backend_base_url}/articles/comment/2/`,)

  if (response.status == 200) {
    response_json =await response.json()
    return response_json
  } else {
    alert(response.status)
  }
}

async function postComment(articleId, newComment) {

  let token = localStorage.getItem("access")

  const response = await fetch(`${backend_base_url}/articles/comment/2/`, {
    method: 'POST',
    headers: {
      'content-type':'application/json',
      'Authorization': `bearer ${token}`
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
  const response = await fetch(`${backend_base_url}/articles/${articleId}/`,)

  if (response.status == 200) {
    response_json = await response.json()
    return response_json
  } else {
    alert(response.status)
  }
}