// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

console.log('🚀 This is it.');

const MY_FAVORITE_BRANDS = [{
  'name': 'Hopaal',
  'url': 'https://hopaal.com/'
}, {
  'name': 'Loom',
  'url': 'https://www.loom.fr'
}, {
  'name': 'ADRESSE',
  'url': 'https://adresse.paris/'
}]

console.table(MY_FAVORITE_BRANDS);
const marketplace=MY_FAVORITE_BRANDS
console.log(MY_FAVORITE_BRANDS[0]);





/**
 * 🌱
 * Let's go with a very very simple first todo
 * Keep pushing
 * 🌱
 */

// 🎯 TODO: The cheapest t-shirt
// 0. I have 3 favorite brands stored in MY_FAVORITE_BRANDS variable
// 1. Create a new variable and assign it the link of the cheapest t-shirt
// I can find on these e-shops
// 2. Log the variable

const tshirts = marketplace.filter(
  (x) => x.link.toLowerCase().includes("t-shirt")
);

if (tshirts.length == 0)
  console.warn("No t-shirst in marketplace");
else
{
  const cheapest = tshirts.reduce(
      (prev, curr) => prev.price < curr.price ? prev : curr
  );
  console.log(cheapest);
}

/**
 * 👕
 * Easy 😁?
 * Now we manipulate the variable `marketplace`
 * `marketplace` is a list of products from several brands e-shops
 * The variable is loaded by the file data.js
 * 👕
 */

// 🎯 TODO: Number of products
// 1. Create a variable and assign it the number of products
// 2. Log the variable

const nb_products_market = marketplace.length;
console.log(nb_products_market);


// 🎯 TODO: Brands name
// 1. Create a variable and assign it the list of brands name only
// 2. Log the variable
// 3. Log how many brands we have

const get_brands = (products) => [...new Set(products.map( ({ brand }) => brand))];
const brands = get_brands(marketplace);
console.log(brands);

// 🎯 TODO: Sort by price
// 1. Create a function to sort the marketplace products by price
// 2. Create a variable and assign it the list of products by price from lowest to highest
// 3. Log the variable

const sort_by = (order = 1) => (get_attr) => (products) => [...products].sort( // copy array
    (first, second) => {
        const first_attr = get_attr(first);
        const second_attr = get_attr(second);
        if (first_attr < second_attr) return -1 * order;
        if (first_attr > second_attr) return 1 * order;
        return 0;
    }
);

const sort_by_ascending = sort_by();
const sort_by_descending = sort_by(-1);

const sort_by_ascending_price = sort_by_ascending(x => x.price);

const products_sorted_ascending_price = sort_by_ascending_price(marketplace);
console.log(products_sorted_ascending_price);

// 🎯 TODO: Sort by date
// 1. Create a function to sort the marketplace objects by products date
// 2. Create a variable and assign it the list of products by date from recent to old
// 3. Log the variable

const sort_by_ascending_date = sort_by_ascending(x => new Date(x.date))

const products_sorted_ascending_date = sort_by_ascending_date(marketplace);
console.log(products_sorted_ascending_date);

// 🎯 TODO: Filter a specific price range
// 1. Filter the list of products between 50€ and 100€
// 2. Log the list

const filter_in_range = (get_attr) => (lower) => (upper)  => 
    (products) => products.filter(x => lower <= get_attr(x) && get_attr(x) <= upper);

const filter_price_range = filter_in_range(x => x.price);
const products_price_50_100 = filter_price_range(50)(100)(marketplace);
console.log(products_price_50_100);

// 🎯 TODO: Average Basket
// 1. Determine the average basket of the marketplace
// 2. Log the average

const average = (arr) => (arr.length == 0) ? 0 : arr.reduce(
    (first, second) => first + second, 0) / arr.length;

const average_basket = average(marketplace.map(x => x.price));
console.log(average_basket);

/**
 * 🏎
 * We are almost done with the `marketplace` variable
 * Keep pushing
 * 🏎
 */

