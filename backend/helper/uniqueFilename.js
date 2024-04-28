const generateUniqueFilename = () => {
    
    const timestamp = new Date().getTime();


    const randomString = Math.random().toString(36).substring(2, 15);


    const filename = `${timestamp}_${randomString}`;

    return filename;
};

module.exports=generateUniqueFilename