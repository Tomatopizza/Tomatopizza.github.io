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