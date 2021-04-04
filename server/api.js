const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const db = require('./db/index');


const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/search',  async (request, response)=>{
    
    let limit = request.query.limit;
    let brand = request.query.brand;
    let price = request.query.price;
    if(brand != null && price != null && limit != null)
    {
        limit = parseInt(limit);
        price = parseInt(price);
        const result = await db.filteredProducts(limit,brand,price);
        response.send({
            'limit':limit,
            'total':result.length,
            'results':result
            
        });
    }
    if(brand != null && price != null)
    {
        price = parseInt(price);
        const result = await db.filteredProducts(12,brand,price);
        response.send({
            'limit':limit,
            'total':result.length,
            'results':result
            
        });
    }
    if(brand != null && limit != null)
    {
        limit = parseInt(limit);
        const result = await db.findLimited({'brand': brand},limit);
        response.send({
            'limit':limit,
            'total':result.length,
            'results':result
            
        });
    }
    if(price != null && limit != null)
    {
        limit = parseInt(limit);
        price = parseInt(price);
        const result = await db.findLimited({'price': {$lt : price}}, limit);
        response.send({
            'limit':limit,
            'total':result.length,
            'results':result
            
        });
    }
    if(brand != null)
    {
        const result = await db.findLimited({'brand': brand}, 12);
        response.send({
            'limit':12,
            'total':result.length,
            'results':result
            
        });
    }
    if(price != null)
    {
        price = parseInt(price);
        const result = await db.findLimited({'price': {$lt : price}}, 12);
        response.send({
            'limit':12,
            'total':result.length,
            'results':result
            
        });
    }
    if(limit != null)
    {
        limit = parseInt(limit);
        const result = await db.findLimited({}, limit);
        response.send({
            'limit':limit,
            'total':result.length,
            'results':result
            
        });
    }

    
})

app.get('/products/:id',  async (request, response)=>{
    response.send(await db.findById(request.params.id))

})



app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);