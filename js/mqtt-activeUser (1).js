/**
 * Created by Malaka on 9/29/2019.
 */
var ip = "mqtt.jlanka.lk";
var port = "1887";
var usessl = true;
var id = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
var username = 'ccu-jlanka-lk';
var password = 'Mang0s!234';
var message, client;
var connected = false;
var widgetRepository = {}; //property names are datastreams(keys), values are widget objects

// function CreateWidget(config) {
//     var datastream = config.datastream;
//     if(Array.isArray(datastream)) {
//         datastream.forEach(function (element) {
//             widgetRepository.hasOwnProperty(element) ? console.log("Duplicate Datastream: " + element) : (widgetRepository[element] = config);
//             //widgetRepository[element] = config;
//         })
//     } else if (typeof datastream === 'string' || datastream instanceof String){
//         widgetRepository.hasOwnProperty(datastream) ? console.log("Duplicate Datastream: " + datastream) : (widgetRepository[config.datastream] = config);
//         //widgetRepository[config.datastream] = config;
//     }
// }

connectMQTT();
// function RenderWidgets() {
//
// }

// function printwidgetRepository() {
//     for (var widgetKey in widgetRepository) {
//         console.log("widgetKey: " + widgetKey);
//         if (widgetRepository.hasOwnProperty(widgetKey)) {
//             for (var widgetprop in widgetRepository[widgetKey]) {
//                 if (widgetRepository[widgetKey].hasOwnProperty(widgetprop)) {
//                     console.log(widgetprop + ': ' + widgetRepository[widgetKey][widgetprop]);
//                 }
//             }
//         }
//     }
// }

function connectMQTT() {
    client = new Paho.MQTT.Client(ip, Number(port), id);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
        userName: username,
        password: password,
        useSSL: usessl,
        onSuccess: onConnect,
        onFailure: onFailure,
        reconnect: true
    });
}

function onConnect() {
    console.log("Connected to server");

    connected = true;

    // client.subscribe("jlt/gpsapp/#",0);


    //each key is a datastream which is subscribed
    // Object.keys(widgetRepository).forEach(function(datastream,index) {
    //     client.subscribe(datastream, {
    //         qos: 0
    //     });
    // });
}

function onMessageArrived(message) {
    try {
        console.log("Recieved Message from server");
        var value = message.payloadString;
        var datastream = message.destinationName;
        console.log("datastream: " + datastream + ", value: " + value);

        // client.publish("test","ok");

    } catch (e) {
        console.log("exception in onMessageArrived: " + e);
        return false;
    }
}

function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}


function onFailure(responseObject) {

    connected = false;

    if (responseObject.errorCode === 8) {
        console.log("onFailure errorCode/errorMessage: " + responseObject.errorCode + "/" + responseObject.errorMessage);
        // $("#validateHeader").text("Invalid Username/Password. Please enter again.");

    } else if (responseObject.errorCode === 7) {
        console.log("onFailure errorCode/errorMessage: " + responseObject.errorCode + "/" + responseObject.errorMessage);
        // $("#validateHeader").html("New SSL Certificate added. Import SSL Certificate.");

    } else if (responseObject.errorCode !== 0 && responseObject.errorCode !== 8 && responseObject.errorCode !== 7) {
        console.log("onFailure errorCode/errorMessage: " + responseObject.errorCode + "/" + responseObject.errorMessage);
        // $("#validateHeader").text("Contact Administrator.");

    }


    client = null;
    setTimeout(connectMQTT, 10000);

}

var PublicIP = "";
getPublicIP();
function getPublicIP() {
    $.getJSON("https://api.ipify.org?format=jsonp&callback=?",
        function(json) {
            // document.write("My public IP address is: ", json.ip);
            PublicIP =json.ip;
        }
    );



    setTimeout(getPublicIP, 300000);
}





function sendActiveUserData() {

    // console.log("active"+connected);
    if (connected)
    {
        var UserObj ={"logedUserId":"HD"+logedUserId,"logedUserName":logedUserName,"userImg":userImg,"logedUserDeptDescription":logedUserDeptDescription,"PublicIP":PublicIP}
        // console.log(UserObj);

        client.publish("jlt/helpdesk/activeUsers",JSON.stringify(UserObj));
    }


    setTimeout(sendActiveUserData, 10000);
}
setTimeout(sendActiveUserData, 500);


// while (true)
// {

// }
