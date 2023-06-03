const { v4: uuidv4 } = require('uuid');

const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];
  
    const imageParams = {
      // Replace the <My_Bucket_Name> with the name of your own S3 bucket
      Bucket: 'user-images-11bd1687-3030-4f8e-95dc-c7f8f0151041', 
      Key: `${uuidv4()}.${fileType}`,
      Body: fileName.buffer,
      ACL: 'public-read', // allows read access to this file, To access the images in the bucket from a public URL
    };
  
    return imageParams;
  };

  module.exports = params;