window.onload = async function () {
  const payload = localStorage.getItem("payload");
  if (payload == null) {
    alert("비밀번호 변경은 로그인 이후 이용하실 수 있습니다.");
    location.replace("./user_login.html");
  }
};

//비밀번호 변경
async function fixProfile(user_id) {
  const payload = localStorage.getItem("payload");
  const payload_parse = JSON.parse(payload);
  user_id = payload_parse.user_id;
  const token = localStorage.getItem("access");
  console.log(user_id);


  const password1 = document.getElementById("change_pw1").value;
  const password2 = document.getElementById("change_pw_2").value;
  if (password1 === password2) {
    const response = await fetch(
      `${backend_base_url}/users/profile/${user_id}/`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          password: password1,
        }),
      }
    );
    if (response.status == 200) {
      alert("비밀번호 변경 완료");
      window.location.replace("profile.html");
    } else {
      alert(response.message);
    }
  } else {
    alert("비밀번호가 일치하지 않습니다")
  }
}
function checkPasswordsMatch() {
  const password1 = document.getElementById("change_pw1").value;
  const password2 = document.getElementById("change_pw_2").value;
  const warning = document.getElementById("warning");

  if (password1 !== password2) {
    warning.style.display = "block";
  } else {
    warning.style.display = "none";
  }
}

function pwNoUpdate() {
  window.location.href = "profile.html";
}
