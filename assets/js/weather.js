// const backend_base_url = "http://127.0.0.1:8000"
// const frontend_base_url = "http://127.0.0.1:5500"

function setCookie(cookie_name, value, minutes) {
  const exdate = new Date();
  exdate.setMinutes(exdate.getMinutes() + minutes);
  const cookie_value = escape(value) + ((minutes == null) ? '' : '; expires=' + exdate.toUTCString());
  document.cookie = cookie_name + '=' + cookie_value;
}

function getCookie(cookie_name) {
  var x, y;
  var val = document.cookie.split(';');

  for (var i = 0; i < val.length; i++) {
    x = val[i].substr(0, val[i].indexOf('='));
    y = val[i].substr(val[i].indexOf('=') + 1);
    x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
    if (x == cookie_name) {
      return unescape(y); // unescape로 디코딩 후 값 리턴
    }
  }
}



async function getPosition() { // 현재 위치 뽑아내고 위치 정보 수집 동의 띄우는 함수
  // Simple wrapper
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
  
}


async function success_fail(position) { // getPostion함수에서 넘어오게 될 함수
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


function forecast(value) { // 날씨 반환하는 함수
  let forecast_dict = { 
  "0" : "맑음", 
  "1" : "비", 
  "2": "비 또는 눈", 
  "3": "눈", 
  "4": "소나기", 
  "5": "빗방울", 
  "6": "빗방울눈날림", 
  "7": "눈날림"
};

  return forecast_dict[value];

  }
function weatherIcon(value) { // 아이콘 경로 저장하는 함수
  let icon_dict = { 
    "0" : "0_bright", 
    "1" : "1_rain", 
    "2": "2_sleet", 
    "3": "3_snow", 
    "4": "4_shower", 
    "5": "5_drizzle", 
    "6": "6_drizzle_snow", 
    "7": "7_snow_litte"
  };
  return "./assets/images/weather_icon/" + icon_dict[value] + ".svg";
}

function card(template, weather) { // 카드 자동생성 함수
  for ( var i = 0; i < 6 ; i++){
          template[i] = `
              <div class="col">
                <div class="card h-100" >
                    <img class="myimg" src=${icon_list[i]} class="card-img-top" style="width: 30%; margin: auto; padding: 2%">
                    <div class="card-body">
                      <div class="fontContainer">
                        
                        시각: <strong>${time_list[i]}시</strong><br>
                        기온: <strong>"${temperature_list[i]}도"</strong><br>
                        추천 운동:<strong>"${recommendation_list[i]}"</strong><br>
                        
                      </div>
                    </div>
                </div>     
              </div>
            `
  }
  
}

function card_fail(template) { // 카드 실패 했을 때 띄울 거

  template[0] = `
      <div class="col">
        <div class="card h-100" >
            <img class="myimg" src="./assets/images/weather_icon/emoji-smile-fill.svg" class="card-img-top" style="width: 30%; margin: auto; padding: 2%">
            <div class="card-body">
              <div class="fontContainer">
                <strong>"오늘도 화이팅!"</strong><br>
              </div>
            </div>
        </div>     
      </div>
    `
  
}




window.onload = async function loadMainPage() {
  buildCalendar()
  if ((getCookie('success_or_fail') == null)) {
    var position = await success_fail(position) // -1일 경우 위치정보 수집 거부.
    console.log("position",position);
    if (position[0] != -1){
      var latitude = position[0]
      var longitude = position[1]
      console.log("long",longitude)
      const response = await fetch(`${back_base_url}/articles/weather/`,{ // 백엔드로 위치 정보 전달
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'lat': latitude,
          'lon' : longitude
        })
      });

      var response_json = await response.json(); // 백엔드에서 날씨 정보 받음.
      var time_measure = []; // 측정 시간
      var weather = {};
      weather["rain"] = [];
      weather["time_measure"] = [];
      weather["icon"] = [];
      weather["recommendation"] = [] 
      weather["temperature"] = []
      weather["rain_amount"] = []

      for (var i = 0; i < 6; i++) {
        time_measure[i] = Object.keys(response_json[0][i]);
        console.log('time222222',time_measure[i])
        console.log('response',response_json[0][i])
        weather["recommendation"][i] = response_json[1][i]; // 운동추천
        weather["rain"][i]=forecast(response_json[0][i][time_measure[i]]) // 날씨
        console.log('rain2222',weather["rain"][i])
        console.log('rain33333',response_json[0][i][time_measure[i]])
        weather["icon"][i]=weatherIcon(response_json[0][i][time_measure[i]]); // 아이콘 사진 경로 저장
        console.log("icoooooo",response_json[0][i][time_measure[i]])
        weather["rain_amount"][i]=response_json[3][i]; // 강수량
        weather["temperature"][i]=response_json[2][i]; // 기온
          
      }
      setCookie('time', time_measure, 5); // 쿠키 저장
      setCookie('rain', weather['rain'], 5);
      setCookie('rain_amount', weather['rain_amount'], 5);
      setCookie('temperature', weather['temperature'], 5);
      setCookie('recommendation', weather['recommendation'], 5);
      setCookie('icon', weather['icon'], 5);
      setCookie('success_or_fail', 1, 5); // 쿠키 제대로 저장됐으면 1 아니면 -1
      console.log("success_or_fail",getCookie('success_or_fail'))
    }
    else {
      console.log("long",longitude)
      setCookie('success_or_fail', -1, 5);
      console.log(getCookie('success_or_fail'))
    }
    
  }
  console.log("hello")
  if (getCookie('success_or_fail') == '1'){ //쿠키가 제대로 저장이 됨.
    console.log("hello2")
    time_list = getCookie('time').split(','); // 쿠키 불러와서 배열로 만듦. getCookie로 하면 ,가 기본적으로 들어와짐.
    rain_list = getCookie('rain').split(',');
    rain_amount_list = getCookie('rain_amount').split(',');
    temperature_list = getCookie('temperature').split(',');
    recommendation_list = getCookie('recommendation').split(',');
    icon_list = getCookie('icon').split(',');
    console.log('time',time_list);
    console.log('rain',getCookie('rain'));
    console.log('rain',getCookie('rain_amount'));
    console.log('rain',getCookie('recommendation'));
    console.log('rain',getCookie('temperature'));

    var template = [] //html 카드 자동생성 템플릿
    var result = ""
    card(template, weather) //html 카드 자동생성 템플릿
    for (var i = 0; i < 6; i++) {
      result = result.concat(" ", template[i]);
    }
    document.getElementById('param1').innerHTML=result; //html로 template 전달
    console.log(template);
  }
  else {// 쿠키가 제대로 저장되지 않음.
    console.log("HEEEEEE")
    var template = [];
    var result = "";
    card_fail(template);
    for (var i = 0; i < 1; i++) {
      result = result.concat(" ", template[i]);
    }
    console.log(template)
    document.getElementById('param1').innerHTML=result;
    console.log(template);
  }
  
  



}


