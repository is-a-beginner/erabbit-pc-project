const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  devServer: {
    allowedHosts: 'all'
  },
  transpileDependencies: true,
  lintOnSave: false,

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less'),
      ]
    }
  },
    // 这个是给webpack-dev-server开启可IP和域名访问权限。
    // chainWebpack: config => {
    //   config.devServer.disableHostCheck(true)
    // }

})
