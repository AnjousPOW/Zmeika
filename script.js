const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Определение размеров поллы и расстояния между ячейками:
const gridSize = 20;
const tileMargin = 2;
const tileSize = (canvas.width - (gridSize + 1) * tileMargin) / gridSize;
// Здесь gridSize определяет размер сетки игрового поля, а tileMargin задает расстояние между ячейками. 
// tileSize вычисляется таким образом, чтобы ячейки занимали все доступное пространство на поле.

// Объект змеи с начальным положением:
const snake = {
  body: [{ row: gridSize / 2, col: gridSize / 2 }],
  direction: 'right'
};
// snake представляет собой объект, содержащий массив body, который хранит координаты каждой части змеи. 
// Начальное положение змеи устанавливается в середине поля. Начальное направление движения задается как "right" (вправо).

// Рандомное появление пищи:
let food = getRandomFood();
let score = 0;

function getRandomFood() {
  const row = Math.floor(Math.random() * gridSize);
  const col = Math.floor(Math.random() * gridSize);
  return { row, col };
}
// food представляет собой объект с координатами пищи на поле. 
// Функция getRandomFood() генерирует случайные координаты для пищи в пределах размера поля gridSize.

// Отрисовка змеи и пищи:
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSnake();
  drawFood();
}

function drawSnake() {
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < snake.body.length; i++) {
    const { row, col } = snake.body[i];
    const x = col * (tileSize + tileMargin) + tileMargin;
    const y = row * (tileSize + tileMargin) + tileMargin;
    ctx.fillRect(x, y, tileSize, tileSize);
  }
}

function drawFood() {
  const { row, col } = food;
  const x = col * (tileSize + tileMargin) + tileMargin;
  const y = row * (tileSize + tileMargin) + tileMargin;
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(x, y, tileSize, tileSize);
}
// draw() вызывается для очистки поля и отрисовки змеи и пищи на каждом шаге игрового цикла.
// drawSnake() отрисовывает каждую часть змеи, а drawFood() отрисовывает пищу на поле.

// Обновление состояния змеи:
function update() {
  const { direction } = snake;

  let newRow = snake.body[0].row;
  let newCol = snake.body[0].col;

  if (direction === 'up') {
    newRow--;
  } else if (direction === 'down') {
    newRow++;
  } else if (direction === 'left') {
    newCol--;
  } else if (direction === 'right') {
    newCol++;
  }

  const newHead = { row: newRow, col: newCol };
  snake.body.unshift(newHead);

  if (newRow === food.row && newCol === food.col) {
    score++;
    food = getRandomFood();
  } else {
    snake.body.pop();
  }

  if (checkCollision()) {
    alert('Game Over!');
    snake.body = [{ row: gridSize / 2, col: gridSize / 2 }];
    snake.direction = 'right';
    score = 0;
  }
}

function checkCollision() {
    const { body } = snake;
    const { row, col } = body[0];
  
    // Проверка на столкновение с стеной
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
      return true;
    }
  
    // Проверка на столкновение с самой собой
    for (let i = 1; i < body.length; i++) {
      if (body[i].row === row && body[i].col === col) {
        return true;
      }
    }
  
    return false;
}
// Функция checkCollision() проверяет, столкнулась ли змея со стеной или со своими частями.
// Если это произошло, функция возвращает true, меняя игровой цикл на окончание игры.

// Управление змеей по нажатию клавиш:
document.addEventListener('keydown', function(event) {
  const key = event.key;

  if (key === 'ArrowUp' && snake.direction !== 'down') {
    snake.direction = 'up';
  } else if (key === 'ArrowDown' && snake.direction !== 'up') {
    snake.direction = 'down';
  } else if (key === 'ArrowLeft' && snake.direction !== 'right') {
    snake.direction = 'left';
  } else if (key === 'ArrowRight' && snake.direction !== 'left') {
    snake.direction = 'right';
  }
});

// Игровой цикл:
function gameLoop() {
  update();
  draw();
}
// gameLoop() представляет собой цикл, который каждые 100 миллисекунд вызывает функции update() и draw() для обновления состояния игры и отрисовки экрана.
// Это создает плавное движение змеи и обновление еды на поле.

setInterval(gameLoop, 100);