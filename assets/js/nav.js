
$(document).ready(function () {
    // 상단 네비 html을 붙여주는 함수
    $("#navbar-container").load("nav.html", function () {


        //유저 토큰을 가져와서 로그인시 닉네임 표시
        const payload = localStorage.getItem("payload");
        const payload_parse = JSON.parse(payload);

        token_exp = payload_parse.exp
        const currentTime = Math.floor(Date.now() / 1000);



        const intro = document.getElementById("intro");
        if (token_exp > currentTime) {
            if (intro) {
                const payload = localStorage.getItem("payload");
                const payload_parse = JSON.parse(payload);
                intro.innerText = `${payload_parse.username}님 안녕하세요`;
                intro.setAttribute('style', 'color: black;')
                intro.href = `${frontend_base_url}/profile2.html`


                let navbarRight = document.getElementById("navbar-right");
                let newLi = document.createElement("li");
                newLi.setAttribute("class", "nav-item");

                //로그아웃 함수
                async function handleLogout() {
                    localStorage.removeItem("access")
                    localStorage.removeItem("refresh")
                    localStorage.removeItem("payload")
                    location.reload()
                };


                const modal = document.getElementById('modal');
                const open = document.getElementById('nav-create')
                const close = document.getElementById('close');

                //글쓰기 함수
                async function handlecreatearticle() {

                    function onClick() {
                        document.querySelector('.modal_wrap').style.display = 'block';
                        document.querySelector('.black_bg').style.display = 'block';
                    }
                    function offClick() {
                        document.querySelector('.modal_wrap').style.display = 'none';
                        document.querySelector('.black_bg').style.display = 'none';
                    }

                    document.getElementById('modal_btn').addEventListener('click', onClick);
                    document.querySelector('.modal_close').addEventListener('click', offClick);
                }


                // 로그인시 보이는 로그아웃
                let logoutBtn = document.createElement("button");
                logoutBtn.setAttribute("class", "nav-link btn");
                logoutBtn.setAttribute("id", "nav-loginout");
                logoutBtn.innerText = "로그아웃";
                logoutBtn.setAttribute("type", "button");
                logoutBtn.setAttribute('style', 'background-color: black; color:white;')

                logoutBtn.addEventListener("click", handleLogout);



                // <!-- <button type='button' id="modal_btn">글쓰기</button>
                // 로그인시 보이는 글쓰기
                let createarticle = document.getElementById("create-article");
                createarticle.innerText = "글쓰기";
                createarticle.setAttribute("class", "nav-link btn")
                createarticle.setAttribute("id", "modal_btn")
                createarticle.setAttribute("type", "button");
                createarticle.setAttribute('style', 'background-color: black; color:white')

                createarticle.addEventListener("click", handlecreatearticle);


                newLi.appendChild(logoutBtn);

                navbarRight.appendChild(newLi);
            }


            let loginbtn = document.getElementById("login-btn");
            if (loginbtn) {
                loginbtn.style.display = "none";
            }

            let signupbtn = document.getElementById("signup-btn");
            if (signupbtn) {
                signupbtn.style.display = "none";
            }



        }
    });



});

