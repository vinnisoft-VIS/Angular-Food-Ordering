import express from 'express';
import path from 'path';
import {
  dirname
} from 'path';
import {
  fileURLToPath
} from 'url';

const __dirname = dirname(fileURLToPath(
  import.meta.url));

const app = express();

const port = process.env.PORT || 8017;

app.use(express.static(__dirname + '/dist/denis-kebab-web'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname +
    '/dist/denis-kebab-web/index.html'));
});

app.listen(port, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});