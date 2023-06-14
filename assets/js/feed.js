function articleDetail(article_id) {
  window.location.href = `${frontend_base_url}/article_detail.html?article_id=${article_id}`
}

window.onload = async function loadArticles() {
  articles = await getArticles()
  console.log(articles)

  const article_list = document.getElementById("article_list")

  articles.forEach(article => {
    const newCol = document.createElement("div"); // div 생성
    newCol.setAttribute("class", "col") // class 부여
    newCol.setAttribute("onclick", `articleDetail(${article.id})`)

    const newCard = document.createElement("div")
    newCard.setAttribute("class", "card") 
    newCard.setAttribute("id", article.id) // id로 식별

    newCol.appendChild(newCard) // newCol에 newCard 넣기

    const articleImage = document.createElement("img")
    articleImage.setAttribute("class", "card-img-top")

    if(article.image) {
      articleImage.setAttribute("src", `${backend_base_url}${article.image}`)
    }else{
      articleImage.setAttribute("src", "https://health.clevelandclinic.org/wp-content/uploads/sites/3/2022/04/exerciseHowOften-944015592-770x533-1-650x428.jpg")
    }
    
    
    newCard.appendChild(articleImage)

    const newCardBody = document.createElement("div")
    newCardBody.setAttribute("class", "card-body")
    newCard.appendChild(newCardBody)

    const newCardTitle = document.createElement("div")
    newCardTitle.setAttribute("class", "card-title")
    newCardTitle.innerText = article.title
    newCardBody.appendChild(newCardTitle)

    article_list.appendChild(newCol) // article_list에 newCol 넣기
  })
}