//meta(not so imp) functions by vkc!

const modelURL = "https://teachablemachine.withgoogle.com/models/riOJKjJZ1/model.json";
const metadataURL = "https://teachablemachine.withgoogle.com/models/riOJKjJZ1/metadata.json";



let gttsBtn = document.getElementById('gtts-btn');
let cameraBtn = document.getElementById('camera-btn');
let uploadBtn = document.querySelector('#upload-btn');
let textArea = document.querySelector('#textarea');
let backBtn = document.querySelector("#back-btn")
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


// back btn
backBtn.addEventListener("click", function() {
    window.location = '/'
})


let webcamON = false

//open github repo
document.querySelector('#webcam-banner').addEventListener('click', function() {
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
// cameraBtn.addEventListener("click", function() {
//     if (cameraBtn.style.background === '#62E6BF') {
//         cameraBtn.style.background = "#EAF1C5"; //deactivate btn
//         alert('stopping... Press OK')
//         location.reload()

//     } else {
//         cameraBtn.style.background = "#62E6BF";
//         document.getElementById("webcam-banner").style.display = "none"; // remove banner
//         document.getElementById("canvas").style.display = "block"; // display web cam 
//         alert('starting.... Press OK')
//         init();
//     }
// });

// start sign prediction
cameraBtn.addEventListener("click", function() {
    if (webcamON) {
        location.reload()
    } else {
        webcamON = true
        cameraBtn.style.background = "#62E6BF";
        document.getElementById("webcam-banner").style.display = "none"; // remove banner
        document.getElementById("canvas").style.display = "block"; // display web cam 
        alert('starting.... Press OK')
        init();
    }
})

// text to speach btn colour change
gttsBtn.addEventListener("click", function() {
    if (gttsBtn.style.backgroundColor === 'rgb(212, 236, 126)') {
        gttsBtn.style.background = "#EAF1C5"; //dactivate btn
        // alert('stopping... Press OK')
        // location.reload()

    } else {
        gttsBtn.style.background = "#62E6BF";
        // alert('starting.... Press OK')
        // init();
    }
});



let file;

async function predictImage(file) {
    const modelURL = 'https://teachablemachine.withgoogle.com/models/riOJKjJZ1/';
    const model = await tmImage.load(modelURL + 'model.json', modelURL + 'metadata.json');


    const imagePreview = document.getElementsByClassName('webcam-view');



    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async() => {
        imagePreview.src = reader.result;
        const imageElement = document.createElement('img');
        imageElement.src = reader.result;
        const prediction = await model.predict(imageElement);
        addNewTranslateLine(predictions)
        console.log(prediction);
    };
};


//upload img
uploadBtn.addEventListener('click', function() {
    uploadBtn.style.background = "#62E6BF";
    uploadBtn.style.background = ""
    const fileInput = document.querySelector('#file-input');
    fileInput.click()
    fileInput.addEventListener('change', async(event) => {
        file = event.target.files[0];
        if (!file) {
            console.error('No file selected.');
            return;
        }
    })
    predictImage(file)
        // let fileInput = document.querySelector('#file-input')
        // fileInput.click();
        // fileInput.addEventListener('change', async(event) => {
        //     const file = event.target.files[0];
        //     if (!file) {
        //         console.error('No file selected.');
        //         return;
        //     }

    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = async() => {
    //         let img = document.createElement('img')
    //         img.className = 'webcam-view'
    //         document.querySelector(".webcam-view").appendChild(img).src = reader.result;

    //         //predict image

    //         model = window.tmImage.load(modelURL, metadataURL);
    //         let flip = true;
    //         // maxPredictions = model.getTotalClasses();
    //         const prediction = await model.predict(img);
    //         console.log(prediction)
    //         addNewTranslateLine(prediction)

    //     };
    //     reader.onerror = (error) => {
    //         console.error(error);
    //     };
    // });



})





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
let index = 0
const spamFilter = ['I', `❤️`, 'I', 'N', 'D', 'I', 'A']
let beforeTextDone = 0;

/////////////////////////////////////
// tensorflow.js magic /////////////
////////////////////////////////////
let model, webcam, ctox, labelContainer, maxPredictions;
async function init() {
    //hello, welcome, thankyou, iloveu {>= 0.95}
    // const modelURL = "https://storage.googleapis.com/tm-model/C2gYk6JPd/model.json";
    // const metadataURL = "https://storage.googleapis.com/tm-model/C2gYk6JPd/metadata.json";

    //1,2,3,4,5{==1.0 meh}
    // const modelURL = "https://storage.googleapis.com/tm-model/qWNVsgTyJ/model.json";
    // const metadataURL = "https://storage.googleapis.com/tm-model/qWNVsgTyJ/metadata.json";



    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip 180
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.querySelector(".webcam-view").appendChild(webcam.canvas).className = 'canvas';
    labelContainer = document.getElementById("last-line");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        // if (prediction[i].probability.toFixed(2) == 1.00) {
        //     console.log(prediction[i].probability.toFixed(2), prediction[i].className)
        // }
        // const classPrediction =  prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        console.log(prediction[i].probability.toFixed(2), prediction[i].className)
        if (prediction[i].probability.toFixed(2) == 1.0) {
            if (prediction[i].className == spamFilter[index]) {
                index += 1;
                if (index == spamFilter.length) {
                    index = 0;
                }
                if (document.querySelector('#last-line').innerHTML != prediction[i].className) {
                    await addNewTranslateLine(prediction[i].className);
                    if (gttsBtn.style.backgroundColor === 'rgb(212, 236, 126)') { //btn active
                        await tts(prediction[i].className)
                            // delay(0)
                    } else {
                        console.log('')
                    }
                }
            }

            // labelContainer.childNodes[i].innerHTML = prediction[i].className;


        }

    }

    // for (let i = 0; i < maxPredictions; i++) {
    //     const classPrediction =
    //         prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    //     labelContainer.childNodes[i].innerHTML = classPrediction;
    // }

}
