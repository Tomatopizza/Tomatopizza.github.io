async function handleSigninButton() {
    const response = await handleSignin();

    if (response.status == 201) {
        alert("회원등록 완료!");
        window.location.replace("${frontend_base_url}/login.html");
    }
}
