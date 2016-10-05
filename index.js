var express = require('express');
var bodyParser = require('body-parser');
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var app = express();

var defaultDocument = fs.readFileSync('default.tex');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res) => {
  var tex = req.body.tex || req.query.tex || defaultDocument;
  console.log(tex.toString());
  var filename = ~~(Math.random() * 1e9);
  var filepath = path.join(__dirname, 'src', filename + '.tex');
  fs.writeFile(filepath, tex, (err) => {
    childProcess.exec(`texify -pcq ${filepath}`, (err) => {
      res.sendFile(path.join(__dirname, `${filename}.pdf`));
    });
  });
});

app.listen(4000);
