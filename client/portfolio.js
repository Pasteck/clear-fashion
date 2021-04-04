// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

let currentBrands = [];

let filter_reasonable = 'no';
let filter_brand = '';
let filter_recent = 'no';

const two_weeks = 1209600000;

const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');

const checkReasonable = document.querySelector('#check_reasonable_price');
const checkRecent = document.querySelector('#check_recently_released');


const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

const spanp50 = document.querySelector('#p50');
const spanp90 = document.querySelector('#p90');
const spanp95 = document.querySelector('#p95');
const spanlastRelease = document.querySelector('#lastDate');
const spanNbNewProducts = document.querySelector('#nbNewProducts');

const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}€</span>
      
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2 style="text-decoration: underline;">Products</h2>';
  sectionProducts.appendChild(fragment);
};

const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

const renderBrands = products => {
  var brands =[];
  for(var i =0;i<products.length;i++){
    if (!(brands.includes(products[i].brand))){
      brands.push(products[i].brand);
    }
  }
  const options = Array.from(
    brands,
    value => `<option value="${value}">${value}</option>`
  );

  selectBrand.innerHTML = options;
  selectBrand.selectedIndex = brands.indexOf(filter_brand);

};


const render = (products, pagination) => {
  products = filter_products(products);
  renderProducts(products);
  renderPagination(pagination);
};



function sort_by_release(a, b){
  let comparison = 0;
  if(a.released > b.released){
    comparison = 1;
  }else if(a.released < b.released){
    comparison = -1;
  }
  return comparison;
}

function compare_price(a, b){
  let comparison = 0;
  if(a.price > b.price){
    comparison = 1;
  }else if(a.price < b.price){
    comparison = -1;
  }
  return comparison;
}

function nb_new_products(listproducts){
  var nb=0;
  for(var i=0;i<listproducts.length;i++){
    var release = Date.parse(listproducts[i].released);
    var today = Date.now();
    var w2 = (14*24*60*60*1000);
    if((today - release) / 1000 / 3600 / 24 < 30){
      nb++;
    }
  }
  return nb;
}



function filter_products(products){
  if(filter_reasonable === 'yes') {
    products = products.filter(p => p.price < 100);
  }
  if(filter_recent === 'yes') {
    products = products.filter(p => (Date.now() - Date.parse(p.released)) / 1000 / 3600 / 24 < 30 );
  }
  renderBrands(products);
  if(filter_brand !== '') {
    products = products.filter(p => p['brand'] === filter_brand);
  }
  return products;
}

console.log(localStorage);
console.log(localStorage);

selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value),selectShow.value)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

selectSort.addEventListener('change', event =>{

  // Price ascending
  if(event.target.value === 'price-asc'){
    currentProducts = [...currentProducts].sort((a, b) => compare_price(a, b));

  }
  //Price descending
  if(event.target.value === 'price-desc'){
    currentProducts = [...currentProducts].sort((a, b) => compare_price(a, b));
    currentProducts.reverse();

  }
  //Date ascending
  if(event.target.value === 'date-asc'){
    currentProducts = [...currentProducts].sort((a, b) => sort_by_release(a, b));

  }

  if(event.target.value === 'date-desc'){
    currentProducts = [...currentProducts].sort((a, b) => sort_by_release(a, b));
    currentProducts.reverse();
  }
  render(currentProducts, currentPagination);
})
selectBrand.addEventListener('change', event => {
  filter_brand = event.target.value;
  render(currentProducts, currentPagination);
});
//for some reason, those 3 next event listeners don't react correctly and dont apply any modification on the research
checkReasonable.addEventListener('change', event => {
  filter_reasonable=event.target.value;
  render(currentProducts, currentPagination);
});
checkRecent.addEventListener('change', event => {
  filter_recent=event.target.value;
  render(currentProducts, currentPagination);
});
document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);