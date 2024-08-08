const signText = document.querySelector('.player-view')
const normText = document.querySelector('#player-text')

const textArea = document.querySelector('#text-area')

const msgInput = document.querySelector('.message-input')
const sendBtn = document.querySelector('#send-btn')

msgInput.value = 'ihioahsdhashdskd'

let newText = "";
sendBtn.addEventListener('click', function() {
    // textArea.value = ''
    textArea.innerHTML = ''
    let text = msgInput.value;
    msgInput.value = ''


    for (let i = 0; i < text.length; i++) {
        setTimeout(function() {
            signText.innerHTML = text[i]
            normText.innerHTML = text[i]


            const letter = text.charAt(i);
            const isLastLetter = (i === text.length - 1);

            if (isLastLetter) {
                // newText += `<p style="background-color:red;">${letter}</p>`;
                newText += letter


            } else {
                newText += letter;
            }

            textArea.innerHTML = newText;
            // await new Promise(r => setTimeout(r, 1000));

            // if (isLastLetter) {
            //     const lastLetterElement = textArea.lastChild.lastChild;
            //     lastLetterElement.classList.add("highlight");
            // }



            // const letter = text.charAt(i);
            // const isLastLetter = (i === text.length - 1);

            // if (isLastLetter) {
            //     newText += `<span class="highlight">${letter}</span>`;
            // } else {
            //     newText += letter;
            // }

            // textArea.value = newText;



            // const lastLetter = text.slice(-1);
            // const lastIndex = text.lastIndexOf(lastLetter);
            // const newText = text.slice(0, lastIndex) + `<span class="highlight">${text[i]}</span>` + text.slice(lastIndex + 1);

            // textArea.innerHTML = newText;

            console.log(i)
        }, i * 1000)
    }
})