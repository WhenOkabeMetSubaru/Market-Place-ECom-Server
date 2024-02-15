const path = require('path');
const fs = require('fs');


const getFile = async()=>{
    return 'Hello File';
}
const uploadFile = async(_,{file})=>{
    console.log('hello')
    console.log(file)
    const {filename,mimetype,encoding,createReadStream} = await  file;

    
    const stream = createReadStream();
    const pathName = path.join(__dirname,`../../public/images/${filename}`);
    await stream.pipe(fs.createWriteStream(pathName));

    return {
        url:`http://localhost:4000/images/${filename}`
    }

}

module.exports = {getFile,uploadFile};