document.addEventListener('DOMContentLoaded', () => {
  const CORRECT_ORDER = [
    'planta1.png',
    'planta2.png',
    'planta3.png',
    'planta4.png',
    'planta5.png'
  ];

  let currentOrder = [];
  let draggedIndex = null;

  const board = document.getElementById('plants-board');
  const winScreen = document.getElementById('win-screen');
  const resetBtn = document.getElementById('reset-btn');

  // Inicializa o reinicia el juego
  function initGame() {
    winScreen.classList.add('hidden');
    currentOrder = shuffleArray([...CORRECT_ORDER]);
    renderBoard();
  }

  // Mezcla de elementos asegurando que NO empiece ya ordenado
  function shuffleArray(array) {
    let shuffled = [...array];
    let isSame = true;

    while (isSame) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      isSame = shuffled.every((val, idx) => val === CORRECT_ORDER[idx]);
    }
    return shuffled;
  }

  // Renderizado dinámico de las macetas a lo ancho
  function renderBoard() {
    board.innerHTML = '';
    currentOrder.forEach((plantSrc, index) => {
      const slot = document.createElement('div');
      slot.classList.add('plant-slot');
      slot.dataset.index = index;

      const img = document.createElement('img');
      img.src = plantSrc;
      img.alt = `Planta ${index + 1}`;
      img.classList.add('plant-item');
      img.dataset.index = index;

      // Eventos Touch (móvil)
      img.addEventListener('touchstart', handleTouchStart, { passive: false });
      img.addEventListener('touchmove', handleTouchMove, { passive: false });
      img.addEventListener('touchend', handleTouchEnd);

      slot.appendChild(img);
      board.appendChild(slot);
    });
  }

  // Lógica para arrastrar en pantallas táctiles
  let activeTouchImg = null;

  function handleTouchStart(e) {
    e.preventDefault();
    activeTouchImg = e.target;
    draggedIndex = parseInt(activeTouchImg.dataset.index, 10);
    activeTouchImg.classList.add('dragging');
  }

  function handleTouchMove(e) {
    if (!activeTouchImg) return;
    e.preventDefault();

    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

    if (targetElement) {
      const targetSlot = targetElement.closest('.plant-slot');
      if (targetSlot) {
        const targetIndex = parseInt(targetSlot.dataset.index, 10);
        if (targetIndex !== draggedIndex && !isNaN(targetIndex)) {
          swapPlants(draggedIndex, targetIndex);
          draggedIndex = targetIndex;
        }
      }
    }
  }

  function handleTouchEnd(e) {
    if (activeTouchImg) {
      activeTouchImg.classList.remove('dragging');
      activeTouchImg = null;
      draggedIndex = null;
      checkWin();
    }
  }

  // Intercambio de posiciones dentro del array
  function swapPlants(fromIndex, toIndex) {
    const temp = currentOrder[fromIndex];
    currentOrder[fromIndex] = currentOrder[toIndex];
    currentOrder[toIndex] = temp;
    renderBoard();

    // Reasignar el estado visual de arrastre al nuevo nodo renderizado
    const newSlots = board.querySelectorAll('.plant-item');
    activeTouchImg = newSlots[toIndex];
    if (activeTouchImg) {
      activeTouchImg.classList.add('dragging');
    }
  }

  // Verificación de victoria
  function checkWin() {
    const isCorrect = currentOrder.every((src, idx) => src === CORRECT_ORDER[idx]);
    if (isCorrect) {
      setTimeout(() => {
        winScreen.classList.remove('hidden');
      }, 200);
    }
  }

  resetBtn.addEventListener('click', initGame);

  // Iniciar al cargar
  initGame();
});