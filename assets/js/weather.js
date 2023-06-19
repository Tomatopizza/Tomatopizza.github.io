const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

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

window.onload = async function loadMainPage() {
    
    const response = await fetch('http://127.0.0.1:8000/articles/weather/', {
        method:"GET"
    })
    // console.log("hello")
    response_json = await response.json();
    // console.log("hello")
    console.log(response_json);
    // response_json.forEach(rain => {
    //     const rain = document.createElement("li")
    // })
    // const rain_cookie = document.getElementById("rain");
    var icon = [];
    var rain = [];
    var time_measure = [];
    for (var i = 0; i < 6; i++) {
      time_measure[i] = Object.keys(response_json[i]).toString();
      console.log(time_measure[i])
      rain[i] = forecast(response_json[i][time_measure[i]])
      icon[i] = weatherIcon(response_json[i][time_measure[i]]);
      document.getElementById('time_measure_'+i.toString()).innerHTML=time_measure[i];
      document.getElementById('rain_'+i.toString()).innerHTML=rain[i];
      document.getElementById('icon_'+i.toString()).src=icon[i];
    }

    console.log(icon[0])
    // var icon_0 = weather(response_json[0][time_0])
    
    // icon_0.innerText = weatherIcon(response_json[0][time_0]);
    // icon_1.innerText = weatherIcon(response_json[1][time_1]);
    // icon_2.innerText = weatherIcon(response_json[2][time_2]);
    // icon_3.innerText = weatherIcon(response_json[3][time_3]);
    // icon_4.innerText = weatherIcon(response_json[4][time_4]);
    // icon_5.innerText = weatherIcon(response_json[5][time_5]);
    // rain.innerText = response_json[0]['0600']

    // setCookie('rain', response_json, 10)
    // var a = getCookie('rain')
    // console.log(Object.values(getCookie('rain')))
}