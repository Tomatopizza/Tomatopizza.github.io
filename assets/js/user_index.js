window.onload = async function checkLogin() {
    /* 페이지 로드시 로그인 체크
    비동기 로드 처리시 window.onlod를 사용해 동기적으로 처리 */
    var payload = localStorage.getItem("payload");
    var parsed_payload = await JSON.parse(payload);

    const username = document.getElementById("username");
    const loginoutButton = document.getElementById("loginout");

    if (parsed_payload) {
        username.innerText = parsed_payload.username;
        loginoutButton.innerText = "로그아웃";
        loginoutButton.setAttribute("onclick", "handleLogout()");
    } else {
        username.innerText = "로그인이필요합니다";
        loginoutButton.innerText = "로그인";
        loginoutButton.setAttribute("onclick", "location.href='login.html'");
    }
};
