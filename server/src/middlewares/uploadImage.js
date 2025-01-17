const multer  = require('multer');
// const path = require('path');
// const createError = require('http-errors');
const { UPLOAD_USER_IMG_DIRECTORY, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require('../config');


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null,UPLOAD_USER_IMG_DIRECTORY)
//     },
//     filename: function (req, file, cb) {
//       // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       // cb(null, file.fieldname + '-' + uniqueSuffix)
//       const extname = path.extname(file.originalname);
//       cb(
//         null,
//         Date.now() + '-' + file.originalname.replace(extname, '') + extname
//       )
//     }
//   })

  // const fileFilter = (req, file,cb) =>{
  //   const extname =path.extname(file.originalname);
  //   if(!ALLOWED_FILE_TYPES.includes(extname.substring(1))){
  //     return cb(new Error('File Type not Allowed'),
  //     false)
  //   }
  //   cb(null, true);
  // }
  
  // const upload = multer({ storage: storage ,
  //   limits:{fileSize: MAX_FILE_SIZE},
  //   fileFilter,
  //  })

  const storage = multer.memoryStorage()

  const fileFilter = (req, file,cb) =>{
     if(!file.mimetype.startsWith('image/')){
      return cb(new Error('Only image files are allowed'), false);
     }

     if(file.size > MAX_FILE_SIZE){
      return cb(new Error('File Size exceeds the maximum limit'), false);
     }

     if(!ALLOWED_FILE_TYPES.includes(file.mimetype)){
      return cb(new Error('File Type is not Allowed'), false);
     }

     cb(null, true);
  }

  const upload = multer({
    storage: storage ,
    fileFilter: fileFilter,
  })

  module.exports ={upload}