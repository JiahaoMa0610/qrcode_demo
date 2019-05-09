var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");
var h4 = document.getElementById("qr_data");
//var img;

var counter = 0;

function drawLine(begin, end, color) {
    canvas.beginPath();
    canvas.moveTo(begin.x, begin.y);
    canvas.lineTo(end.x, end.y);
    canvas.lineWidth = 4;
    canvas.strokeStyle = color;
    canvas.stroke();
}

let constrain = {
    audio: false,
    video: {
        width: { min: 480, max: 480 },
        height: { min: 320, max: 320 }
    }
};

// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices.getUserMedia(constrain).then(function (stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    myre = requestAnimationFrame(tick);
});

var check = false;

function tick() {
    loadingMessage.innerText = "⌛ Loading video..."
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        loadingMessage.hidden = true;
        canvasElement.hidden = false;
        outputContainer.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });
       // img = code;
        if (code) {
            //these are styling codes
            drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
            drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
            drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
            drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
            outputMessage.hidden = true;
            outputData.parentElement.hidden = false;
            //data from qr code is now in code variable, 
            //to get data just call code.data
            outputData.innerText = code.data;
            
            h4.innerText = code.data;
            var string = code.data;
            string = string.split(" ");
            var stringArray = new Array();
            for (var i = 0; i < string.length; i++) {
                stringArray.push(string[i]);
                if (i != string.length - 1) {
                    stringArray.push(" ");
                }
            }
            stringArray.toString();
            console.log(stringArray);


            check = true;

        } else {
            outputMessage.hidden = false;
            outputData.parentElement.hidden = true;
        }

    }

    myre = requestAnimationFrame(tick);

    //comment out the block below to make video refreshing
    if (check)
    { 
        console.log(check);
        cancelAnimationFrame(myre);
        //window.close();
    }
}


//Here is the logic for taking a screen shot from camera
/*
const shot = document.getElementById('shot');
//   const screenshotButton = document.querySelector('shot');
const canvas2 = document.createElement('canvas');
shot.onclick = function () {
    canvas2.width = video.videoWidth;
    console.log(video.videoWidth);
    canvas2.height = video.videoHeight;
    canvas2.getContext('2d').drawImage(video, 0, 0);//take a image from video stream

    var url = canvas2.toDataURL("image/jpeg");//get url of the image
    var image = document.getElementById('id1');
    image.src = url;

}
*/
