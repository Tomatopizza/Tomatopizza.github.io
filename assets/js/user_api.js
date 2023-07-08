async function handleRegister() {
  const registerData = {
    /**
     * 등록에 필요한 정보입니다
     */
    username: document.getElementById("floatingInput").value,
    password: document.getElementById("floatingPassword").value,
    email: document.getElementById("floatingInputEmail").value,
  };

  const userPassword1 = document.getElementById("floatingPassword").value;
  const userPassword2 = document.getElementById("floatingPassword2").value;

  if (userPassword1 === userPassword2) {
    const response = await fetch(`${backend_base_url}/users/register/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(registerData),
    });

    response_json = await response.json();

    if (response.status == 201) {
      alert("작성해주신 이메일로 인증메일이 발송되었습니다");
      window.location.replace(`${frontend_base_url}/template/user_login.html`); // 로그인 페이지
    } else {
      alert(response.status); // "회원정보가 일치하지 않습니다."
    }
  } else {
    alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
  }
}

function checkPassword() {
  const userPassword1 = document.getElementById("floatingPassword").value;
  const userPassword2 = document.getElementById("floatingPassword2").value;
  const warning = document.getElementById("passwordWarning");

  if (userPassword1 !== userPassword2) {
    warning.style.display = "block";
  } else {
    warning.style.display = "none";
  }
}

async function handleLogin() {
  const loginData = {
    email: document.getElementById("floatingInput").value, // email
    password: document.getElementById("floatingPassword").value,
  };

  const userEmail = loginData["email"];
  const userPassword = loginData["password"];
  if (userEmail === "" && userPassword === "") {
    alert("email과 password를 입력해주세요.");
  } else if (userEmail === "") {
    alert("email을 입력해주세요.");
  } else if (userPassword === "") {
    alert("password를 입력해주세요.");
  } else {
    // fetch(post) and api token check
    const response = await fetch(`${backend_base_url}/users/login/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(loginData),
    });

    response_json = await response.json();

    if (response.status == 200) {
      var token = response_json.tokens;
      var refresh = token.refresh;
      var access = token.access;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      const base64Url = access.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      localStorage.setItem("payload", jsonPayload);
      window.location.replace(`${frontend_base_url}/template/index.html`);
    } else {
      alert("등록된 회원이 아닙니다.");
    }
  }
}

async function handleLogout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("payload");
  alert("로그아웃완료");
  location.reload();
}
