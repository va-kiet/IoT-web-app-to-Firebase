const firebaseConfig = {
  apiKey: "AIzaSyCRhFTgQzK70t0mjJxAg9zVn_7OERIJnDY",
  authDomain: "esp32-dht11-22.firebaseapp.com",
  databaseURL: "https://esp32-dht11-22-default-rtdb.firebaseio.com",
  projectId: "esp32-dht11-22",
  storageBucket: "esp32-dht11-22.appspot.com",
  messagingSenderId: "861995838162",
  appId: "1:861995838162:web:5841c98ba8054281d85b0b",
};

firebase.initializeApp(firebaseConfig);

const temperatureSlider = document.getElementById("ac-temperature");
const temperatureValue = document.getElementById("temperature-value");

temperatureSlider.addEventListener("input", function() {
  temperatureValue.innerHTML = temperatureSlider.value + "°C";
});

function loadTemp(){
  firebase.database().ref("/ROOM/CURRENT").on("value", function(snapshot){
   window.curRoom = snapshot.val(); 
   console.log(curRoom)

  firebase.database().ref("/" + curRoom + "/AIR_CONDITION").get().then((snapshot) => {
      if(snapshot.exists()){
          var ac_status = snapshot.val()
          var temp = ac_status["TEMP"]
          temperatureSlider.value = temp
          temperatureValue.innerHTML = temperatureSlider.value + "°C";
        }}
    )}
  )}

loadTemp()

function adjTemp(){
  firebase.database().ref("/" + curRoom + "/AIR_CONDITION").update({
    "TEMP": temperatureSlider.value
  })
}

function back(){
  window.open("/indexs/index.html","_self")
}