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



function getPosition() { // 현재 위치 뽑아내고 위치 정보 수집 동의 띄우는 함수
  // Simple wrapper
  return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
  });
}

function success(obj, { coords, timestamp }) { // getPostion함수에서 넘어오게 될 함수
  const latitude = coords.latitude.toString();   // 위도
  const longitude = coords.longitude.toString(); // 경도
  obj = {'latitude': latitude, 'longitude' : longitude};

  return obj
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




window.onload = async function loadMainPage() {

    if ((getCookie('time') == null)) {
      var position = await getPosition()
      var latitude = position.coords['latitude']
      var longitude = position.coords['longitude']
      const response = await fetch('http://localhost:8000/articles/weather/',{ // 백엔드로 위치 정보 전달
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
        weather["recommendation"][i] = response_json[1][i]; // 운동추천
        weather["rain"][i]=forecast(response_json[0][time_measure[i]]) // 날씨
        weather["icon"][i]=weatherIcon(Object.keys(weather["rain"])[i]); // 아이콘 사진 경로 저장
        weather["rain_amount"][i]=response_json[3][i]; // 강수량
        weather["temperature"][i]=response_json[2][i]; // 기온
          
      }
      setCookie('time', time_measure, 5) // 쿠키 저장
      setCookie('rain', weather['rain'], 5)
      setCookie('rain_amount', weather['rain_amount'], 5)
      setCookie('temperature', weather['temperature'], 5)
      setCookie('recommendation', weather['recommendation'], 5)
      setCookie('icon', weather['icon'], 5)
  }
    time_list = getCookie('time').split(','); // 쿠키 불러와서 배열로 만듦. getCookie로 하면 ,가 기본적으로 들어와짐.
    rain_list = getCookie('rain').split(',');
    rain_amount_list = getCookie('rain_amount').split(',');
    temperature_list = getCookie('temperature').split(',');
    recommendation_list = getCookie('recommendation').split(',');
    icon_list = getCookie('icon').split(',');
    console.log('time',time_list)
    console.log('rain',getCookie('rain'))
    console.log('rain',getCookie('rain_amount'))
    console.log('rain',getCookie('recommendation'))
    console.log('rain',getCookie('temperature'))

    var template = [] //html 카드 자동생성 템플릿
    var result = ""
    card(template, weather) //html 카드 자동생성 템플릿
    for (var i = 0; i < 6; i++) {
      result = result.concat(" ", template[i]);
    }
    document.getElementById('param1').innerHTML=result; //html로 template 전달

    
    



}


