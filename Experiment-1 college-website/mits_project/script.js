
document.querySelectorAll('.nav-item > button').forEach(button => {
  button.addEventListener('click', e => {
    const menu = button.nextElementSibling;
    document.querySelectorAll('.nav-item .menu').forEach(m => { if (m !== menu) m.style.display = ''; });
    menu.style.display = menu.style.display === 'block' ? '' : 'block';
    e.stopPropagation();
  });
});
document.addEventListener('click', () => document.querySelectorAll('.nav-item .menu').forEach(m => m.style.display = ''));
