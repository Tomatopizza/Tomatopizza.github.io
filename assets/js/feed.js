function articleDetail(article_id) {
  window.location.href = `${frontend_base_url}/template/article_detail.html?article_id=${article_id}`;
}

const renderArticles = (articles) => {
  const article_list = document.getElementById("article_list");
  article_list.innerHTML = "";

  articles.forEach((article) => {
    const newCol = document.createElement("div");
    newCol.setAttribute("class", "col"); 
    newCol.setAttribute("onclick", `articleDetail(${article.id})`);
    article_list.appendChild(newCol); 

    const newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    newCard.setAttribute("id", article.id); 
    newCol.appendChild(newCard); 

    const imageSize = document.createElement("div");
    imageSize.setAttribute("class", "img-size");
    newCard.appendChild(imageSize);

    const articleImage = document.createElement("img");
    articleImage.setAttribute("class", "card-img"); 

    if (article.image) {
      articleImage.setAttribute("src", `${backend_base_url}${article.image}`);
    } else {
      articleImage.setAttribute(
        "src",
        "http://127.0.0.1:5500/assets/images/exercise.jpg"
      );
    }

    imageSize.appendChild(articleImage);
    const newCardBody = document.createElement("div");
    newCardBody.setAttribute("class", "card-body"); // 게시글
    newCard.appendChild(newCardBody);

    const newCardTitleBox = document.createElement("div");
    newCardTitleBox.setAttribute("class", "card-title-box");
    newCardBody.appendChild(newCardTitleBox);

    const newCardTitle = document.createElement("li");
    newCardTitle.setAttribute("class", "card-title");
    newCardTitle.innerText = article.content;
    newCardTitleBox.appendChild(newCardTitle);

    const articleWriter = document.createElement("p");
    articleWriter.innerText = article.user;
    newCardTitleBox.appendChild(articleWriter);

    const newText = document.createElement("div"); 
    newText.setAttribute("class", "collector");
    newCardBody.appendChild(newText);

    const likeCount = document.createElement("li");
    likeCount.setAttribute("class", "like_count");
    likeCount.innerText = `${article.like_count}`; 
    newText.appendChild(likeCount);

    const commentCount = document.createElement("li");
    commentCount.setAttribute("class", "comment_count");
    commentCount.innerText = `${article.comment_count || 0}`; 
    newText.appendChild(commentCount);

    const createdAt = document.createElement("li");
    createdAt.setAttribute("class", "created_at");
    const currentTime = new Date(); 
    const createdTime = new Date(article.created_at); 
    const timeDiff = Math.floor((currentTime - createdTime) / (1000 * 60)); 

    let displayTime;
    if (timeDiff < 60) {
      displayTime = `${timeDiff} 분 전`; 
    } else if (timeDiff < 1440) {
      displayTime = `${Math.floor(timeDiff / 60)} 시간 전`; 
    } else {
      displayTime = `${Math.floor(timeDiff / 1440)} 일 전`; 
    }

    createdAt.innerText = `${displayTime}`; 
    newText.appendChild(createdAt);
  });
};

async function getAllArticles(articleId) {
  const response = await fetch(`${backend_base_url}/articles/feed/`); // 각 게시글 상세보기

  if (response.status == 200) {
    response_jsonall = await response.json();
    return response_jsonall;
  } else {
    alert(response.status);
  }
}

async function ArticlesPages() {
  const allArticles = await getAllArticles();
  const totalArticles = allArticles.length;

  const articlesPerPage = 5;
  const totalPages = Math.ceil(totalArticles / articlesPerPage);

  return totalPages;
}

/**
  * 페이지네이션
  */ 
