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

$(document).ready(function () {
  $("#navbar-container").load("nav.html", async function () {
    const payload = localStorage.getItem("payload");
    const parsedPayload = JSON.parse(payload);
    const users_id = parsedPayload.user_id;

    try {
      const profile = await getProfile(users_id);

      document.querySelector("#select_day").value = new Date().toISOString().slice(0, 10);
      document.querySelector("#select_day").min = new Date().toISOString().slice(0, 10);

      const intro = document.getElementById("intro");
      if (intro) {
        intro.innerText = `${profile.username}님 안녕하세요`;
        intro.setAttribute("style", "color: black;");
        intro.href = `${frontend_base_url}/template/profile.html`;
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }

    let navbarRight = document.getElementById("navbar-right");
    let newLi = document.createElement("li");
    newLi.setAttribute("class", "nav-item");

    async function handleLogout() {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("payload");
      location.reload();
    }

    let logoutBtn = document.createElement("button");
    logoutBtn.setAttribute("class", "nav-link btn");
    logoutBtn.setAttribute("id", "nav-loginout");
    logoutBtn.innerText = "로그아웃";
    logoutBtn.setAttribute("type", "button");
    logoutBtn.setAttribute("style", "background-color: black; color:white;");

    logoutBtn.addEventListener("click", handleLogout);

    function handlecreatearticle() {
      function onClick() {
        document.querySelector(".modal_wrap").style.display = "block";
        document.querySelector(".black_bg").style.display = "block";
      }
      function offClick() {
        document.querySelector(".modal_wrap").style.display = "none";
        document.querySelector(".black_bg").style.display = "none";
      }

      document.getElementById("modal_btn").addEventListener("click", onClick);
      document
        .querySelector(".modal_close")
        .addEventListener("click", offClick);
    }

    let createarticle = document.getElementById("create-article");
    createarticle.innerText = "글쓰기";
    createarticle.setAttribute("class", "nav-link btn");
    createarticle.setAttribute("id", "modal_btn");
    createarticle.setAttribute("type", "button");
    createarticle.setAttribute("style", "background-color: black; color:white");

    createarticle.addEventListener("click", handlecreatearticle);

    newLi.appendChild(logoutBtn);

    navbarRight.appendChild(newLi);

    let loginbtn = document.getElementById("login-btn");
    if (loginbtn) {
      loginbtn.style.display = "none";
    }

    let signupbtn = document.getElementById("signup-btn");
    if (signupbtn) {
      signupbtn.style.display = "none";
    }
  });
});
