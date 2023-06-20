const form = document.querySelector("form");
eField = form.querySelector(".email"),
  eInput = eField.querySelector("input"),
  nField = form.querySelector(".name"), //name 추가
  nInput = nField.querySelector("input"), //name 추가
  pField = form.querySelector(".password"),
  pInput = pField.querySelector("input");

form.onsubmit = (event) => {
  event.preventDefault(); //양식 제출 방지
  //이메일,아이디,비밀번호가 비어 있으면 Shake 클래스를 추가하고 그렇지 않으면 지정된 함수를 호출합니다.
  (eInput.value == "") ? eField.classList.add("shake", "error") : checkEmail();
  (nInput.value == "") ? nField.classList.add("shake", "error") : checkName();
  (pInput.value == "") ? pField.classList.add("shake", "error") : checkPass();

  setTimeout(() => { //500ms 후 흔들림 클래스 제거
    eField.classList.remove("shake");
    nField.classList.remove("shake");
    pField.classList.remove("shake");
  }, 500);

  eInput.onkeyup = () => { checkEmail(); } //이메일 입력 키업에서 checkEmail 함수 호출
  nInput.onkeyup = () => { checkName(); } //아이디 입력 키업에서 checkName 함수 호출
  pInput.onkeyup = () => { checkPass(); } //패스 입력 키업에서 checkPassword 함수 호출 

  function checkEmail() { //checkEmail 
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //유효성 검사 패턴 (백엔드에 있지만 안전하게 한번 더)
    if (!eInput.value.match(pattern)) { // 패턴이 일치하지 않으면 오류를 추가하고 유효한 클래스를 제거
      eField.classList.add("error");
      eField.classList.remove("valid");
      let errorTxt = eField.querySelector(".error-txt");
      //이메일 값이 비어 있지 않은 경우 : 유효한 이메일을 입력하세요. 
      //그렇지 않으면 이메일을 비워둘 수 없음을 표시합니다.
      (eInput.value != "") ? errorTxt.innerText = "Enter a valid email address" : errorTxt.innerText = "Email can't be blank";
    } else { //패턴이 일치하면 오류를 제거하고 유효한 클래스를 추가합니다.
      eField.classList.remove("error");
      eField.classList.add("valid");
    }
  }

  function checkPass() { //checkPass function
    if (pInput.value == "") { //pass가 비어 있으면 오류를 추가하고 유효한 클래스를 제거.
      pField.classList.add("error");
      pField.classList.remove("valid");
    } else { //pass가 비어 있으면 오류를 제거하고 유효한 클래스를 추가합니다. 
      pField.classList.remove("error");
      pField.classList.add("valid");
    }
  }

  function checkName() { //checkName function
    if (nInput.value == "") { //name이 비어 있으면 오류를 추가, 유효한 클래스를 제거합니다.
      nField.classList.add("error");
      nField.classList.remove("valid");
    } else { //name이 비어 있으면 오류를 제거, 유효한 클래스를 추가합니다. 
      nField.classList.remove("error");
      nField.classList.add("valid");
    }
  }

  // eField, nField 및 pField에 사용자가 세부 정보를 올바르게 채웠음을 의미하는 오류 클래스가 포함되어 있지 않은 경우
  if (!eField.classList.contains("error")
    && !nField.classList.contains("error")
    && !pField.classList.contains("error")) {
    window.location.href =
      form.getAttribute("action"); //form 태그의 action 속성 안에 있는 지정된 URL로 사용자를 리디렉션합니다.
  }
}

async function handleRegister() {
  //비동기 함수지만 await을 사용하여 signup api응답이 끝날 때까지 기다린다.
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email, password);

  const response = await fetch("http://127.0.0.1:8000/users/signup/", {
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  console.log(response);
}