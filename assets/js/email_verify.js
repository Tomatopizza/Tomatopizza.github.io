window.onload = async function handleAuthEmail() {
	localStorage.removeItem("access");
	localStorage.removeItem("refresh");
	localStorage.removeItem("payload");

	console.log(new URLSearchParams(location.search).get("token"))

	email_verify_token = new URLSearchParams(location.search).get("token")
	const response = await fetch(`${backend_base_url}/users/email-verify/?token=${email_verify_token}`, {
		headers: {
			'content-type': 'application/json',
		},
		method: 'GET',
	})
	console.log(response)
	if (response.status == 201) {
		alert(`인증이 완료되었습니다.`)
	} else if(response) {
		alert(`인증 이메일이 올바르지 않습니다.`)
	}

}

async function login(){
    window.location.replace(`${frontend_base_url}/template/user_login.html`);
}