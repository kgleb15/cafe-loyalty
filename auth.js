// Обработка формы регистрации
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      hideError('registerError');
      
      // Проверка совпадения паролей
      if (password !== confirmPassword) {
        showError('registerError', 'Пароли не совпадают');
        return;
      }
      
      try {
        const result = await fetchAPI('/register', 'POST', {
          name,
          email,
          password
        });
        
        // Показываем сообщение об успехе
        const successElement = document.getElementById('registerSuccess');
        successElement.textContent = 'Регистрация успешна! Перенаправление на страницу входа...';
        successElement.classList.remove('hidden');
        
        // Очищаем форму
        registerForm.reset();
        
        // Перенаправляем на страницу входа через 2 секунды
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
        
      } catch (error) {
        showError('registerError', error.message);
      }
    });
  }
  
  // Обработка формы входа
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      hideError('loginError');
      
      try {
        const result = await fetchAPI('/login', 'POST', {
          email,
          password
        });
        
        // Сохраняем токен и информацию о пользователе
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Перенаправляем в личный кабинет
        window.location.href = 'dashboard.html';
        
      } catch (error) {
        showError('loginError', error.message);
      }
    });
  }
});