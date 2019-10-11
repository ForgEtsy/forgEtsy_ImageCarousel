// Use faker for random review generator
const faker = require('faker');
const mongoose = require('mongoose');

// Import product files
const jewelry = require('../jewelry.js');
const housewares = require('../housewares.js');
const accessories = require('../accessories.js');
const toys = require('../toys.js');

// Set up schemas for database 'products'
const imagesSchema = new mongoose.Schema({
  listing_image_id: Number,
  listing_id: Number,
  url_75x75: String,
  url_170x135: String,
  url_570xN: String,
  url_fullxfull: String,
  full_height: Number,
  full_width: Number,
})

const productSchema = new mongoose.Schema({
  listing_id: { // <-- product id
    type: Number,
    unique: true,
  },
  title: String,
  description: String,
  price: Number,
  category_path: [String],
  Images: [imagesSchema],
  Shop: {
    shop_id: Number,
    shop_name: String,
    title: String,
    icon_url_fullxfull: String,
  },
  
  product_options: {
    option_1: {
      title: String,
      description_1: String,
      description_2: String,
      description_3: String,
      description_4: String,
    },
    option_2: {
      title: String,
      description_1: String,
      description_2: String,
      description_3: String,
      description_4: String,
    },
    option_3: {
      title: String,
      description_1: String,
      description_2: String,
      description_3: String,
      description_4: String,
    },
  },
});

const reviewSchema = new mongoose.Schema({
  review_id:{
    type: Number,
    unique: true,
  },
  // double check date format/keyword
  date: Date,
  description: String,
  rating: Number,
  user_name: String,
  user_photo_url: String,
  product_id: Number,
  product_user_image_url: String,
})

const Products = mongoose.model('Products', productSchema);
const Reviews = mongoose.model('Reviews', reviewSchema);


// Saves array of reviews to database
const reviewsSave = reviews => {
  Reviews.insertMany(reviews)
    .then(() => {
      console.log('...Saved reviews to database...')
    })
    .catch((err) => {
      console.log('...review saving err... :(', err.code);
    })
}

// Saves array of products to database
const productsSave = products => {
  Products.insertMany(products)
    .then((data) => {
      console.log('...Saved products to database...')
      const reviews = [];
      for(let i = 0; i < data.length; i++){
        let listing_id = data[i].listing_id;
        let max = 6;
        let min = 4;
        const random = Math.floor((Math.random() * (max - min)) + min+1);
        for(let j = 0; j < random; j++){
          let review = {
            review_id: Number(`${listing_id}${i}${j}`),
            date: faker.date.past(45),
            description: faker.lorem.sentences(),
            rating: Math.floor((Math.random() * 6)),
            user_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            user_photo_url: faker.image.avatar(),
            product_id: listing_id,
            product_user_image_url: 'FIND A ONE THINGY PICTURE ITEM BOI',
          }
          reviews.push(review);
        }
      }
      return reviews;
    })
    .then((reviews) => {
      reviewsSave(reviews);
    })
    .catch((err) => {
      console.log('...product saving err... :(', err);
    })
}

// Seed database with product items if empty
const seedDatabase = () => {
    Products.countDocuments((err, count) => {
      if(err){
        console.log('error counting')
      }else{
        if(count === 0){
        productsSave(jewelry.results);
        productsSave(housewares.results);
        productsSave(accessories.results);
        productsSave(toys.results);
      }
    }
  })
}

module.exports.seedDatabase = seedDatabase;
module.exports.Products = Products;