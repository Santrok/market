// script.js

// Простейшие данные товаров генерируются динамически
const categories = ['electronics','clothing','home','beauty','sports','toys'];
const sampleTitles = [
  'Умные наушники','Футболка премиум','Кофеварка автомат','Крем для лица',
  'Беговые кроссовки','Конструктор для детей','Портативная колонка','Джинсы',
  'Светильник настольный','Шампунь натуральный','Рюкзак городской','Фитнес-браслет'
];

// Генерация 30 товаров
// const products = Array.from({length:30}, (_,i) => {
//   const cat = categories[i % categories.length];
//   const title = sampleTitles[i % sampleTitles.length] + ' ' + (i+1);
//   const price = (Math.random() * 90 + 10).toFixed(2);
//   const img = `https://via.placeholder.com/600x400.png?text=${encodeURIComponent(title)}`;
//   return {
//     id: 'p' + (i+1),
//     title,
//     price,
//     category: cat,
//     image: img
//   };
// });

// DOM элементы
const burgerBtn = document.getElementById('burgerBtn');
const side = document.getElementById('sideCategories');
const closeCategories = document.getElementById('closeCategories');
const productsGrid = document.getElementById('productsGrid');
const template = document.getElementById('productTemplate');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');

let cart = {};

// Открыть/закрыть боковую панель
function openSide(){ side.classList.add('open'); side.setAttribute('aria-hidden','false'); }
function closeSide(){ side.classList.remove('open'); side.setAttribute('aria-hidden','true'); }

burgerBtn.addEventListener('click', openSide);
closeCategories.addEventListener('click', closeSide);

// Закрыть при клике вне панели
document.addEventListener('click', (e) => {
  if (!side.contains(e.target) && !burgerBtn.contains(e.target)) {
    closeSide();
  }
});

// Рендер карточки товара
function renderProduct(product){
  const node = template.content.cloneNode(true);
  const card = node.querySelector('.product-card');
  const img = node.querySelector('.product-image');
  const title = node.querySelector('.product-title');
  const price = node.querySelector('.product-price');
  const addBtn = node.querySelector('.add-cart');

  img.src = product.image;
  img.alt = product.title;
  title.textContent = product.title;
  price.textContent = `${product.price} ₽`;

  addBtn.addEventListener('click', () => {
    addToCart(product.id);
  });

  return node;
}

// Рендер списка по фильтру
function renderProducts(list){
  productsGrid.innerHTML = '';
  if (list.length === 0) {
    productsGrid.innerHTML = '<p>Товары не найдены.</p>';
    return;
  }
  const frag = document.createDocumentFragment();
  list.forEach(p => frag.appendChild(renderProduct(p)));
  productsGrid.appendChild(frag);
}

// Поиск и фильтрация
function filterProducts({query = '', category = 'all'} = {}){
  const q = query.trim().toLowerCase();
  return products.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchQ = !q || p.title.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
}

// Категории клики
// document.querySelectorAll('#sideCategories a').forEach(a => {
//   a.addEventListener('click', (e) => {
//     e.preventDefault();
//     const cat = a.dataset.cat || 'all';
//     const list = filterProducts({category: cat, query: searchInput.value});
//     renderProducts(list);
//     closeSide();
//   });
// });

// Поиск
function doSearch(){
  const q = searchInput.value;
  const list = filterProducts({query: q});
  renderProducts(list);
}
searchBtn.addEventListener('click', doSearch);
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});

// Корзина
function addToCart(productId){
  cart[productId] = (cart[productId] || 0) + 1;
  updateCartUI();
}
function updateCartUI(){
  const total = Object.values(cart).reduce((s,n) => s + n, 0);
  cartCount.textContent = total;
}

// Инициализация страницы
// function init(){
//   renderProducts(products);
//   updateCartUI();
// }
// init();

// Дополнительная мелкая логика: показать подсказку при клике на корзину
cartBtn.addEventListener('click', () => {
  const total = Object.values(cart).reduce((s,n) => s + n, 0);
  if (total === 0) {
    alert('Корзина пуста. Добавьте товары, нажав "Добавить в корзину".');
  } else {
    alert(`В корзине ${total} товар(ов).`);
  }
});


