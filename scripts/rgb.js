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

const redSlider = document.getElementById("red");
const redValue = document.getElementById("red-value");

const greenSlider = document.getElementById("green");
const greenValue = document.getElementById("green-value");

const blueSlider = document.getElementById("blue");
const blueValue = document.getElementById("blue-value");

redSlider.addEventListener("input", function() {
  redValue.innerHTML = redSlider.value;
});


greenSlider.addEventListener("input", function() {
  greenValue.innerHTML = greenSlider.value;
});


blueSlider.addEventListener("input", function() {
  blueValue.innerHTML = blueSlider.value;
});
 
var curRoom = null

function loadRGB(){
  firebase.database().ref("/ROOM/CURRENT").on("value", function(snapshot){
   window.curRoom = snapshot.val(); 
   console.log(curRoom)

  firebase.database().ref("/" + curRoom + "/LED_RGB").get().then((snapshot) => {
      if(snapshot.exists()){
          var rgb_status = snapshot.val()
          var red = rgb_status["1_RED"]
          var green = rgb_status["2_GREEN"]
          var blue = rgb_status["3_BLUE"]

          redSlider.value = red
          greenSlider.value = green
          blueSlider.value = blue
          redValue.innerHTML = redSlider.value;
          greenValue.innerHTML = greenSlider.value;
          blueValue.innerHTML = blueSlider.value;
          document.getElementById("color").style="background-color: rgb("+red+","+green+","+blue+");"
      }
    })
})
}

loadRGB()

function changeRGB(){
  console.log(curRoom)
    document.getElementById("color").style="background-color: rgb("+redSlider.value+","+greenSlider.value+","+blueSlider.value+");"
    firebase.database().ref("/" + curRoom + "/LED_RGB").update({
      "1_RED": redSlider.value
  })
    firebase.database().ref("/" + curRoom + "/LED_RGB").update({
      "2_GREEN": greenSlider.value
  })
    firebase.database().ref("/" + curRoom + "/LED_RGB").update({
      "3_BLUE": blueSlider.value
  })
}

function back(){
  window.open("/indexs/index.html","_self")
}