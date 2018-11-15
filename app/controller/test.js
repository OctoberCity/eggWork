'use strict';
const officegen= require("officegen");
const archiver  = require("archiver");
const {PassThrough} = require("stream");
const nodemailer = require('nodemailer');
const Controller = require('egg').Controller;


class HomeController extends Controller {
    async uploadForm() {
        const  {ctx} = this;
        // 测试处理带文件表单上传测试
        // 中间件处理之后将文件信息保存在file数组中
        // 处理成功返回文件信息以及参数信息
        const fileArray = ctx.request.body;
        console.log(fileArray);
        ctx.body={"hj1":fileArray};
     }


 

     async backOfficegen(){
         // 返回office文档的zip压缩，使用officegen
           //初始化docx文档
          let docx = officegen({type:'docx'});
          let objp = docx.createP(); 
           objp.addText("这是插入docx文件的文字"); 
           const docxout = new PassThrough(); 
           const output = new PassThrough(); 
           // 将文档流写入通道中
           docx.generate(docxout);
           // 压缩
           const archive = archiver('zip');
           archive.append(docxout, {
            name:'测试.docx',
          });
          archive.finalize();
        // 将压缩流写入输出通道中
           archive.pipe(output);
           this.ctx.type = 'application/zip';
           this.ctx.set('Content-disposition', 'attachment; archive-name.zip');
           this.ctx.body = output;
     }

     async sendEmail(){
         //邮箱发附件
         let transporter = nodemailer.createTransport(
            {
                service: 'qq',
                port:111,
                secureConnection:true,
                auth: {
                    password:'授权code'
                    username:'1730653658@qq.com'
                },  
            },
            {  
                from: '1730653658@qq.com',
                headers: {
                    'X-Laziness-level': 1000  
                }
            }
        );
        
      
        let message = { 
            to: '1730653658@qq.com', 
            subject: 'subject',  
            text: '你好hello world', 
            html:
                '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
                '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>', 
            watchHtml: '<b>Hello</b> to myself', 
            attachments: [ 
                {
                    filename: 'notes.txt',
                    content: 'Some notes about this e-mail',
                    contentType: 'text/plain' 
                }, 
                {
                    filename: 'image.png',
                    content: Buffer.from(
                        'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                            '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                            'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
                        'base64'
                    ),
        
                    cid: 'note@example.com' // should be as unique as possible
                }, 
                {
                    filename: 'nyan cat ✔.gif',
                    path: __dirname + '/assets/nyan.gif',
                    cid: 'nyan@example.com' // should be as unique as possible
                }
            ]
        };
         // sendMail
        transporter.sendMail(message, (error, info) => {
            if (error) return;
            console.log(info.response);
            transporter.close();
        });
     }



}

module.exports = HomeController;
