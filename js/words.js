const wordInput = document.getElementById('wordInput');
const block3 = document.getElementById('block3');
const block2 = document.getElementById('block2');
const displayLine = document.getElementById('displayLine');

let wordOrder = []; 

// Разбор слов и вывод в третий блок
function processWords() {
    block2.innerHTML = '';  
    displayLine.innerHTML = '';
    const inputText = wordInput.value;
    if (!inputText) return;

    const words = inputText.split('-').map(word => word.trim()).filter(Boolean);

    // Группируем слова
    const smallLetterWords = [];
    const capitalLetterWords = [];
    const numberWords = [];

    words.forEach((word, index) => {
        const firstChar = word[0];
        if (/\d/.test(firstChar)) {
            numberWords.push(word); 
        } else if (firstChar === firstChar.toUpperCase()) {
            capitalLetterWords.push(word); 
        } else {
            smallLetterWords.push(word); 
        }
    });

    // Сортируем слова внутри каждой группы
    smallLetterWords.sort();
    capitalLetterWords.sort();
    numberWords.sort((a, b) => a - b); 

    // Генерация ключей для каждой группы
    const generateKeys = (group, prefix) => {
        return group.map((word, index) => ({
            word,
            key: `${prefix}${index + 1}`, 
            initialColor: getRandomColor() 
        }));
    };
    const smallLetterWithKeys = generateKeys(smallLetterWords, 'a');
    const capitalLetterWithKeys = generateKeys(capitalLetterWords, 'b');
    const numberWithKeys = generateKeys(numberWords, 'n');

    wordOrder = [...smallLetterWithKeys, ...capitalLetterWithKeys, ...numberWithKeys];

    // Выводим слова в третий блок
    block3.innerHTML = ''; 
    wordOrder.forEach(item => {
        const wordElement = createWordElement(item.key, item.word, item.initialColor);
        block3.appendChild(wordElement);
    });
}

// Создание элемента для слова
function createWordElement(key, word, initialColor) {
    const wordElement = document.createElement('div');
    wordElement.className = 'word';
    wordElement.draggable = true;
    wordElement.textContent = `${key} ${word}`;

    // Сохранение исходного цвета
    wordElement.dataset.initialColor = initialColor; 
    wordElement.style.backgroundColor = initialColor;
    wordElement.style.color = '#fff';

    // Обработчики событий перетаскивания
    wordElement.addEventListener('dragstart', onDragStart);
    wordElement.addEventListener('dragend', onDragEnd);

    return wordElement;
}

// Генерация случайного цвета
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Drag and Drop
let draggedElement = null;

function onDragStart(event) {
    draggedElement = event.target;
    event.dataTransfer.effectAllowed = 'move';

    draggedElement.style.backgroundColor = getRandomColor();
}

function onDragEnd() {
    draggedElement = null;
}

// Обработчик перетаскивания на блоки
block2.addEventListener('dragover', event => {
    event.preventDefault();
});

block2.addEventListener('drop', event => {
    event.preventDefault();
    if (draggedElement) {
        // Получаем позицию относительно блока
        const rect = block2.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;  

        // Обновляем позицию перетаскиваемого элемента
        draggedElement.style.position = 'absolute'; 
        draggedElement.style.left = `${offsetX - draggedElement.offsetWidth / 2}px`; 
        draggedElement.style.top = `${offsetY - draggedElement.offsetHeight / 2}px`; 

        // Изменение цвета при перемещении
        draggedElement.style.backgroundColor = getRandomColor();

        // Добавляем элемент в блок 2 
        if (!block2.contains(draggedElement)) {
            block2.appendChild(draggedElement);
        }
    }
});

// Обработчик клика по элементу во втором блоке
block2.addEventListener('click', event => {
    const target = event.target;

    if (target && target.classList.contains('word')) {
        const wordText = target.textContent.split(' ')[1]; 
        const wordColor = target.style.backgroundColor; 

        const span = document.createElement('span');
        span.style.color = wordColor;
        span.textContent = wordText;

        if (displayLine.textContent.trim()) {
            displayLine.appendChild(document.createTextNode(' ')); 
        }

        displayLine.appendChild(span);
    }
});

// Обработчик возврата в третий блок
block3.addEventListener('dragover', event => {
    event.preventDefault();
});

block3.addEventListener('drop', event => {
    event.preventDefault();
    if (draggedElement) {
        const initialColor = draggedElement.dataset.initialColor;
        draggedElement.style.backgroundColor = initialColor;

        draggedElement.style.position = '';

        block3.appendChild(draggedElement);

        sortWordsInContainer(block3);
    }
});

// Сортировка слов в блоке
function sortWordsInContainer(container) {
    const words = Array.from(container.querySelectorAll('.word'));
    words.sort((a, b) => a.textContent.localeCompare(b.textContent));
    words.forEach(word => container.appendChild(word));
}


