const urlParams = new URLSearchParams(window.location.search);
articleId = urlParams.get("article_id");
// console.log(articleId)

// 게시글 정보 가져오기
async function getArticleInfo(articleId) {
  const token = localStorage.getItem("access");
  const response = await fetch(
    `${backend_base_url}/articles/${articleId}/detail/`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  if (response.status === 200) {
    const articleInfo = await response.json();
    // 바인딩 및 출력 함수 호출
    bindData(articleInfo);
  } else {
    console.error("게시글 정보를 가져오는데 실패했습니다.");
  }
}

// 데이터 바인딩 및 출력
function bindData(articleInfo) {
  // 각 요소에 데이터를 바인딩하고 출력하는 로직을 구현합니다.
  document.querySelector("#category").value = articleInfo.category;
  document.querySelector("#in_category").value = articleInfo.in_subcategory;
  document.querySelector("#out_category").value = articleInfo.out_subcategory;
  document.querySelector("#content2").value = articleInfo.content;
  document.querySelector("#select_day").value = articleInfo.select_day;
  document.querySelector("#exercise_time1").value = articleInfo.exercise_time;
  document.querySelector("#check_status1").checked = articleInfo.check_status;
  document.querySelector("#is_private1").checked = articleInfo.is_private;
  // 이미지 미리보기
  const imgThumbnail = document.querySelector("#imgthumbnail2");
  console.log(imgThumbnail);
  if (articleInfo.image) {
    let img = document.createElement("img");
    img.setAttribute("src", `${backend_base_url}${articleInfo.image}`);
    img.style.width = "400px";
    img.style.height = "300px";
    imgThumbnail.innerHTML = ""; // 기존 이미지 제거
    imgThumbnail.appendChild(img);
  }
  // 필요에 따라 다른 요소에 데이터를 바인딩하고 출력합니다.
}
getArticleInfo(articleId);

// 카테고리 필드 전환
const toggleCategoryFields = (category) => {
  const inCategoryFields = document.querySelectorAll(".in_category");
  const outCategoryFields = document.querySelectorAll(".out_category");
  if (category === "in") {
    inCategoryFields.forEach((field) => {
      field.style.display = "block";
    });
    outCategoryFields.forEach((field) => {
      field.style.display = "none";
    });
  } else if (category === "out") {
    outCategoryFields.forEach((field) => {
      field.style.display = "block";
    });
    inCategoryFields.forEach((field) => {
      field.style.display = "none";
    });
  }
};

// 게시글 수정하지 않을 때(게시글 상세 페이지로 이동)
function articleNoUpdate() {
  window.location.href = `${frontend_base_url}/template/article_detail.html?article_id=${articleId}`;
}

// 게시글 수정
async function articleUpdate() {
  const category = document.querySelector("#category").value;
  const inCategoryField = document.getElementById("in_category");
  const outCategoryField = document.getElementById("out_category");
  toggleCategoryFields(category);
  const selectedSubCategory =
    category === "in"
      ? inCategoryField.value
      : category === "out"
      ? outCategoryField.value
      : null;
  const content = document.getElementById("content2").value;
  const selectDay = document.getElementById("select_day").value;
  const exerciseTime1 = document.getElementById("exercise_time1").value;
  const checkStatus1 = document.getElementById("check_status1").checked;
  const isPrivate1 = document.getElementById("is_private1").checked;
  const token = localStorage.getItem("access");
  const formData = new FormData();
  formData.append("category", category);
  if (category === "in") {
    formData.append("in_subcategory", selectedSubCategory);
  } else if (category === "out") {
    formData.append("out_subcategory", selectedSubCategory);
  }
  formData.append("content", content);
  formData.append("select_day", selectDay);
  formData.append("exercise_time", exerciseTime1);
  formData.append("check_status", checkStatus1);
  formData.append("is_private", isPrivate1);
  const imageInput = document.getElementById("image");
  const img = imageInput.files[0]; // 파일 업로드 input에서 선택한 파일 가져오기
  if (img) {
    formData.append("image", img);
  }
  const response = await fetch(
    `${backend_base_url}/articles/${articleId}/detail/`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    }
  );
  if (response.status == 201) {
    alert("게시글 수정 완료");
    window.location.href = `${frontend_base_url}/template/article_detail.html?article_id=${articleId}`;
  } else if (content == "" || exerciseTime1 == "") {
    alert("빈칸을 입력해 주세요.");
  } else {
    console.error("요청 실패:", response);
    for (const selectDay of formData.values()) {
      console.log(selectDay);
    }
  }
}
// 이미지 업로드 미리보기
function setThumbnail(event) {
  let reader = new FileReader();
  reader.onload = function (event) {
    let img = document.createElement("img");
    img.setAttribute("src", event.target.result);
    img.style.width = "400px"; 
    img.style.height = "300px"; 
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