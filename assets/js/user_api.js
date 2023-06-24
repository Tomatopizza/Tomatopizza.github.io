
async function handleRegister() {
    const registerData = {
        // 등록에 필요한 정보입니다
        username: document.getElementById("floatingInput").value,
        password: document.getElementById("floatingPassword").value,
        email: document.getElementById("floatingInputEmail").value
        // fullname: document.getElementById("floatingInputFullname").value,
    };

    const response = await fetch(`${backend_base_url}/users/`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(registerData)
    });

    response_json = await response.json();

    if (response.status == 201) {
        window.location.replace(`${frontend_base_url}/template/user_login.html`); // 로그인 페이지
    } else {
        alert(response.status); // "회원정보가 일치하지 않습니다."
    }
}

async function handleLogin() {
    const loginData = {
        username: document.getElementById("floatingInput").value,
        password: document.getElementById("floatingPassword").value
    };

    // fetch post 통신이 완료될때까지 기다리고, api에서 토큰을 반환합니다.
    const response = await fetch(`${backend_base_url}/users/api/token/`, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(loginData)
    });

    response_json = await response.json();

    if (response.status == 200) {
        // access,refresh 토큰 저장
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
        );

        // payload 저장
        localStorage.setItem("payload", jsonPayload);
        window.location.replace(`${frontend_base_url}/template/index.html`);
    } else {
        alert(response.status); // "회원정보가 일치하지 않습니다."
    }
}


async function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("payload");
    alert("로그아웃완료");
    location.reload();
}
