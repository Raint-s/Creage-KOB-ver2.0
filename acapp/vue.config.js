const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    // No need for splitting
    optimization: {  // 让最后的打包文件为1，不分块
      splitChunks: false
    }
  }
})