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
    
    // Генерируем QR-код
    generateQRCode(userData);
    
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    // Если ошибка авторизации, перенаправляем на страницу входа
    if (error.message.includes('авторизации') || error.message.includes('token')) {
      logout();
    }
  }
});

// Функция для генерации QR-кода
function generateQRCode(userData) {
  const qrCodeElement = document.getElementById('qrCode');
  
  // Очищаем элемент перед генерацией нового QR-кода
  qrCodeElement.innerHTML = '';
  
  // Создаем данные для QR-кода (ID пользователя и имя)
  const user = JSON.parse(localStorage.getItem('user')) || { id: 'unknown' };
  const qrData = JSON.stringify({
    userId: user.id,
    name: userData.name,
    email: userData.email
  });
  
  // Генерируем QR-код с помощью библиотеки qrcode.js
  new QRCode(qrCodeElement, {
    text: qrData,
    width: 200,
    height: 200,
    colorDark: '#4a154b',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}