// 🎯 TODO: Products by brands
// 1. Create an object called `brands` to manipulate products by brand name
// The key is the brand name
// The value is the array of products
//
// Example:
// const brands = {
//   'brand-name-1': [{...}, {...}, ..., {...}],
//   'brand-name-2': [{...}, {...}, ..., {...}],
//   ....
//   'brand-name-n': [{...}, {...}, ..., {...}],
// };
//
// 2. Log the variable
// 3. Log the number of products by brands

const group_by = (get_attr) => (arr) => arr.reduce((groups, item) =>
    {
        const group = (groups[get_attr(item)] || []);
        group.push(item);
        groups[get_attr(item)] = group;
        return groups;
    }, {});

const group_by_brand = group_by(x => x.brand);

const products_grouped_by_brand = group_by_brand(marketplace);
console.log(products_grouped_by_brand);

// 🎯 TODO: Sort by price for each brand
// 1. For each brand, sort the products by price, from highest to lowest
// 2. Log the sort

const map_each_attribute = (mapping) => (object) =>
{
    for (const attr in object)
    {
        object[attr] = mapping(object[attr]);
    }
    return object;
}

const sort_ascending_price_attr = map_each_attribute(sort_by_ascending_price);

const grouped_by_brand_sorted_ascending_price = sort_ascending_price_attr(group_by_brand(marketplace));
console.log(grouped_by_brand_sorted_ascending_price)


// 🎯 TODO: Sort by date for each brand
// 1. For each brand, sort the products by date, from old to recent
// 2. Log the sort

const sort_ascending_date_attr = map_each_attribute(sort_by_ascending_date);
const grouped_by_brand_sorted_ascending_date = sort_ascending_date_attr(group_by_brand(marketplace));
console.log(grouped_by_brand_sorted_ascending_date);

/**
 * 💶
 * Let's talk about money now
 * Do some Maths
 * 💶
 */

// 🎯 TODO: Compute the p90 price value
// 1. Compute the p90 price value of each brand
// The p90 value (90th percentile) is the lower value expected to be exceeded in 90% of the products

const get_precentile = (get_attr) => (percentile) => (arr) =>
{
    const sorted = sort_by_ascending(get_attr)(arr);
    const index = Math.min(Math.ceil(percentile / 100 * arr.length), arr.length - 1);
    return get_attr(sorted[index]);
};

const get_price_percentile = get_precentile(x => x.price);
const get_price_90_percentile = get_price_percentile(10);
const price_90_percentile = get_price_90_percentile(marketplace);
console.log(price_90_percentile);

/**
 * 🧥
 * Cool for your effort.
 * It's almost done
 * Now we manipulate the variable `COTELE_PARIS`
 * `COTELE_PARIS` is a list of products from https://coteleparis.com/collections/tous-les-produits-cotele
 * 🧥
 */

const COTELE_PARIS = [
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-gris',
    price: 45,
    name: 'BASEBALL CAP - TAUPE',
    uuid: 'af07d5a4-778d-56ad-b3f5-7001bf7f2b7d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-navy',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - NAVY',
    uuid: 'd62e3055-1eb2-5c09-b865-9d0438bcf075',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-fuchsia',
    price: 110,
    name: 'VESTE - FUCHSIA',
    uuid: 'da3858a2-95e3-53da-b92c-7f3d535a753d',
    released: '2020-11-17'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-baseball-cap-camel',
    price: 45,
    name: 'BASEBALL CAP - CAMEL',
    uuid: 'b56c6d88-749a-5b4c-b571-e5b5c6483131',
    released: '2020-10-19'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-beige',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BEIGE',
    uuid: 'f64727eb-215e-5229-b3f9-063b5354700d',
    released: '2021-01-11'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-veste-rouge-vermeil',
    price: 110,
    name: 'VESTE - ROUGE VERMEIL',
    uuid: '4370637a-9e34-5d0f-9631-04d54a838a6e',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/la-chemise-milleraie-bordeaux',
    price: 85,
    name: 'CHEMISE MILLERAIE MIXTE - BORDEAUX',
    uuid: '93d80d82-3fc3-55dd-a7ef-09a32053e36c',
    released: '2020-12-21'
  },
  {
    link: 'https://coteleparis.com//collections/tous-les-produits-cotele/products/le-bob-dylan-gris',
    price: 45,
    name: 'BOB DYLAN - TAUPE',
    uuid: 'f48810f1-a822-5ee3-b41a-be15e9a97e3f',
    released: '2020-12-21'
  }
]

