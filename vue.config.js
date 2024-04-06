const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',
  devServer: {
    https: false, // Отключаем HTTPS
  },
  pluginOptions: {
    cordovaPath: 'src-cordova'
  }
})
