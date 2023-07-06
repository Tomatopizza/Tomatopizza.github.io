console.log("안녕");
//비밀번호 찾기
async function handleResetPassword() {
  const email = document.getElementById("reset_pw").value;

  const response = await fetch(
    `${backend_base_url}/users/request-reset-email/`,
    {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
    }
  );

  const response_json = await response.json();

  if (response.status === 200) {
    alert(
      "비밀번호 재설정 이메일을 발송했습니다. 메일을 확인하고 재설정을 진행해주세요."
    );
    location.reload();
  } else {
    alert(response_json["email"]);
  }
}
//비밀번호 재설정
async function Set_Password() {
  const password = document.getElementById("set_Password1").value;
  const repassword = document.getElementById("set_Password2").value;

  if (password !== repassword) {
    alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const uidb64_param = urlParams.get("uidb64");
  const token_param = urlParams.get("token");

  const response = await fetch(
    `${backend_base_url}/users/password-reset-complete/`,
    {
      headers: {
        "Content-type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        password: password,
        uidb64: uidb64_param,
        token: token_param,
      }),
    }
  );
  const result = await response.json();
  if (response.status === 200) {
    alert(result["message"]);
    location.replace("user_login.html");
  } else {
    alert("링크가 유효하지 않습니다.");
  }
}
function checkPasswordsMatch() {
  const password1 = document.getElementById("set_Password1").value;
  const password2 = document.getElementById("set_Password2").value;
  const warning = document.getElementById("warning2");

  if (password1 !== password2) {
    warning.style.display = "block";
  } else {
    warning.style.display = "none";
  }
}
