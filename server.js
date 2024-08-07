const sequelize = require("./config/connection");
const express = require("express");
const PORT = process.env.PORT || 3001;
const routes = require("./controllers");
const path = require('path');
const exphbs = require('express-handlebars');

// initialize express
const app = new express();

// initialize hb
const hbs = exphbs.create({});

// configure hb as the templating engine
app.engine('handlebars', hbs.engine);
// configure the default view engine to hb
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));
    });


