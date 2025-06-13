// Создаём функцию для рендера компонента CourseInfo
function renderCourseInfo(container) {
  let isPressed = false;

  // Создаём главный контейнер
  const mainDiv = document.createElement('div');
  Object.assign(mainDiv.style, {
    backgroundColor: '#4864EC',
    minHeight: '100vh',
    padding: '2rem',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });

  // Внутренний блок
  const contentDiv = document.createElement('div');
  Object.assign(contentDiv.style, {
    maxWidth: '600px',
    width: '100%',
    borderRadius: '12px',
    padding: '2rem',
    backgroundColor: 'transparent',
    color: '#DFDCFB',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.5',
    userSelect: 'none',
  });

  // Заголовки и параграфы
  const h3 = document.createElement('h3');
  h3.textContent = 'КУРС';
  Object.assign(h3.style, {
    marginTop: '0',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    letterSpacing: '0.1em',
    color: '#FFFFFF',
  });

  const h1 = document.createElement('h1');
  h1.textContent = 'Введение в React';
  Object.assign(h1.style, {
    marginTop: '0',
    marginBottom: '0.5rem',
    color: '#FFFFFF',
  });

  const pDuration = document.createElement('p');
  pDuration.textContent = 'Длительность: 4 недели';
  Object.assign(pDuration.style, {
    marginTop: '0',
    marginBottom: '1rem',
    fontWeight: '500',
  });

  const pDesc = document.createElement('p');
  pDesc.textContent = 'Это базовый курс по React для начинающих.';
  pDesc.style.marginBottom = '1rem';

  const pAuthor = document.createElement('p');
  pAuthor.textContent = 'Автор: Салимзода Мирзо';
  pAuthor.style.marginBottom = '0.5rem';

  const pLevel = document.createElement('p');
  pLevel.textContent = 'Уровень: Начальный';
  pLevel.style.marginBottom = '2rem';

  // Блок расписания
  const scheduleDiv = document.createElement('div');
  Object.assign(scheduleDiv.style, {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '1.5rem',
    borderRadius: '10px',
    color: '#FFFFFF',
    marginBottom: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  });

  const scheduleH2 = document.createElement('h2');
  scheduleH2.textContent = 'Расписание курса';
  Object.assign(scheduleH2.style, {
    marginTop: '0',
    marginBottom: '1rem',
  });

  const ul = document.createElement('ul');
  Object.assign(ul.style, {
    paddingLeft: '1.2rem',
    marginTop: '0',
    marginBottom: '0',
  });

  const items = [
    '1 неделя: Введение и основы React (6 часов)',
    '2 неделя: Компоненты и пропсы (8 часов)',
    '3 неделя: Состояние и события (8 часов)',
    '4 неделя: Маршрутизация и проект (10 часов)',
  ];
  items.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    ul.appendChild(li);
  });

  const totalP = document.createElement('p');
  totalP.textContent = 'Итого: 32 часа интенсивного обучения';
  Object.assign(totalP.style, {
    marginTop: '1rem',
    fontWeight: '600',
  });

  scheduleDiv.appendChild(scheduleH2);
  scheduleDiv.appendChild(ul);
  scheduleDiv.appendChild(totalP);

  // Кнопка "Выйти"
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Выйти';
  button.setAttribute('aria-label', 'Выйти');
  Object.assign(button.style, {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    border: '2px solid #FFFFFF',
    padding: '0.5rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, color 0.3s, transform 0.1s',
    userSelect: 'none',
  });

  // Обработчики для имитации isPressed
  button.addEventListener('mousedown', () => {
    isPressed = true;
    button.style.backgroundColor = '#FFFFFF';
    button.style.color = '#4864EC';
    button.style.transform = 'scale(0.95) translateY(2px)';
  });
  button.addEventListener('mouseup', () => {
    isPressed = false;
    button.style.backgroundColor = 'transparent';
    button.style.color = '#FFFFFF';
    button.style.transform = 'none';
  });
  button.addEventListener('mouseleave', () => {
    if (isPressed) {
      isPressed = false;
      button.style.backgroundColor = 'transparent';
      button.style.color = '#FFFFFF';
      button.style.transform = 'none';
    }
  });

  // Обработчик клика - переход на главную
  button.addEventListener('click', () => {
    // Например, меняем location.href
    window.location.href = '/';
  });

  // Собираем всё вместе
  contentDiv.appendChild(h3);
  contentDiv.appendChild(h1);
  contentDiv.appendChild(pDuration);
  contentDiv.appendChild(pDesc);
  contentDiv.appendChild(pAuthor);
  contentDiv.appendChild(pLevel);
  contentDiv.appendChild(scheduleDiv);
  contentDiv.appendChild(button);

  mainDiv.appendChild(contentDiv);

  // Добавляем в контейнер
  container.innerHTML = ''; // очистить контейнер
  container.appendChild(mainDiv);
}

// Использование: передайте элемент, куда хотите вставить компонент
// Например:
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    renderCourseInfo(root);
  }
});

