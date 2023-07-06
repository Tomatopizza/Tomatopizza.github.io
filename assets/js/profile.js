window.onload = async function() {
  try {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  const users_id = payload_parse.user_id;

    const response = await fetch(`${backend_base_url}/users/profile/${users_id}`, {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("access"),
      },
      method: "GET",
    });
    const data = await response.json();
    return data;
    } catch {
      alert("로그인을 해주세요!")
      location.replace("./user_login.html");
    }
  
}
const payload = localStorage.getItem("payload");
const payload_parse = JSON.parse(payload);
const users_id = payload_parse.user_id;

//프로필불러오기
async function getProfile(users_id) {
  const response = await fetch(
    `${backend_base_url}/users/profile/${users_id}`,
    {
      headers: {
        Authorization: "Bearer" + localStorage.getItem("access"),
      },
      method: "GET",
    }
  );
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
  const photo = $("#photo");

  user.text(profile.username);
  useremail.text(profile.email ? profile.email : "이메일을 작성해주세요.");
  user_aboutme.text(
    profile.about_me ? profile.about_me : "간단한 내 소개를 입력해주세요 :)"
  );
  if (
    profile.photo == "" ||
    profile.photo == null ||
    typeof profile.photo === "undefined"
  ) {
    photo.attr("src", "../assets/images/ooo.png");
  } else {
    photo.attr("src", `${backend_base_url}${profile.photo}`);
  }
});

let displayCount = 5;
let articles = [];

//프로필 더보기
$(function () {
  $("#loadMore").click(function () {
    displayCount += 5;
    myLoadArticle();
  });
});

// 운동내역 불러오기
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

      article_mylist.append(newRow);
    });
  } else {
    console.log("다시 시도해주세요!");
  }
}

function articleDetail(article_id) {
  window.location.href = `${frontend_base_url}/template/article_detail.html?article_id=${article_id}`;
}

function loadPutProfile(users_id) {
  window.location.href = `/template/profile_update.html`;
}

// 이미지 업로드 미리보기
function setThumbnail(event) {
  let reader = new FileReader();

  reader.onload = function (event) {
    let img = document.createElement("img");
    img.setAttribute("src", event.target.result);

    // 썸네일 크기 조절
    img.style.width = "200px"; // 너비 150px로 설정
    img.style.marginLeft = "150px";
    img.style.borderRadius = "50%";
    img.style.borderStyle = "solid";

    // 이미지 미리보기 영역
    let imgThumbnail = document.querySelector("#imgthumbnail2");

    // 기존 이미지가 있으면 제거
    while (imgThumbnail.firstChild) {
      imgThumbnail.removeChild(imgThumbnail.firstChild);
    }

    // 새 이미지를 미리보기 영역에 추가
    imgThumbnail.appendChild(img);
  };

  reader.readAsDataURL(event.target.files[0]);
}

function changePW(users_id) {
  window.location.href = `/template/profile_pw_update.html`;
}

// Deactivate User Account
async function deactivateUserAccount() {
  try {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  const users_id = payload_parse.user_id;
  console.log(users_id)
  const confirmDelete = confirm("회원 탈퇴 하시겠습니까?")
  if (confirmDelete) {
    const RealConfirmDelete = confirm("정말 탈퇴 하시겠습니까?")
    if (RealConfirmDelete) {
      const response = await fetch(`${backend_base_url}/users/profile/${users_id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
          method: "DELETE"
      });
      const data = await response.json()
      console.log(data)
      alert("회원 탈퇴 되었습니다.")
      location.replace("./user_login.html");
    }
  }
    } catch {
      alert("로그인 해주세요!")
    }
}