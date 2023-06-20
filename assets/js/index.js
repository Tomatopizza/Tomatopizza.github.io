console.log("로드 확인");

window.onload = () => {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    console.log(payload_parse.username);

    const intro = document.getElementById("intro");
    intro.innerText = payload_parse.username;
};