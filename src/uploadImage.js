const cloudinary = require("cloudinary").v2



cloudinary.config({ 
    cloud_name: 'dg0vztuof', 
    api_key: '644444351812215', 
    api_secret: 'ufn1HH-i1fFoeTpn2uawy-jw_CI' // Click 'View Credentials' below to copy your API secret
});

const opts = {
    overwrite:true,
    invalidate: true,
    resource_type: "auto"
};


module.exports = (image, opts) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if (result && result.secure_url) {
                console.log(result.secure_url);
                resolve(result.secure_url);
            } else {
                console.error(error.message);
                reject({ message: error.message });
            }
        });
    });
};
