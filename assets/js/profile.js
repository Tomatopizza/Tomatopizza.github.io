console.log("안녕");
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);
const users_id = payload_parse.user_id;
console.log(users_id);

//프로필불러오기
async function getProfile(users_id) {
  const response = await fetch(`${backend_base_url}/users/${users_id}`, {
    headers: {
      Authorization: "Bearer" + localStorage.getItem("access"),
    },
    method: "GET",
  });
  const data = await response.json();
  return data;
}

$(document).ready(async function () {
  const profile = await getProfile(users_id);
  console.log(profile);
  myLoadArticle();

  const user = $("#username");
  const useremail = $("#email");
  const user_aboutme = $("#aboutme");

  user.text(profile.username);
  useremail.text(profile.email ? profile.email : "이메일을 작성해주세요.");
  user_aboutme.text(
    profile.about_me ? profile.about_me : "간단한 내 소개를 입력해주세요 :)"
  );
});

let displayCount = 5;
let articles = [];

$(function () {
  $("#loadMore").click(function () {
    displayCount += 5;
    myLoadArticle();
  });
});

async function myLoadArticle() {
  const response = await fetch(`${backend_base_url}/articles/my000/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
    method: "GET",
  });
  if (response.status == 200) {
    const response_json = await response.json();
    console.log(response_json);

    articles = response_json;
    console.log(articles);

    const article_mylist = $("#article_mylist");
    if (displayCount >= articles.length) {
      $("#loadMore").hide();
    }

    article_mylist.empty();

    articles.slice(0, displayCount).forEach((article) => {
      const newRow = document.createElement("li");
      newRow.setAttribute(
        "class",
        "list-group-item d-flex justify-content-between align-items-center" // 'custom-list-item' 클래스 추가
      );
      newRow.setAttribute("style", "width:500px;");
      newRow.setAttribute("onclick", `articleDetail(${article.id})`);
      newRow.setAttribute("id", article.id); // id로 식별
      const badgeClass = article.check_status ? "bg-danger" : "bg-primary";
      const badgeText = article.check_status ? "오운완" : "계획중";

      newRow.innerHTML = `
        운동날짜 : ${article.select_day}, ${
        article.category === 1
          ? "실내운동"
          : article.category === 2
          ? "실외운동"
          : ""
      }
        <span class="badge rounded-pill ${badgeClass}">${badgeText}</span>
      `;

      // 목록을 순차적으로 추가해줍니다.
      article_mylist.append(newRow);
    });
  } else {
    console.log("다시 시도해주세요!");
  }
}

function articleDetail(article_id) {
  window.location.href = `${frontend_base_url}/template/article_detail.html?article_id=${article_id}`;
}
