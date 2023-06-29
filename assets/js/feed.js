function articleDetail(article_id) {
  window.location.href = `${frontend_base_url}/template/article_detail.html?article_id=${article_id}`;
}

const renderArticles = (articles) => {
  const article_list = document.getElementById("article_list");
  article_list.innerHTML = "";

  articles.forEach((article) => {
    const newCol = document.createElement("div"); // div 생성
    newCol.setAttribute("class", "col"); // class 부여
    newCol.setAttribute("onclick", `articleDetail(${article.id})`);
    article_list.appendChild(newCol); // article_list에 newCol 넣기

    const newCard = document.createElement("div");
    newCard.setAttribute("class", "card");
    newCard.setAttribute("id", article.id); // id로 식별
    newCol.appendChild(newCard); // newCol에 newCard 넣기

    const imageSize = document.createElement("div");
    imageSize.setAttribute("class", "img-size"); // img 사이즈
    newCard.appendChild(imageSize);

    const articleImage = document.createElement("img");
    articleImage.setAttribute("class", "card-img"); // img

    if (article.image) {
      articleImage.setAttribute("src", `${backend_base_url}${article.image}`);
    } else {
      articleImage.setAttribute(
        "src",
        "https://health.clevelandclinic.org/wp-content/uploads/sites/3/2022/04/exerciseHowOften-944015592-770x533-1-650x428.jpg"
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

    const newText = document.createElement("div"); //좋아요, 댓글, 작성시간 div
    newText.setAttribute("class", "collector");
    newCardBody.appendChild(newText);

    const likeCount = document.createElement("li");
    likeCount.setAttribute("class", "like_count");
    likeCount.innerText = `${article.like_count}`; // 좋아요 수 추가
    newText.appendChild(likeCount);

    const commentCount = document.createElement("li");
    commentCount.setAttribute("class", "comment_count");
    commentCount.innerText = `${article.comment_count || 0}`; // 댓글 수 추가
    newText.appendChild(commentCount);

    const createdAt = document.createElement("li");
    createdAt.setAttribute("class", "created_at");
    const currentTime = new Date(); // 현재 시간
    const createdTime = new Date(article.created_at); // 작성 시간
    const timeDiff = Math.floor((currentTime - createdTime) / (1000 * 60)); // 분 단위로 시간 차이 계산

    let displayTime;
    if (timeDiff < 60) {
      displayTime = `${timeDiff} 분 전`; // 60분 이내면 분 단위로 표시
    } else if (timeDiff < 1440) {
      displayTime = `${Math.floor(timeDiff / 60)} 시간 전`; // 24시간 이내면 시간 단위로 표시
    } else {
      displayTime = `${Math.floor(timeDiff / 1440)} 일 전`; // 그 이상은 일 단위로 표시
    }

    createdAt.innerText = `${displayTime}`; // 작성일 추가
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

// //페이지네이션
const loadArticles = async (page = 1) => {
  const totalPages = Math.ceil((await getAllArticles()).length / 5);
  console.log(totalPages);

  const articles = await getArticles(page);
  console.log(articles);
  renderArticles(articles);

  const currentPageElement = document.getElementById("currentPage");
  currentPageElement.textContent = `${page}`;

  if (page > totalPages) {
    alert("페이지가 존재하지 않습니다!");
    location.reload();
  }
  if (page == 0) {
    alert("페이지가 존재하지 않습니다!");
    location.reload();
  }
};

let pageNumber = 1;

const movePage = (direction) => {
  pageNumber += direction;
  loadArticles(pageNumber);
};
const init = () => {
  document
    .getElementById("nextButton")
    .addEventListener("click", () => movePage(1));

  document
    .getElementById("prevButton")
    .addEventListener("click", () => movePage(-1));

  loadArticles(); // 이곳에서만 호출하면 됩니다.
};

document.addEventListener("DOMContentLoaded", init);
