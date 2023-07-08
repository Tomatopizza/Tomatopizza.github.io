/**
 * 카드 실패 했을 때 띄울 내용
 */

function card_fail(template) {
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
/**
 * index.js의 back url 연결: 유저가 작성한 모든 게시글 가져오기
 */
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

    } else {

    }
    return response_json;
  } else {
    alert("로그인을 해주세요!");
    location.replace("./user_login.html");
  }
}



let nowMonth = new Date(); 
let today = new Date(); 
today.setHours(0, 0, 0, 0); 

// 달력 생성
async function buildCalendar() {
  let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1); 
  let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0); 

  let tbody_Calendar = document.querySelector(".Calendar > tbody");
  document.getElementById("calYear").innerText = nowMonth.getFullYear(); 
  document.getElementById("calMonth").innerText = leftPad(
    nowMonth.getMonth() + 1
  ); // 월 숫자 갱신

  // 달력 가져올때마다 data 동기화
  const articles = await loadArticle();
  const selectedArticles = {};
  for (const article of articles) {
    selectedArticles[article.select_day] = {
      check_status: article.check_status,
    };
  }

  while (tbody_Calendar.rows.length > 0) {
    tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
  }

  let nowRow = tbody_Calendar.insertRow();

  for (let j = 0; j < firstDate.getDay(); j++) {
    let nowColumn = nowRow.insertCell();
  }

  for (
    let nowDay = firstDate;
    nowDay <= lastDate;
    nowDay.setDate(nowDay.getDate() + 1)
  ) {


    let nowColumn = nowRow.insertCell(); 

    let newDIV = document.createElement("p");
    newDIV.innerHTML = leftPad(nowDay.getDate());
    nowColumn.appendChild(newDIV);

   
    const nowDayStr = `${nowDay.getFullYear()}-${leftPad(
      nowDay.getMonth() + 1
    )}-${leftPad(nowDay.getDate())}`;



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


    async function choiceDate(newDIV, selected_date_str) {
      const response = await fetch(
        `${backend_base_url}/articles/my000/?date=${selected_date_str}`,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );

      if (response.status == 200) {
        const responseJson = await response.json();
        const articleList = document.getElementById("article-list");
        articleList.innerHTML = "";

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

//여기까지 Calendar


function prevCalendar() {
  nowMonth = new Date(
    nowMonth.getFullYear(),
    nowMonth.getMonth() - 1,
    nowMonth.getDate()
  ); 
  buildCalendar(); 
}

function nextCalendar() {
  nowMonth = new Date(
    nowMonth.getFullYear(),
    nowMonth.getMonth() + 1,
    nowMonth.getDate()
  ); 
  buildCalendar(); 
}


function leftPad(value) {
  if (value < 10) {
    value = "0" + value;
    return value;
  }
  return value;
}

// Post toggle

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

// post save
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
    img.style.width = "200px"; 
    img.style.height = "150px"; 

 
    let imgThumbnail = document.querySelector("#imgthumbnail");


    while (imgThumbnail.firstChild) {
      imgThumbnail.removeChild(imgThumbnail.firstChild);
    }

    imgThumbnail.appendChild(img);
  };

  reader.readAsDataURL(event.target.files[0]);
}
