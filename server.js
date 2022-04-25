const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const Users = require('./models/users');
const schema = require('./models/schema');
var bodyParser = require('body-parser');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const username = encodeURIComponent('sonjoy');
const password = encodeURIComponent('sonjoy@123456');

main().catch((err) => console.log('sonjoy', err));

async function main() {
  const connect = await mongoose.connect(
    `mongodb+srv://${username}:${password}@cluster0.wvrbs.mongodb.net/test?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  if (connect) {
    console.log('connected');
  }
}

// Basic CRUD operation with mongoDB

// GET
app.get('/user', async (req, res) => {
  try {
    const userDetails = await Users.find();
    res.send(userDetails);
  } catch (err) {
    console.log('~ err', err);
  }
});

// INSERT
app.post('/user', async (req, res) => {
  console.log('body', req.body);
  try {
    const newUser = new Users(req.body);

    newUser.save(function(err, data) {
      if (err) {
        console.log(err._message);
      } else {
        res.send('Data inserted');
      }
    });
  } catch (err) {
    console.log('~ err', err);
  }
});

// DELETE
app.delete('/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userDelete = await Users.remove({ _id: id });
    res.send('User deleted successfully');
  } catch (err) {
    console.log('~ err', err);
  }
});

// UPDATE
app.put('/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userDelete = await Users.findByIdAndUpdate(
      { _id: id },
      { ...req.body }
    );
    res.send('User updated successfully');
  } catch (err) {
    console.log('~ err', err);
  }
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.listen(4000, () => {
  console.log('connected port 4000');
});
