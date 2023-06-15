console.log("good?")

window.onload = async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("article_id");
  console.log(articleId)

  const response = await getArticle(articleId)
  console.log(response)

  const articleTitle = document.getElementById("article_title")
  const articleContent = document.getElementById("article_content")
  const articleImage = document.getElementById("article_image")

  articleTitle.innerText = response.title
  articleContent.innerText = response.content
  const newImage = document.createElement("img")
  console.log(`${response.image}`)

  if(response.image) {
  newImage.setAttribute("src", `${backend_base_url}${response.image}`)
  } else {
    newImage.setAttribute("src", "https://health.clevelandclinic.org/wp-content/uploads/sites/3/2022/04/exerciseHowOften-944015592-770x533-1-650x428.jpg")
  }
  articleImage.appendChild(newImage)
  

}