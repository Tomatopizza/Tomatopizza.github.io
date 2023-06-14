/* article_detail.js 가 나오면 병합하고 삭제 */

let articleId = 2 // 임시

async function loadComments() {
  
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('article_id');
  // article_detail.js 내에서 window.onload에 넣고 상속하여 사용. loadArticles도 마찬가지

  const response = await getComments(articleId); // 해당 아티클의 댓글
  console.log(response)

  const commentList =document.getElementById("comment_list")

  response.forEach(comment => {
    commentList.innerHTML += `
    <li class="media d-flex mb-3">
    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" class="mr-3" alt="프로필 이미지" width=50 height=50>
    <div class="media-body">
      <h5 class="mt-0 mb-1">${comment.user}</h5>
      <p>${comment.content}</p>
    </div>
  </li>`
  });
}

async function submitComment() {
  const newComment = document.getElementById("new_comment").value
  const response = await postComment(articleId, newComment)
  console.log(response)
}

window.onload = async function() {
  await loadComments(); // 병합이후 article_id 상속
}
