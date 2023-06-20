async function handleLogin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    try {// fetch post 통신이 완료될때까지 기다리고, api에서는 세션의 토큰을 반환합니다.
        const response = await fetch(`${back_base_url}/api/auth/token/`, {
            method: "POST", // 또는 "PUT"
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
            })
        });

        if (response.status == 200) {
            const response_json = await response.json()
            console.log("성공:", response_json)

            //access,refresh 토큰 저장
            localStorage.setItem("access", response_json.access)
            localStorage.setItem("refresh", response_json.refresh)

            // payload 저장
            const base64Url = response_json.access.split(".")[1]
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(function (c) {
                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    })
                    .join("")
            );

            localStorage.setItem("payload", jsonPayload)
            // window.location.replace(`${front_base_url}/A8ooo_front/index.html`);

        } else {
            alert("회원정보가 일치하지 않습니다.")
        }
    } catch (error) {
        console.error("실패:", error)
    }
};

const form = document.querySelector("form")
nField = form.querySelector(".name"),
    nInput = nField.querySelector("input"),
    pField = form.querySelector(".password"),
    pInput = pField.querySelector("input");

form.onsubmit = (event) => {
    // 양식 제출 방지
    event.preventDefault();
    // 아이디 비밀번호가 비어 있으면 Shake 클래스를 추가하고 그렇지 않으면 지정된 함수를 호출합니다.
    (nInput.value == "") ? nField.classList.add("shake", "error") : checkName();
    (pInput.value == "") ? pField.classList.add("shake", "error") : checkPass();

    setTimeout(() => {
        // 500ms 후 흔들림 클래스 제거
        nField.classList.remove("shake");
        pField.classList.remove("shake");
    }, 500);

    nInput.onkeyup = () => { checkName(); }
    // 이메일 입력 키업에서 checkName 함수 호출
    pInput.onkeyup = () => { checkPass(); }
    // 패스 입력 키업에서 checkPassword 함수 호출 

    function checkName() {
        // checkName 함수
        if (nInput.value == "") {
            // name이 비어 있으면 오류를 추가, 유효한 클래스를 제거합니다.
            nField.classList.add("error");
            nField.classList.remove("valid");

        } else {
            // name이 비어 있으면 오류를 제거, 유효한 클래스를 추가합니다. 
            nField.classList.remove("error");
            nField.classList.add("valid");
        }
    }

    function checkPass() {
        //checkPass 함수

        if (pInput.value == "") {
            // pass가 비어 있으면 오류를 추가하고 유효한 클래스를 제거합니다.
            pField.classList.add("error");
            pField.classList.remove("valid");

        } else {
            // pass가 비어 있으면 오류를 제거하고 유효한 클래스를 추가합니다. 
            pField.classList.remove("error");
            pField.classList.add("valid");
        }
    }

    // nField 및 pField에 세부 정보를 올바르게 채워 오류 클래스가 포함되어 있지 않은 경우
    if (!nField.classList.contains("error")
        && !pField.classList.contains("error")) {
        window.location.href =
            form.getAttribute("action");
        // form 태그의 action 속성 안에 있는 지정된 URL로 사용자를 리디렉션합니다.
    }
}
