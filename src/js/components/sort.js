const sort = document.querySelector('.sort');
const sortTop = document.querySelector('.sort_top');
const sortDropdown = document.querySelector('.sort_dropdown');
const sortItems = document.querySelectorAll('.sort_dropdown__item');
const sortTopSpan = sortTop.querySelector('span');
const body = document.querySelector('body');
const overlay = document.querySelector('.overlay');

sortTop.addEventListener('click', () => {
    sort.classList.add('open')
    overlay.classList.add('active')
    body.classList.add('lock');
})

sortItems.forEach(item => {
    item.addEventListener('click', () => {
        sortItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        sortTopSpan.textContent = item.textContent;
        sort.classList.remove('open');
        overlay.classList.remove('active');
        body.classList.remove('lock');
    });
});

