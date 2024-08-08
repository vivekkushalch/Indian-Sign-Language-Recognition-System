//meta(not so imp) functions by vkc!

let gttsBtn = document.getElementById('gtts-btn');
let cameraBtn = document.getElementById('camera-btn');
let uploadBtn = document.querySelector('#upload-btn');
let textArea = document.querySelector('#textarea');
let line = document.createElement('p');
line.className = "line"
line.id = "last-line"
line.innerHTML = `Ready to roll !`
textArea.appendChild(line)
line.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest"
});

//open github repo
document.querySelector('#webcam-banner').addEventListener('click', function () {
    window.open('https://github.com/vivekkushalch/Indian-Sign-Language-Recognition-System/', '_blank');
})



// test function
async function addTestLines(totalLines) {
    for (let i = 1; i < totalLines + 1; i++) {
        let line = document.createElement('p');
        line.className = "line"
        line.innerHTML = `Hello`
        textArea.appendChild(line)
        line.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "nearest"
        });
    }
}
// addTestLines(10);

uploadBtn.addEventListener('click', function () {
    uploadBtn.style.background = "#D4EC7E";
    let text = 'Comming Soon!'
    addNewTranslateLine(text)
    tts(text)
    uploadBtn.style.background = "#EAF1C5"
})





// adds new line in transcript box
async function addNewTranslateLine(text) {
    let lastLine = textArea.lastElementChild;
    try {
        document.querySelector('#last-line').id = '';
    } catch (err) {
        console.log(err)
    }

    let newLine = document.createElement('p');
    newLine.innerHTML = text;
    newLine.className = "line";
    newLine.id = 'last-line';
    textArea.appendChild(newLine);
    newLine.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest"
    })
}


// start sign prediction
cameraBtn.addEventListener("click", function () {
    if (cameraBtn.style.backgroundColor === 'rgb(212, 236, 126)') {
        cameraBtn.style.background = "#EAF1C5"; //deactivate btn
        alert('stopping... Press OK')
        location.reload()

    } else {
        cameraBtn.style.background = "#D4EC7E";
        document.getElementById("webcam-banner").style.display = "none"; // remove banner
        document.getElementById("canvas").style.display = "block"; // display web cam 
        alert('starting.... Press OK')
        init();
    }
});

// text to speach btn colour change
gttsBtn.addEventListener("click", function () {
    if (gttsBtn.style.backgroundColor === 'rgb(212, 236, 126)') {
        gttsBtn.style.background = "#EAF1C5"; //dactivate btn
        // alert('stopping... Press OK')
        // location.reload()

    } else {
        gttsBtn.style.background = "#D4EC7E";
        // alert('starting.... Press OK')
        // init();
    }
});


//text to speech
async function tts(text) {
    if ('speechSynthesis' in window) {
        // Speech Synthesis is supported 🎉
        console.log('');
    } else {
        alert('Text to speech not available 😞');
        location.reload();
    }

    let msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);

}

// delay function
const delay = ms => new Promise(res => setTimeout(res, ms));

/////////////////////////////////////
// tensorflow.js magic /////////////
////////////////////////////////////
let model, webcam, ctx, labelContainer, maxPredictions;
async function init() {
    const modelURL = "https://vivekkushalch.github.io/Indian-Sign-Language-Recognition-System/model.json";
    const metadataURL = "https://vivekkushalch.github.io/Indian-Sign-Language-Recognition-System/metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 200;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    // labelContainer = document.getElementById("textarea");
    // for (let i = 0; i < maxPredictions; i++) { // and class labels
    //     let para = document.createElement("p");
    //     para.className = "line";
    //     labelContainer.appendChild(para);
    // }

}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {
        pose,
        posenetOutput
    } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        // if (prediction[i].probability.toFixed(2) == 1.00) {
        //     console.log(prediction[i].probability.toFixed(2), prediction[i].className)
        // }
        // const classPrediction =  prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        if (prediction[i].probability.toFixed(2) == 1.00) {
            if (document.querySelector('#last-line').innerHTML != prediction[i].className) {
                await addNewTranslateLine(prediction[i].className);
                if (gttsBtn.style.backgroundColor === 'rgb(212, 236, 126)') { //btn active
                    await tts(prediction[i].className)
                    // delay(0)
                } else {
                    console.log('')
                }
            }

            // labelContainer.childNodes[i].innerHTML = prediction[i].className;

            
        }

    }

    // finally draw the poses
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5; //0.5
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}
