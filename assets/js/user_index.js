window.onload = async function checkLogin() {
    // 페이지 로드시 로그인을 체크합니다
    // 비동기 로드 처리시 window.onload를 사용해 동기적으로 처리하게 합니다.
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
        // 로그아웃 버튼을 로그인 페이지로 연결시킵니다
    }
};
