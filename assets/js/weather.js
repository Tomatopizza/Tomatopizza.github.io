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

function success(obj, { coords, timestamp }) {
  const latitude = coords.latitude.toString();   // 위도
  const longitude = coords.longitude.toString(); // 경도
  obj = {'latitude': latitude, 'longitude' : longitude};
  
  
  

  return obj
}

function getPosition() {
  // Simple wrapper
  return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
  });
}

function forecast(value) {
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
    // if ( value == 0 ) {
    //   forecast = "맑음";
    // } else if ( value == 1) {
    //   forecast = "비";
    // } else if ( value == 2) {
    //   forecast = "비 또는 눈";
    // } else if ( value == 3) {
    //   forecast = "눈";
    // } else if ( value == 4) {
    //   forecast = "소나기";
    // } else if ( value == 5) {
    //   forecast = "빗방울";
    // } else if ( value == 6) {
    //   forecast = "빗방울눈날림";
    // } else if ( value == 7) {
    //   forecast = "눈날림";
    // }
  return forecast_dict[value];

  }
function weatherIcon(value) {
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

function card(template,id) {
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
            // <h6>시각: <strong>${time_list[i]}시</strong></h6>
            // <h6>강수량: <strong>"${rain_amount_list[i]}"</strong></h6>
            // <h6>기온: <strong>"${temperature_list[i]}도"</strong></h6>
            // <h6>추천 운동:<strong>"${recommendation_list[i]}"</strong></h6>
            // <p>날씨: <strong>${rain_list[i]}</strong></p>
  }
  
}

function showSpinner() {
  document.getElementById("spinner").style.display = "block";
}


function hideSpinner() {
  document.getElementById("spinner").style.display = "none";
}


window.onload = async function loadMainPage() {
    // showSpinner()
    if ((getCookie('time') == null)) {
      var position = await getPosition()
      var latitude = position.coords['latitude']
      var longitude = position.coords['longitude']
      const response = await fetch('http://localhost:8000/articles/weather/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'lat': latitude,
          'lon' : longitude
        })
      });
      var response_json = await response.json();


      var time_measure = []
      var recommendation = [];
      var rain = [];
      const rain_cookie = response_json[0]
      const recommendation_cookie = response_json[1]
      console.log(response_json[0])
      const temperature_cookie = response_json[2]
      const rain_amount_cookie = response_json[3]
      var icon = [];
      var id = {};
      id["rain"] = [];
      id["time_measure"] = [];
      id["icon"] = [];
      id["recommendation"] = [] 
      id["temperature"] = []
      id["rain_amount"] = []
      for (var i = 0; i < 6; i++) {
        time_measure[i] = Object.keys(response_json[0][i]);
        console.log(time_measure[i])
        id["recommendation"][i] = recommendation_cookie[i];
        id["rain"][i]=forecast(rain_cookie[i][time_measure[i]])
        id["icon"][i]=weatherIcon(rain_cookie[i][time_measure[i]]);
        id["rain_amount"][i]=rain_amount_cookie[i];
        console.log(rain_amount_cookie[i])
        id["temperature"][i]=temperature_cookie[i];
        
      }
      setCookie('time', time_measure, 5)
      setCookie('rain', id['rain'], 5)
      setCookie('rain_amount', id['rain_amount'], 5)
      setCookie('temperature', id['temperature'], 5)
      setCookie('recommendation', id['recommendation'], 5)
      setCookie('icon', id['icon'], 5)
  }

    time_list = getCookie('time').split(',');
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
    console.log('rain',icon)

    var template = []
    var result = ""
    card(template,id)
    
    console.log(template)


    for (var i = 0; i < 6; i++) {
      result = result.concat(" ", template[i]);
      
    }
    // result = result.concat(" ","</div>");
    document.getElementById('param1').innerHTML=result;
    // hideSpinner()
    
    console.log(result)
    



}


      // document.getElementById('time_measure_'+i.toString()).innerHTML=time_measure[i];
      // document.getElementById('rain_'+i.toString()).innerHTML=rain[i];
      // document.getElementById('recommendation_'+i.toString()).innerHTML=recommendation_cookie[i];
      // document.getElementById('icon_'+i.toString()).src=icon[i];