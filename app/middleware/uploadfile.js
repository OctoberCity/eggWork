const path =require("path");
const fs =require("fs");
const pump = require('mz-modules/pump');


//  
module.exports = (option, app) => {
    return async function uploadform(ctx, next) { 
        let stream;
        const params={};
        const files =[];
        console.log("一次"); 
         const parts = ctx.multipart();

        while ((stream = await parts()) != null) {
            if (stream instanceof Array) {
              params[stream[0] + ''] = stream[1];
            } else {
              //这里处理文件的各种信息
              const file = {};
              const filename = stream.filename.toLowerCase();
              //设置上传路径
              const servicename = (new Date()).getTime() + filename;
              const target = path.join('./', servicename);
              const writeStream = fs.createWriteStream(target);
              file.type = stream.fieldname;
              file.filename = filename;
              file.servicename = target;
              await pump(stream, writeStream);
              files.push(file);
            }
      
          }
          //将所有要的信息存进ctx中
          ctx.request.body={params,files}

        await next();  
    }

};