// 졸라맨 애니메이션
function card_fail(template) {
  // 카드 실패 했을 때 띄울 거

  template[0] = `
      <div class="col">
        <div class="card h-100" >
            <img class="myimg" src="/assets/images/weather_icon/emoji-smile-fill.svg" class="card-img-top" style="width: 30%; margin: auto; padding: 2%">
            <div class="card-body">
              <div class="fontContainer">
                <strong>"오늘도 화이팅!"</strong><br>
              </div>
            </div>
        </div>     
      </div>
    `;
}

// ========== index.js의 back url 연결: 유저가 작성한 모든 게시글 가져오기 ========================
async function loadArticle() {
  const response = await fetch(`${backend_base_url}/articles/my000/`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access"),
    },
    method: "GET",
  });

  if (response.status == 200) {
    const response_json = await response.json();

    if (response_json.length > 0) {
      const checkCount1 = response_json[0].check_status_count;

      // 나머지 코드를 여기에 작성합니다.
    }
    return response_json;
  } else {
    alert("로그인을 해주세요!");
    location.replace("./user_login.html");
  }
}

// ================================ 여기서부터 달력 js =======================================

let nowMonth = new Date(); // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date(); // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0); // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
async function buildCalendar() {
  let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1); // 이번달 1일
  let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0); // 이번달 마지막날

  let tbody_Calendar = document.querySelector(".Calendar > tbody");
  document.getElementById("calYear").innerText = nowMonth.getFullYear(); // 연도 숫자 갱신
  document.getElementById("calMonth").innerText = leftPad(
    nowMonth.getMonth() + 1
  ); // 월 숫자 갱신

  // ======== 달력 가져올때마다 data 동기화 =========
  const articles = await loadArticle();
  const selectedArticles = {};
  for (const article of articles) {
    selectedArticles[article.select_day] = {
      check_status: article.check_status,
    };
  }

  while (tbody_Calendar.rows.length > 0) {
    // 이전 출력결과가 남아있는 경우 초기화
    tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
  }

  let nowRow = tbody_Calendar.insertRow(); // 첫번째 행 추가

  for (let j = 0; j < firstDate.getDay(); j++) {
    // 이번달 1일의 요일만큼
    let nowColumn = nowRow.insertCell(); // 열 추가
  }

  for (
    let nowDay = firstDate;
    nowDay <= lastDate;
    nowDay.setDate(nowDay.getDate() + 1)
  ) {
    // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복

    let nowColumn = nowRow.insertCell(); // 새 열을 추가하고

    let newDIV = document.createElement("p");
    newDIV.innerHTML = leftPad(nowDay.getDate()); // 추가한 열에 날짜 입력
    nowColumn.appendChild(newDIV);

    // ============ 날짜열 생성 ==================
    const nowDayStr = `${nowDay.getFullYear()}-${leftPad(
      nowDay.getMonth() + 1
    )}-${leftPad(nowDay.getDate())}`;

    // ========= 날짜열=backdata의 selected_day 일 경우/ 상태의 따라서 색깔이 다르게 나타냄 ========

    if (nowDayStr in selectedArticles) {
      if (selectedArticles[nowDayStr].check_status == true) {
        newDIV.style.backgroundColor = "rgb(255, 153, 153)";
      } else {
        newDIV.style.backgroundColor = "skyblue";
      }
    }

    // if (nowDay = response_json)
    if (nowDay.getDay() == 6) {
      // 토요일인 경우
      nowRow = tbody_Calendar.insertRow(); // 새로운 행 추가
    }

    if (nowDay < today) {
      // 지난날인 경우
      newDIV.className = "pastDay";
    } else if (
      nowDay.getFullYear() == today.getFullYear() &&
      nowDay.getMonth() == today.getMonth() &&
      nowDay.getDate() == today.getDate()
    ) {
      // 오늘인 경우
      newDIV.className = "today";
    } else {
      // 미래인 경우
      newDIV.className = "futureDay";
    }
    newDIV.setAttribute("data-date", nowDayStr);
    newDIV.addEventListener("click", (event) => {
      const selected_date_str = event.target.getAttribute("data-date");
      choiceDate(newDIV, selected_date_str);
    });

    // ======================= 날짜선택시 운동내역 보기 =============================
    async function choiceDate(newDIV, selected_date_str) {
      const response = await fetch(
        `${backend_base_url}/articles/my000/?date=${selected_date_str}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access"),
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );

      if (response.status == 200) {
        const responseJson = await response.json();
        const articleList = document.getElementById("article-list");
        articleList.innerHTML = "";
        // data의 results에 json 형식으로 article 데이터s를 가져옴 그냥 article.id로 하니까 안가져와져서 여차저차 찾아냄
        responseJson.forEach((data) => {
          const articleCard = document.createElement("div");
          articleCard.classList.add("card", "mb-5");
          const check_status = data.check_status;
          const select_day = data.select_day;
          const category = data.category;
          const articleId = data.id;
          const inSubcategory = data.in_subcategory || {};
          const outSubcategory = data.out_subcategory || {};

          const categoryName =
            category === 1 ? "실내운동" : category === 2 ? "실외운동" : "기타";

          const inSubCategoryMap = {
            1: "실내 걷기",
            2: "트레드밀",
            3: "실내 싸이클",
            4: "상체 웨이트",
            5: "하체 웨이트",
            6: "수영",
            7: "실내 코어운동",
          };

          const inSubCategoryName = inSubCategoryMap[inSubcategory] || "";

          const outSubCategoryMap = {
            1: "실외 걷기",
            2: "야외 런닝",
            3: "야외 싸이클",
            4: "구기종목",
          };

          const outSubCategoryName = outSubCategoryMap[outSubcategory] || "";

          const checkStatus =
            check_status === true
              ? "운동완료 !"
              : check_status === false
              ? "아직 운동 전이에요"
              : "기타";

          articleCard.innerHTML = `
		  <div class="card" style="width: 100%;">
		  <div class="card">
			  <h5 class="card-title" style="text-align: center; margin-top:10px;">${categoryName} (${inSubCategoryName}${outSubCategoryName})</h5>
			  <h6 class="card-subtitle mb-2 text-muted" style="text-align: center;">${select_day}</h6>
			  <p class="card-text" style="text-align: center;">${checkStatus}</p>
			  <div style="text-align: center;">
				  <button type="button" class="btn btn-dark" style="margin-bottom:10px;" onclick="location.href='${frontend_base_url}/template/article_detail.html?article_id=${articleId}'">상세보기</button>
			  </div>
		  </div>
	  </div>`;

          articleList.appendChild(articleCard);
        });
        document.querySelector(".black_bg").style.display = "block";
        document.querySelector(".modal_w").style.display = "block";
      } else if (response.status == 404) {
        // 사용자가 확인할 수 없을 때의 처리를 수행합니다.
        alert("로그인을 해주세요.");
      } else {
        // 기타 오류 처리를 수행합니다.
        alert("API 호출에 실패하였습니다.");
      }
    }
    document
      .querySelector(".modal_out > a")
      .addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector(".modal_w").style.display = "none";
        document.querySelector(".black_bg").style.display = "none";
      });
  }
}

//=============여기까지 buildCalendar() ================

// 이전달 버튼 클릭
function prevCalendar() {
  nowMonth = new Date(
    nowMonth.getFullYear(),
    nowMonth.getMonth() - 1,
    nowMonth.getDate()
  ); // 현재 달을 1 감소
  buildCalendar(); // 달력 다시 생성
}
// 다음달 버튼 클릭
function nextCalendar() {
  nowMonth = new Date(
    nowMonth.getFullYear(),
    nowMonth.getMonth() + 1,
    nowMonth.getDate()
  ); // 현재 달을 1 증가
  buildCalendar(); // 달력 다시 생성
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
  if (value < 10) {
    value = "0" + value;
    return value;
  }
  return value;
}

// ========================== 글작성 =============================

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

// 글작성
async function save_article() {
  const category = document.querySelector("#category").value;
  const inCategoryField = document.getElementById("in_category");
  const inCategory = inCategoryField.value;
  const outCategoryField = document.getElementById("out_category");
  const outCategory = outCategoryField.value;

  toggleCategoryFields(category);

  const selectedSubCategory =
    category === "in"
      ? inCategoryField.value
      : category === "out"
      ? outCategoryField.value
      : null;

  const exercise_time = document.getElementById("exercise_time").value;
  const content = document.getElementById("content").value;
  const select_day = document.getElementById("select_day").value;
  const img = document.getElementById("image").files[0];
  const check_status = document.getElementById("check_status").checked;
  const is_private = document.getElementById("is_private").checked;
  const token = localStorage.getItem("access");

  const formData = new FormData();
  formData.append("category", category);
  if (category === "in") {
    formData.append("in_subcategory", selectedSubCategory);
  } else if (category === "out") {
    formData.append("out_subcategory", selectedSubCategory);
  }
  formData.append("select_day", select_day);
  formData.append("content", content);

  if (img) {
    formData.append("image", img);
  }

  formData.append("check_status", check_status);
  formData.append("is_private", is_private);
  formData.append("exercise_time", exercise_time);

  const response = await fetch(`${backend_base_url}/articles/my000/`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });

  if (response.status == 201) {
    alert("글 작성 완료");
    window.location.reload();
  } else if (category === "" || select_day === "" || exercise_time === "") {
    alert("카테고리, 날짜, 운동시간은 필수 입니다!");
  }

  const saveButton = document.getElementById("save-article");
}

// 이미지 업로드 미리보기
function setThumbnail(event) {
  let reader = new FileReader();

  reader.onload = function (event) {
    let img = document.createElement("img");
    img.setAttribute("src", event.target.result);

    // 썸네일 크기 조절
    img.style.width = "200px"; // 너비 150px로 설정
    img.style.height = "150px"; // 높이 자동 설정

    // 이미지 미리보기 영역
    let imgThumbnail = document.querySelector("#imgthumbnail");

    // 기존 이미지가 있으면 제거
    while (imgThumbnail.firstChild) {
      imgThumbnail.removeChild(imgThumbnail.firstChild);
    }

    // 새 이미지를 미리보기 영역에 추가
    imgThumbnail.appendChild(img);
  };

  reader.readAsDataURL(event.target.files[0]);
}
