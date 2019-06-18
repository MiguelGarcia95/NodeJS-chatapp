const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const port = process.env.PORT || 3000;
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');

//set up handlebars engine
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Setup static dir to serve
app.use(express.static(publicDirPath));

app.get('', (req, res) => {
  res.render('index');
})

app.listen(port, () => {
  console.log('Server is up')
});