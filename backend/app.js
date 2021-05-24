/* Configure Express */
const express = require("express");
const app = express();

/* Configure MongoDB, Mongoose, etc. */
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const bodyParser = require('body-parser');

const passport = require('passport'); /* (5) */

const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

const cats = require("./models/cat")

/* Configure GraphQL and `schema`. Remember to capitalize `GraphQL`. */
const expressGraphQL = require("express-graphql"); /* (6) */
const schema = require("./schema/schema");

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello World")); /* (1) */

app.use(passport.initialize());
require('./config/passport')(passport);

/* Use the bodyParser package to parse incoming requests into json */
app.use(bodyParser.urlencoded({ extended: false })); /* (2) */
app.use(bodyParser.json());

app.use("/graphql", expressGraphQL({
  graphiqal: true,
  schema
}))

app.use("/api/users", users);
app.use("/api/tweets", tweets);

const port = process.env.PORT || 5000; /* (3) */

app.listen(port, () => console.log(`Server is running on port ${port}`)); /* (4) */

/*----------------------------------------------------------------------------*/

/*
(1) This creates a new Express server. Now let's setup a basic route so that we
can render some information on our page.

(2) Setup some middleware for body parser.

(3) Before we can run the server, we need to tell our app which port to run on. 
Keeping in mind that we will later be deploying our app to Heroku, which 
requires us to run our server on process.env.PORT, add the following line to 
app.js.

Locally our server will now run on localhost:5000.

(4) Finally, let's tell Express to start a socket and listen for connections on 
the path. Do so by adding the following line to your file.

This will also log a success message to the console when our server is 
running successfully.

(5) Most of the logic for our login functionality is complete. However, we will
need to use Passport to authenticate our token and construct private routes.
Recall that we set up our `register` and `login` routes to return `jwt` web
token in the response, and we will be saving that using our application on the
frontend. Eventually, we will want to send the web token back in the header of
every API request to our backend. Passport is able to authenticate that token
using different "strategies". For this project, we will be using `JwtStrategy`
to authenticate our web token.

(6) Layer of abstraction, or middleware, that we set up between Express and
GraphQL.
*/