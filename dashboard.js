document.addEventListener('DOMContentLoaded', async function() {
  // Проверяем авторизацию
  if (!checkAuth()) {
    return;
  }
  
  try {
    // Получаем данные пользователя
    const userData = await fetchAPI('/balance');
    
    // Отображаем имя пользователя
    document.getElementById('userName').textContent = userData.name;
    
    // Отображаем баланс
    document.getElementById('userBalance').textContent = userData.balance;
    
    // Генерируем цифровой код вместо QR-кода
    generateLoyaltyCode(userData);
    
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    // Если ошибка авторизации, перенаправляем на страницу входа
    if (error.message.includes('авторизации') || error.message.includes('token')) {
      logout();
    }
  }
});

// Функция для генерации цифрового кода лояльности
function generateLoyaltyCode(userData) {
  const qrCodeElement = document.getElementById('qrCode');
  
  // Очищаем элемент
  qrCodeElement.innerHTML = '';
  
  // Создаем случайный 5-значный код на основе ID пользователя
  const user = JSON.parse(localStorage.getItem('user')) || { id: '12345' };
  const userId = user.id.toString();
  
  // Генерируем 5-значный код на основе ID пользователя и текущей даты
  const date = new Date();
  const seed = userId + date.getDate() + date.getMonth();
  let loyaltyCode = '';
  
  // Генерируем 5 цифр
  for (let i = 0; i < 5; i++) {
    // Используем простой алгоритм для генерации псевдослучайных цифр на основе seed
    const digit = Math.floor((parseInt(seed) * (i + 1) * 13) % 10);
    loyaltyCode += digit;
  }
  
  // Создаем элементы для отображения кода
  const codeContainer = document.createElement('div');
  codeContainer.style.padding = '20px';
  codeContainer.style.border = '2px dashed #4a154b';
  codeContainer.style.borderRadius = '10px';
  codeContainer.style.textAlign = 'center';
  
  const codeTitle = document.createElement('h3');
  codeTitle.textContent = 'Ваш код лояльности:';
  codeTitle.style.marginBottom = '10px';
  codeTitle.style.color = '#4a154b';
  
  const codeDisplay = document.createElement('div');
  codeDisplay.textContent = loyaltyCode;
  codeDisplay.style.fontSize = '36px';
  codeDisplay.style.fontWeight = 'bold';
  codeDisplay.style.letterSpacing = '5px';
  codeDisplay.style.color = '#4a154b';
  codeDisplay.style.margin = '15px 0';
  
  const codeInfo = document.createElement('p');
  codeInfo.textContent = 'Назовите этот код при оплате, чтобы получить или использовать баллы';
  codeInfo.style.fontSize = '14px';
  codeInfo.style.color = '#666';
  
  // Добавляем элементы в контейнер
  codeContainer.appendChild(codeTitle);
  codeContainer.appendChild(codeDisplay);
  codeContainer.appendChild(codeInfo);
  
  // Добавляем контейнер в элемент QR-кода
  qrCodeElement.appendChild(codeContainer);
  
  // Также пробуем создать QR-код, если библиотека доступна
  try {
    if (typeof QRCode !== 'undefined') {
      const qrContainer = document.createElement('div');
      qrContainer.style.marginTop = '20px';
      
      const qrTitle = document.createElement('h4');
      qrTitle.textContent = 'Или отсканируйте QR-код:';
      qrTitle.style.marginBottom = '10px';
      qrTitle.style.color = '#4a154b';
      
      const qrElement = document.createElement('div');
      qrElement.id = 'actualQrCode';
      
      qrContainer.appendChild(qrTitle);
      qrContainer.appendChild(qrElement);
      qrCodeElement.appendChild(qrContainer);
      
      // Генерируем QR-код
      new QRCode(qrElement, {
        text: loyaltyCode,
        width: 128,
        height: 128,
        colorDark: '#4a154b',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });
    }
  } catch (error) {
    console.log('QR код не может быть сгенерирован, используется только цифровой код');
  }
}