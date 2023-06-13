console.log("로드 확인");

window.onload = () => {
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload);
    console.log(payload_parse.email);

    const intro = document.getElementById("intro");
    intro.innerText = payload_parse.email;
};