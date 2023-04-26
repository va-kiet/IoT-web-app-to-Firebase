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

var preRoom = null
var curRoom = null

function loadData()
{
        //_______________________Load Room___________________________//
    firebase.database().ref("/ROOM/CURRENT").on("value",function(snapshot){
        preRoom = curRoom;
        curRoom = snapshot.val();  
        document.getElementById(curRoom).style="background-color: violet"
        document.getElementById(curRoom).disabled= true
        switch (curRoom)
        {
            case "liv": {
                document.getElementById("room").src = "./img/sofa.svg"
                document.getElementById("room-name").innerHTML = "Living Room"
                break;
            }
            case "bat": {
                document.getElementById("room").src = "./img/bathtub.svg"
                document.getElementById("room-name").innerHTML = "Bathroom"
                break;
            }
            case "bed": {
                document.getElementById("room").src = "./img/bed.svg"
                document.getElementById("room-name").innerHTML = "Bedroom"
                break
            }
            case "din": {
                document.getElementById("room").src = "./img/chair.svg"
                document.getElementById("room-name").innerHTML = "Dining Room"
                break;
            }
            case "kit": {
                document.getElementById("room").src = "./img/kitchen.svg"
                document.getElementById("room-name").innerHTML = "Kitchen"
                break;
            }
        }
        if ((preRoom != curRoom) &(preRoom != null))
        {
            document.getElementById(preRoom).style=""
            document.getElementById(preRoom).disabled= false
        }
    
    //_______________________Sensor___________________________//
        firebase.database().ref("/" + curRoom + "/SENSORS/TEMPERATURE").on("value",function(snapshot){
            var temp = snapshot.val();  
            document.getElementById("temp").innerHTML = temp + " °C";
        });

        firebase.database().ref("/" + curRoom + "/SENSORS/SMOKE").on("value",function(snapshot){
            var smoke = snapshot.val();  
            if (smoke == 1)
                document.getElementById("smk").innerHTML = "No Smoke";
            else
                document.getElementById("smk").innerHTML = "Detected";
        });

        firebase.database().ref("/" + curRoom + "/SENSORS/HUMIDITY").on("value",function(snapshot){
            var hum = snapshot.val();  
            document.getElementById("hum").innerHTML = hum + " %";
        });

        firebase.database().ref("/" + curRoom + "/SENSORS/LIGHT").on("value",function(snapshot){
            var lgt = snapshot.val();  
            document.getElementById("lgt").innerHTML = lgt;
        });
        //_______________________Devices___________________________//
        firebase.database().ref("/" + curRoom + "/DEVICES").get().then((snapshot) => {
            if(snapshot.exists()){
                var dev_status = snapshot.val()                 
                for (const [key, value] of Object.entries(dev_status)) {
                    enable(key);
                  }

                if (dev_status["LED1"] == 1)
                    document.getElementById("led1").checked = true
                else
                    document.getElementById("led1").checked = false
                
                if (dev_status["LED2"] == 1)
                    document.getElementById("led2").checked = true
                else
                    document.getElementById("led2").checked = false

                if (dev_status["MUSIC"] == "ON")
                    document.getElementById("music").checked = true
                else
                    document.getElementById("music").checked = false

                if (dev_status["WINDOW"] == "Opened")
                    document.getElementById("window").checked = true
                else
                    document.getElementById("window").checked = false

                firebase.database().ref("/" + curRoom + "/DEVICES/AIR_CONDITION").get().then((snapshot) => {
                    if(snapshot.exists()){
                        var ac_status = snapshot.val()
                        if (ac_status["STATUS"] == "ON")
                            document.getElementById("ac").checked = true
                        else
                            document.getElementById("ac").checked = false
                    }
                    else
                        document.getElementById("ac").checked = false
                })

                firebase.database().ref("/" + curRoom + "/DEVICES/LED_RGB").get().then((snapshot) => {
                    if(snapshot.exists()){
                        var rgb_status = snapshot.val()
                        if ((rgb_status["1_RED"] != 0) | (rgb_status["2_GREEN"] != 0) | (rgb_status["3_BLUE"] != 0))
                        {
                            firebase.database().ref("/" + curRoom + "/DEVICES/LED_RGB").update({
                                "STATUS": "ON"
                            })
                            document.getElementById("led-rgb").checked = true
                        }
                        else
                        {
                            firebase.database().ref("/" + curRoom + "/DEVICES/LED_RGB").update({
                                "STATUS": "OFF"
                            })
                            document.getElementById("led-rgb").checked = false
                        }
                    }
                    else
                        document.getElementById("led-rgb").checked = false
                })
            }
            else
            console.log("No data available!")
        })
    })
}

