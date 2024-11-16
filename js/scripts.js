document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
});




let lastScrollTop = 0; // Переменная для хранения последней позиции прокрутки
const header = document.querySelector('header'); // Находим элемент header
const body = document.querySelector('body'); // Находим body

// Событие прокрутки страницы
window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop; // Получаем текущую позицию прокрутки

    // Если прокручиваем вверх, показываем хедер
    if (currentScroll < lastScrollTop) {
        header.style.top = '0'; // Показываем хедер
        header.classList.remove('hidden'); // Убираем класс скрытия
    } else {
        header.style.top = '-100px'; // Скрываем хедер
        header.classList.add('hidden'); // Добавляем класс скрытия
    }

    // Обновляем последнюю позицию прокрутки
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; 
});