// 🎯 TODO: New released products
// // 1. Log if we have new products only (true or false)
// // A new product is a product `released` less than 2 weeks.

const filter_release_range = filter_in_range(x => new Date(x.released));

const filter_release_2_weeks = filter_release_range(new Date(+new Date - 14*24*60*60*1000))(Date.now());

const cotele_new_release = filter_release_2_weeks(COTELE_PARIS);
console.log(cotele_new_release);

// 🎯 TODO: Reasonable price
// // 1. Log if coteleparis is a reasonable price shop (true or false)
// // A reasonable price if all the products are less than 100€

const all_verify = (get_attr) => (condition) => (array) => array.every(x => condition(get_attr(x)));

const all_price_below_100 = all_verify(x => x.price)(x => x < 100);

console.log(all_price_below_100(COTELE_PARIS));


// 🎯 TODO: Find a specific product
// 1. Find the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the product

const find_element_condition = (get_attr) => (condition) => (array) => array.find(x => condition(get_attr(x)));

const find_product_on_uuid = find_element_condition(x => x.uuid);

console.log(find_product_on_uuid(x => x == `b56c6d88-749a-5b4c-b571-e5b5c6483131`)(COTELE_PARIS)); 

// 🎯 TODO: Delete a specific product
// 1. Delete the product with the uuid `b56c6d88-749a-5b4c-b571-e5b5c6483131`
// 2. Log the new list of product

const remove_el_on_condition = (get_attr) => (condition) => (array) => array.filter(x => !condition(get_attr(x)));

const remove_product_on_uuid = (uuid) => remove_el_on_condition(x => x.uuid)(x => x === uuid);

console.log(remove_product_on_uuid(`b56c6d88-749a-5b4c-b571-e5b5c6483131`)(COTELE_PARIS));

// 🎯 TODO: Save the favorite product
let blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// we make a copy of blueJacket to jacket
// and set a new property `favorite` to true
let jacket = blueJacket;
jacket.favorite = true;

// 1. Log `blueJacket` and `jacket` variables
// 2. What do you notice?

console.log(blueJacket);
console.log(jacket);

// I notice that they were both refering to the same object in memory

blueJacket = {
  'link': 'https://coteleparis.com/collections/tous-les-produits-cotele/products/la-veste-bleu-roi',
  'price': 110,
  'uuid': 'b4b05398-fee0-4b31-90fe-a794d2ccfaaa'
};

// 3. Update `jacket` property with `favorite` to true WITHOUT changing blueJacket properties

jacket = {...blueJacket}
jacket.favorite=true;

console.log(blueJacket);
console.log(jacket);


/**
 * 🎬
 * The End
 * 🎬
 */

// 🎯 TODO: Save in localStorage
// 1. Save MY_FAVORITE_BRANDS in the localStorage
// 2. log the localStorage

const localStorage = {'fav_brands': MY_FAVORITE_BRANDS};
console.log(localStorage);

// EXTRA FUNCTIONS

const filter_on = (get_attr) => (condition) => (array) => array.filter(x => condition(get_attr(x)));

const filter_on_brand = filter_on(x => x.brand);

// Error if empty array
const get_min = (get_attr) => (array) => sort_by_ascending(get_attr)(array)[0];
const get_max = (get_attr) => (array) => sort_by_descending(get_attr)(array)[0];
