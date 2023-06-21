// const backend_base_url = "http://127.0.0.1:8000"
// const frontend_base_url = "http://127.0.0.1:5500"

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
                <div class="card h-100">
                    <img class="myimg" src=${id["icon"][i]} class="card-img-top">
                    <div class="card-body">
                      <p>측정 시각: <strong>${id["time_measure"][i]}시</strong></p>
                      <p>날씨: <strong>${id["rain"][i]}</strong></p>
                      <p>1시간 강수량: <strong>"${id["rain_amount"][i]}"</strong> 입니다!</p>
                      <p>기온: <strong>"${id["temperature"][i]}도"</strong> 입니다!</p>
                      <p>추천 운동은 <strong>"${id["recommendation"][i]}"</strong> 입니다!</p>
                    </div>
                </div>     
              </div>
            `
  }
  
}

function showSpinner() {
  document.getElementById("spinner").style.display = "block";
}


function hideSpinner() {
  document.getElementById("spinner").style.display = "none";
}

async function sendingData() {

  var position = await getPosition()
    console.log("position",position)
    showSpinner()
    var latitude = position.coords['latitude']
    var longitude = position.coords['longitude']
    const data = await fetch('http://localhost:8080/articles/weather/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'lat': "hello"
      })
    });

    
}

window.onload = async function loadMainPage() {
    
    var position = await getPosition()
    showSpinner()
    var latitude = position.coords['latitude']
    var longitude = position.coords['longitude']
    const data = await fetch('http://localhost:8000/articles/weather/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'lat': "hello"
      })
    });
    console.log("data",data)



    // sendingData()
    
    const response = await fetch('http://127.0.0.1:8000/articles/weather/', {
        method:"GET"
    })
    console.log("hello")
    response_json = await response.json();
    // console.log("hello")
    console.log(response_json);
    // response_json.forEach(rain => {
    //     const rain = document.createElement("li")
    // })
    const rain_cookie = response_json[0]
    const recommendation_cookie = response_json[1]
    const temperature_cookie = response_json[2]
    const rain_amount_cookie = response_json[3]
    var icon = [];
    var rain = [];
    var time_measure = [];
    var recommendation = [];
    var id = {};
    id["rain"] = [];
    id["time_measure"] = [];
    id["icon"] = [];
    id["recommendation"] = []  ;
    id["temperature"] = []
    id["rain_amount"] = []

    var template = []
    var result = ""

    for (var i = 0; i < 6; i++) {
      time_measure[i] = Object.keys(rain_cookie[i]).toString();
      id["time_measure"][i] = time_measure[i].slice(0,2);
      id["recommendation"][i] = recommendation_cookie[i];
      id["rain"][i]=forecast(rain_cookie[i][time_measure[i]])
      id["icon"][i]=weatherIcon(rain_cookie[i][time_measure[i]]);
      id["rain_amount"][i]=rain_amount_cookie[i];
      console.log(rain_amount_cookie[i])
      id["temperature"][i]=temperature_cookie[i];
      
    }
    card(template,id)
     '<div class="row row-cols-1 row-cols-md-6 g-6">'


    for (var i = 0; i < 6; i++) {
      result = result.concat(" ", template[i]);
      
    }
    result = result.concat(" ","</div>");
    document.getElementById('param1').innerHTML=result;
    hideSpinner()
    
    console.log(result)
    



}


      // document.getElementById('time_measure_'+i.toString()).innerHTML=time_measure[i];
      // document.getElementById('rain_'+i.toString()).innerHTML=rain[i];
      // document.getElementById('recommendation_'+i.toString()).innerHTML=recommendation_cookie[i];
      // document.getElementById('icon_'+i.toString()).src=icon[i];