loadData()

function livButton(){
    firebase.database().ref("/ROOM").update({"CURRENT" : "liv"})
    window.open("index.html","_self")

}

function bedButton(){
    firebase.database().ref("/ROOM").update({"CURRENT" : "bed"})
    window.open("index.html","_self")
}

function kitButton(){
    firebase.database().ref("/ROOM").update({"CURRENT" : "kit"})
    window.open("index.html","_self")
}
function dinButton(){
    firebase.database().ref("/ROOM").update({"CURRENT" : "din"})
    window.open("index.html","_self")
}

function batButton(){
    firebase.database().ref("/ROOM").update({"CURRENT" : "bat"})
    window.open("index.html","_self")
}

function led1(){
    if (document.getElementById("led1").checked)
    {
        firebase.database().ref("/" + curRoom + "/DEVICES").update({
            "LED1": 0
        })
    }
    else
    {
        firebase.database().ref("/" + curRoom + "/DEVICES").update({
            "LED1": 1
        })
    }
}

function led2(){
    if (document.getElementById("led2").checked)
    {
        firebase.database().ref("/" + curRoom + "/DEVICES").update({
            "LED2": 0
        })
    }
    else
    {
        firebase.database().ref("/" + curRoom + "/DEVICES").update({
            "LED2": 1
        })
    }
}

function mp3Pl(){
    if (document.getElementById("music").checked)
    {
    firebase.database().ref("/" + curRoom + "/DEVICES").update({
        "MUSIC": "OFF"
    })
    }
    else
    {
    firebase.database().ref("/" + curRoom + "/DEVICES").update({
        "MUSIC": "ON"
    })
    }
}

function acPW(){
    if (document.getElementById("ac").checked)
    {
    firebase.database().ref("/" + curRoom + "/DEVICES/AIR_CONDITION").update({
        "STATUS": "OFF"
    })
    }
    else
    firebase.database().ref("/" + curRoom + "/DEVICES/AIR_CONDITION").update({
        "STATUS": "ON"
    })
}

function wind(){
    if (document.getElementById("window").checked)
    {
    firebase.database().ref("/" + curRoom + "/DEVICES").update({
        "WINDOW": "Closed"
    })
    }
    else
    {
    firebase.database().ref("/" + curRoom + "/DEVICES").update({
        "WINDOW": "Opened"
    })
    }
}

function RGB(){
    if (document.getElementById("led-rgb").checked)
    {
    firebase.database().ref("/" + curRoom + "/DEVICES/LED_RGB").update({
        "STATUS" : "OFF",
        "1_RED" : 0,
        "2_GREEN" : 0,
        "3_BLUE" : 0
    })
    }
    else
    firebase.database().ref("/" + curRoom + "/DEVICES/LED_RGB").update({
        "STATUS": "ON",
        "1_RED" : 255,
        "2_GREEN" : 255,
        "3_BLUE" : 255
    })
}

function acTemp(){
    window.open("acTemp.html","_self")
}

function RGBcolor(){
    window.open("RGBcolor.html","_self")
}

function disable(dev)
{
    document.getElementById(dev).style.display = 'none'
}

function enable(dev)
{
    document.getElementById(dev).style.display = 'flex'
}