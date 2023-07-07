function setCookie(cookie_name, value, minutes) {
	/* 쿠키 저장 함수 */
	const exdate = new Date();
	exdate.setMinutes(exdate.getMinutes() + minutes);
	const cookie_value =
		escape(value) +
		(minutes == null ? "" : "; expires=" + exdate.toUTCString());
	document.cookie = cookie_name + "=" + cookie_value;
}

function getCookie(cookie_name) {
	/* 쿠키 불러오는 함수 */
	var x, y;
	var val = document.cookie.split(";");

	for (var i = 0; i < val.length; i++) {
		x = val[i].substr(0, val[i].indexOf("="));
		y = val[i].substr(val[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, ""); // 앞과 뒤의 공백 제거하기
		if (x == cookie_name) {
			return unescape(y); // unescape로 디코딩 후 값 리턴
		}
	}
}

async function getPosition() {
	/* 위치정보수집동의 함수 */

	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

async function successFail(position) {
	/* 위치정보 수집동의 이후 try 내부에는 동의 catch에는 거부시 */
	try {
		let position = await getPosition();
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
		lat_lon = [latitude, longitude];
		return lat_lon;
	} catch (err) {
		const latitude = -1;
		const longitude = -1;
		lat_lon = [latitude, longitude];
		return lat_lon;
	}
}

function forecast(value) {
	/* 백엔드에서 숫자로 날아온 날씨 값을 문자열로 변경. */
	let forecast_dict = {
		0: "맑음",
		1: "비",
		2: "비 또는 눈",
		3: "눈",
		4: "소나기",
		5: "빗방울",
		6: "빗방울눈날림",
		7: "눈날림",
	};

	return forecast_dict[value];
}

function weatherIcon(value) {
	/* 백엔드에서 불러온 날씨 값을 아이콘 파일명에 맞게 수정 */
	let icon_dict = {
		0: "0_bright",
		1: "1_rain",
		2: "2_sleet",
		3: "3_snow",
		4: "4_shower",
		5: "5_drizzle",
		6: "6_drizzle_snow",
		7: "7_snow_litte",
	};
	return "/assets/images/weather_icon/" + icon_dict[value] + ".svg";
}

function card(template, weather) {
	/* 위젯으로 나올 카드를 출력. */
	for (var i = 0; i < 6; i++) {
		template[i] = `
              <div class="col">
                <div class="card h-100" >
                    <img class="myimg" src=${
						icon_list[i]
					} class="card-img-top" style="width: 30%; margin: auto; padding: 2%">
                    <div class="card-body">
                      <div class="fontContainer">
                        
                        시각: <strong>${time_list[i].substr(
							0,
							2
						)}시</strong><br>
                        기온: <strong>"${temperature_list[i]}도"</strong><br>
                        추천 운동:<strong>"${
							recommendation_list[i]
						}"</strong><br>
                        
                      </div>
                    </div>
                </div>     
              </div>
            `;
	}
}

async function cardRunningCount(value) {
	/* 운동 횟수 띄우는 위젯 함수 */
	const response = await fetch(`${backend_base_url}/articles/my000/`, {
		headers: {
			Authorization: "Bearer " + localStorage.getItem("access"),
		},
		method: "GET",
	});

	if (response.status == 200) {
		const response_json = await response.json();
		const checkCount1 = response_json[0].check_status_count;
		let speed = checkCount1 / 5;
		let card_running = `
		<div class="col">
			<div class="card" style="width: 203.5%;margin: 10px 0px" >
				<div class="card-body">
					<div class="animation-box">
						<lottie-player src="https://assets1.lottiefiles.com/packages/lf20_q1c2x59v.json"
						background="transparent"
						style="width: 60px; height: 60px; margin:auto;"
						speed=${speed}
						loop
						autoplay></lottie-player>
						
					</div>
					

				<div class="fontContainer">
					<strong>"벌써 ${checkCount1}번째!"</strong><br>
				</div>
				
			
		`;
		if (value == -1) {
			card_running = card_running.concat(
				" ",
				`<h7>위치정보 수집이 되지 않아 서울 날씨를 가져왔어요.</h7> </div></div>     
		</div>`
			);
		} else {
			card_running = card_running.concat(`</div></div>     
		</div>`);
		}
		document.getElementById("running").innerHTML = card_running;
	}
}

async function settingCookieForSite() {
	/* 날씨등의 쿠키 저장하는 함수 */
	var position = await successFail(position);
	var latitude;
	var longitude;
	if (position[0] != -1) {
		latitude = position[0];
		longitude = position[1];
		setCookie("success_or_fail", 1, 5);
	} else {
		latitude = 37.541;
		longitude = 126.986;
		setCookie("success_or_fail", -1, 5);
	}

	const response = await fetch(`${backend_base_url}/articles/weather/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			lat: latitude,
			lon: longitude,
		}),
	});

	var response_json = await response.json();
	var time_measure = [];
	var weather = {};
	weather["rain"] = [];
	weather["time_measure"] = [];
	weather["icon"] = [];
	weather["recommendation"] = [];
	weather["temperature"] = [];
	weather["rain_amount"] = [];

	for (var i = 0; i < 6; i++) {
		time_measure[i] = Object.keys(response_json[0][i]);
		weather["recommendation"][i] = response_json[1][i];

		weather["rain"][i] = forecast(response_json[0][i][time_measure[i]]);
		weather["icon"][i] = weatherIcon(response_json[0][i][time_measure[i]]);
		weather["rain_amount"][i] = response_json[3][i];
		weather["temperature"][i] = response_json[2][i];
	}
	setCookie("time", time_measure, 5);
	setCookie("rain", weather["rain"], 5);
	setCookie("rain_amount", weather["rain_amount"], 5);
	setCookie("temperature", weather["temperature"], 5);
	setCookie("recommendation", weather["recommendation"], 5);
	setCookie("icon", weather["icon"], 5);
	return weather;
}

function sleep(delay) {
	return new Promise((resolve) => setTimeout(resolve, delay));
}

window.onload = async function loadMainPage() {
	/* var weather 날씨 정보를 담는 딕셔너리 */
	buildCalendar();
	var weather = {};
	let retry_count = 10;
	while (getCookie("time") == null) {
		try {
			weather = await settingCookieForSite();
		} catch {
			sleep(1000);
		}
		retry_count -= 10;
		if (retry_count == 0) {
			break;
		}
	}

	time_list = getCookie("time").split(",");
	rain_list = getCookie("rain").split(",");
	rain_amount_list = getCookie("rain_amount").split(",");
	temperature_list = getCookie("temperature").split(",");
	recommendation_list = getCookie("recommendation").split(",");
	icon_list = getCookie("icon").split(",");

	var template = [];
	var result = "";
	card(template, weather);
	for (var i = 0; i < 6; i++) {
		result = result.concat(" ", template[i]);
	}

	document.getElementById("param1").innerHTML = result; //html로 template 전달

	cardRunningCount(getCookie("success_or_fail"));
};
