const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// set storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

// input upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

// check file type
function checkFileType(file, cb){
     // Allowed ext
     const filetypes = /jpeg|jpg|png|gif/;
     // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime type
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

// init app 
const app = express();

// EJS 
app.set('view engine', 'ejs');

// PUBLIC FOLDER
app.use(express.static('./public'));

// ROUTES
app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
      if(err){
          res.render('index', {
              msg: err
          });
      } else {
          console.log(req.file);
          res.send('test');
      }
    });
})
const port = 3000;

app.listen(port, () => console.log(`server started on port ${port}`));

