module.exports = {
  publicPath: '',
  outputDir: 'dist',
  assetsDir: 'assets', // 静态资源目录
  lintOnSave: false,// 是否开启eslint 语法检查
  chainWebpack: config => {
    // GraphQL Loader
  },
  // //这里是新增的代码, 调试下域名代理功能
  // devServer: {
  //   // 设置主机地址
  //   host: 'ngxx.qmtest.com',
  //   // 设置默认端口
  //   port: 8080,
  //   // 设置代理
  //   proxy: {
  //     /**
  //      * changeOrigin:true
  //      * /api/test
  //      * http://localhost:5000/test
  //      * changeOrigin:false
  //      * /api/test
  //      * http://localhost:5000/api/test
  //      */
  //     '/api':{
  //       // 设置目标API地址
  //       target: 'http://192.168.1.12',
  //       // 如果要代理 websockets
  //       ws: false,
  //       // 将主机标头的原点改为目标URL
  //       changeOrigin: false
  //     }
  //   }
  // }
}
