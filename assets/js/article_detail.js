console.log("good?")

window.onload = async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("article_id");
  console.log(articleId)

  const response = await getArticle(articleId)
  console.log(response)
}