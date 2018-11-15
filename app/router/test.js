'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const { router, controller,middleware } = app;
  const handleform =middleware.uploadfile();
  //表单提交
  router.post('/uploadForm',handleform,controller.test.uploadForm);
  //下载zip
  router.get('/backOfficegen',controller.test.backOfficegen);

  //发送邮件
  router.post('/sendEmail',controller.test.sendEmail);
 

};
