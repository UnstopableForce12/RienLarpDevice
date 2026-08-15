const beepSound = new Audio('sounds/index_message_1.wav');
const beepSound2 = new Audio('sounds/index_message_2.wav');

const accButton = document.getElementById('accButton');
const clearButton = document.getElementById('clearButton');
const failedButton = document.getElementById('failButton');

const message = document.getElementById('message');
const randomSymbol = '01'
const dialogList = [
    'Be friend with random people',
    'Make a pancake with sun heatwave',
    'Do 10 push-up',
    'Confess to your crush'
];
const ms = 400;
// besok tambah history agar dialog yg sama tidak muncul 2 kali
// tambah list dialogue edit

const windowList = document.getElementById('windowList');
windowList.addEventListener('click', () => {
    windowList.style.display = 'none';
})

const windows = document.querySelector('.windows');
function openList() {
    windowList.style.display = 'flex';
    windows.innerHTML += listItem;
}

function getItemList() {
    let listItem = ''
    for (i in dialogList) {
        listItem += `<li>${dialogList[i]}</li>`
    }
    return listItem;
}

async function acceptMission() {
    animation(dialogList[getRandomInt(dialogList.length)]);

    activeClass(clearButton);
    activeClass(failedButton);
    deactiveClass(accButton);
}

async function clearMission() {
    animation('CLEAR');

    deactiveClass(clearButton);
    deactiveClass(failedButton);
    activeClass(accButton);
}

async function failMission() {
    animation('FAILED');

    deactiveClass(clearButton);
    deactiveClass(failedButton);
    activeClass(accButton);
}

async function activeClass(variabelButton) {
    variabelButton.classList.add('active');
    variabelButton.classList.remove('deactive');

    variabelButton.disabled = true;
    variabelButton.style.textShadow = `0 0 20px red`
    variabelButton.style.color = 'red';
    await new Promise(resolve => setTimeout(resolve, 1000))
    variabelButton.disabled = false;
    variabelButton.style.textShadow = `0 0 20px aqua`
    variabelButton.style.color = 'rgb(105, 255, 255)';
}

async function deactiveClass(variabelButton) {
    variabelButton.classList.add('deactive');
    variabelButton.classList.remove('active');

    variabelButton.disabled = true;
    variabelButton.style.textShadow = `0 0 20px red`
    variabelButton.style.color = 'red';
    await new Promise(resolve => setTimeout(resolve, 1000))
    variabelButton.disabled = false;
    variabelButton.style.textShadow = `0 0 20px aqua`
    variabelButton.style.color = 'rgb(105, 255, 255)';
}

async function animation(text) {
    message.innerText = '';
    const dialog = `_${text}._`
    let randomTextTemp = ''
    let isPlaying = true;
    let isStop = false;
    beepSound.currentTime = 0;
    beepSound.play();
    setTimeout(async () => {
        isPlaying = false;
        for (let a = 0; a < dialog.length; a++) {
            if (a == dialog.length - 1) {
                message.innerText = dialog;
            } else {
                message.innerHTML = dialog.slice(0, a) + randomTextTemp.slice(a, dialog.length);
            }
            await new Promise(resolve => setTimeout(resolve, Math.floor(ms / dialog.length)));
        }
        isStop = true
        beepSoundEnd(6);

    }, 700);

    while (!isStop) {
        randomTextTemp = randomText(dialog);

        if (isPlaying) {
            message.innerText = randomTextTemp;
        }

        await new Promise(resolve => setTimeout(resolve, 50));
    }

}

async function beepSoundEnd(i) {
    let a = 0;
    while (a < i) {
        beepSound2.currentTime = 0;
        beepSound2.play();
        await new Promise(resolve => setTimeout(resolve, 200));
        a++;
    }
}

function getRandomInt(maxInt) { // pick between 1 to (maxInt - 1)
    return Math.floor(Math.random() * maxInt);
}

function randomText(text) {
    let tempText = '';
    for (let i = 0; i < text.length; i++) {
        if(text.charAt(i) == ' ') {
            word = ' ';
        } else {
            word = randomSymbol.charAt(getRandomInt(randomSymbol.length));
        }
        tempText += word;
    }
    return tempText;
}