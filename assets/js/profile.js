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

//화면에 표시
window.onload = async function loadProfile() {
  const profile = await getProfile(users_id);
  console.log(profile);

  const user = document.getElementById("username");
  const useremail = document.getElementById("email");
  const user_aboutme = document.getElementById("aboutme");

  user.innerText = profile.username;
  useremail.innerText = profile.email
    ? profile.email
    : "이메일을 작성해주세요.";
  user_aboutme.innerText = profile.about_me
    ? profile.about_me
    : "간단한 내 소개를 입력해주세요 :)";
};
