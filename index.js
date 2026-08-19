const beepSound = new Audio('sounds/index_message_1.wav');
const beepSound2 = new Audio('sounds/index_message_2.wav');

const accButton = document.getElementById('accButton');
const clearButton = document.getElementById('clearButton');
const failedButton = document.getElementById('failButton');

const message = document.getElementById('message');
const randomSymbol = '01';

/* const dialogList = [
    'Be friend with random people',
    'Make a pancake with sun heatwave',
    'Do 10 push-up',
    'Confess to your crush',
    'Do backflip',
]; */

let dialogSet = new Set(
    JSON.parse(localStorage.getItem('dialogList'))
    ||
    [
        'Be friend with random people',
        'Make a pancake with sun heatwave',
        'Do 10 push-up',
        'Confess to your crush',
        'Do backflip'
    ]
);

let dialogList = [...dialogSet];

const ms = 400;
// besok tambah history agar dialog yg sama tidak muncul 2 kali
// tambah list dialogue edit

const windowList = document.getElementById('windowList');
windowList.addEventListener('click', (e) => {
    if (e.target == windowList) {
        windowList.style.display = 'none';
    }
});

function resetList() {
    localStorage.clear('dialogList');
    dialogSet = new Set([
        'Be friend with random people',
        'Make a pancake with sun heatwave',
        'Do 10 push-up',
        'Confess to your crush',
        'Do backflip'
    ]);
    dialogList = [...dialogSet];
    renderList();
}

function openList() {
    windowList.style.display = 'flex';
}

function renderList() {
    const windowsContent = document.querySelector('.winCons');
    windowsContent.innerHTML = `<ul>${makeList()}</ul>`;

    insertText();
    editButtonRender();
    deleteButton();
}

function deleteButton() {
    const deleteButtons = document.querySelectorAll('.delete');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', () => {
            console.log('delete');
            const dialogIndex = button.closest('li').dataset.dialog;
            dialogSet.delete(dialogList[dialogIndex]);
            dialogList = [...dialogSet];
            localStorage.setItem('dialogList', JSON.stringify(dialogList));
            renderList();
        });
    });
}

function editButtonRender() {
    const editButtons = document.querySelectorAll('.edit');

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const li = button.closest('li');
            const dialogIndex = li.dataset.dialog; // Pastikan data-dialog="..." ada di <li>
            const span = li.querySelector('span');

            // Simpan teks lama jika perlu rollback/batal
            const currentText = span.textContent;

            // Render input
            span.innerHTML = `<input type="text" placeholder="Edit action" value="${currentText}">`;

            const input = span.querySelector('input');
            input.focus(); // Langsung fokuskan cursor ke input

            // Dengarkan tombol Enter pada input
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    const inputValue = input.value.trim();

                    if (inputValue !== "") {
                        console.log('Proses update:', inputValue);

                        // Update data di array/object
                        dialogList[dialogIndex] = inputValue;
                        dialogSet = localStorage.setItem('dialogList', JSON.stringify([...dialogList]));

                        // Kembalikan span menjadi teks biasa
                        span.textContent = inputValue;
                    }
                }
            });
        });
    });
}

function addMission() {
    const mission = prompt('Insert new mission', '').trim();

    if (!mission) {
        alert("no mission added");
    } else {
        if (dialogSet.has(mission)) {
            alert("Can't add same mission again");
        } else {
            dialogList.push(mission);
            dialogSet.add(mission);
            localStorage.setItem('dialogList', JSON.stringify([...dialogList]));
            alert('Mission Added!');
            renderList();
        }
    }
}

function makeList() {
    if (dialogList.length < 1) {
        return `<li>No list...</li>`;
    } else {
        return dialogList.map((_, index) => {
            return `<li data-dialog = ${index}>
                <span class="textHere"></span>
                <div class='actionList'>
                    <button class='delete'>Delete</button>
                    <button class='edit'>Edit</button>
                </div>
            </li>`;
        }).join('');
    }
}

function insertText() {
    const spans = document.querySelectorAll('.textHere');
    spans.forEach((span) => {
        const dialogIndex = span.closest('li').dataset.dialog;
        span.innerText = dialogList[dialogIndex];
    });
}

async function acceptMission() {
    if (dialogList.length == 0) {
        animation('No missions.');
    } else {
        animation(dialogList[getRandomInt(dialogList.length)]);

        activeClass(clearButton);
        activeClass(failedButton);
        deactiveClass(accButton);
    }
}

async function clearMission() {
    animation('CLEAR.');

    deactiveClass(clearButton);
    deactiveClass(failedButton);
    activeClass(accButton);
}

async function failMission() {
    animation('FAILED.');

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
    const dialog = `_${text}_`
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
        await new Promise(resolve => setTimeout(resolve, 210));
        a++;
    }
}

function getRandomInt(maxInt) { // pick between 1 to (maxInt - 1)
    return Math.floor(Math.random() * maxInt);
}

function randomText(text) {
    let tempText = '';
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == ' ') {
            word = ' ';
        } else {
            word = randomSymbol.charAt(getRandomInt(randomSymbol.length));
        }
        tempText += word;
    }
    return tempText;
}

// Run function
renderList();