const loadArticles = async (page = 1) => {
  const totalPages = Math.ceil((await getAllArticles()).length / 5);

  const articles = await getArticles(page);

  renderArticles(articles);

  const onePageElement = document.getElementById("onepage");
  const prePageElement = document.getElementById("prepage");
  const currentPageElement = document.getElementById("currentpage");
  const nextPageElement = document.getElementById("nextpage");
  const totalPageElement = document.getElementById("totalpage");

  currentPageElement.textContent = `${page}`;

  if (page >= 4) {
    onePageElement.style.display = "block";
    onePageElement.textContent = `1 ..`;
    onePageElement.addEventListener("click", () => {
      pageNumber = 1; 
      loadArticles(pageNumber);
    });
  } else if (page == 3) {
    onePageElement.style.display = "block";
    onePageElement.textContent = `1`;
    onePageElement.addEventListener("click", () => {
      pageNumber = 1; 
      loadArticles(pageNumber);
    });
  } else {
    onePageElement.style.display = "none";
  }
  if (page > 1) {
    prePageElement.style.display = "block";
    prePageElement.textContent = `${page - 1}`;
  } else {
    prePageElement.style.display = "none";
  }
  if (page >= totalPages - 1) {
    nextPageElement.style.display = "none";
  } else {
    nextPageElement.style.display = "block";
    nextPageElement.textContent = `${page + 1}`;
  }

  if (page == totalPages) {
    totalPageElement.style.display = "none";
  } else {
    totalPageElement.style.display = "block";
    totalPageElement.textContent = `마지막페이지:${totalPages}`;
  }

  if (page > totalPages) {
    alert("페이지가 존재하지 않습니다!");
    location.reload();
  }
  if (page == 0) {
    alert("페이지가 존재하지 않습니다!");
    location.reload();
  }
  if (totalPages == 0) {
    alert("홈화면으로 이동합니다.");
    location.href = `${frontend_base_url}/template/index.html`;
  }
};

let totalPages;
let pageNumber = 1;

const movePage = (direction) => {
  pageNumber += direction;
  loadArticles(pageNumber);
};

const init = async () => {
  totalPages = Math.ceil((await getAllArticles()).length / 5);
  pageNumber = 1;
  const articles = await getArticles(pageNumber);
  renderArticles(articles);

  document
    .getElementById("prepage")
    .addEventListener("click", () => movePage(-1));

  document
    .getElementById("nextpage")
    .addEventListener("click", () => movePage(1));

  document
    .getElementById("totalpage")
    .addEventListener("click", () => movePage(totalPages - pageNumber));

  document
    .getElementById("nextButton")
    .addEventListener("click", () => movePage(1));

  document
    .getElementById("prevButton")
    .addEventListener("click", () => movePage(-1));

  loadArticles();
};

document.addEventListener("DOMContentLoaded", init);

async function ranking() {
  /* 랭킹 1~3위까지를 피드에 출력 */
  const response = await fetch(`${backend_base_url}/articles/ranking/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
    method: "GET",
  });
  if (response.status == 200) {
    const response_json = await response.json();
    let ranking = "";
    let ranking_1 = "";
    let ranking_2 = "";
    let ranking_3 = "";
    if (response_json[0] != null) {
      ranking_1 = response_json[0][0];
    }

    if (response_json[1] != null) {
      ranking_2 = response_json[1][0];
    }

    if (response_json[2] != null) {
      ranking_3 = response_json[2][0];
    }

    ranking = `
    
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#FFD700" class="bi bi-award-fill" viewBox="0 0 16 16">
              <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/>
              <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
            </svg>
            <p class="card-text">${ranking_1}</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-body">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#C0C0C0" class="bi bi-award-fill" viewBox="0 0 16 16">
              <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/>
              <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
            </svg>
            <p class="card-text">${ranking_2}</p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <div class="card-body">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#B87333" class="bi bi-award-fill" viewBox="0 0 16 16">
              <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/>
              <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
            </svg>
            <p class="card-text">${ranking_3}</p>
          </div>
        </div>
      </div>
    </div>
		`;

    document.getElementById("ranking").innerHTML = ranking;
  }
}
ranking();
