
import autoprefixer from 'autoprefixer'
import pxtoviewport from 'postcss-px-to-viewport'
import cdnDependencies from './dependencies-cdn.js'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import path from "path";
function resolve(dir) {
  return path.join(__dirname, dir)
}

import defaultSettings from './src/settings.js'
const name = defaultSettings.title || 'Vue3 H5 Template'

// 设置不参与构建的库
const externals = {}
cdnDependencies.forEach(pkg => { externals[pkg.name] = pkg.library })

// 引入文件的 cdn 链接
const cdn = {
  css: cdnDependencies.map(e => e.css).filter(e => e),
  js: cdnDependencies.map(e => e.js).filter(e => e),
  ttf: cdnDependencies.map(e => e.ttf).filter(e => e)
}

module.exports = {
  lintOnSave: true,
  publicPath: './',
  productionSourceMap: false, // 去除生产环境.map文件
  configureWebpack: (config) => {
    const configNew = {
      name: name, // 设置 html 标题名
      resolve: {
        // 设置 alias
        alias: {
          '@': resolve('src')
        }
      }
    }
    if (process.env.NODE_ENV === 'production') {
      configNew.plugins = [
        // gzip
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          test: new RegExp('\\.(' + ['js', 'css', 'ttf', 'otf', 'mp3'].join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      ]
    }
    return configNew
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtoviewport({
            viewportWidth: 375, //视口的宽度，对应的时设计稿的宽度/2，一般为750，对应iPhone6的宽度
            viewportHeight: 667, //视口的高度，对应的是设计稿的高度（也可以不配置）
            unitPrecision: 5, //指定‘px’转换为视口单位值的小数位数（很多时候无法整除）小数位为5位
            viewportUnit: 'vw', //指定需要转换成的视口单位，建议使用vw(宽度)
            minPixelValue: 1, //小于或等于‘1px’不转换为视口单位
            mediaQuery: false,
          })
        ]
      }
    }
  },
  chainWebpack: (config) => {
    // CDN
    if (process.env.NODE_ENV === 'production' && process.env.VUE_APP_CDN_DEPS !== 'false') {
      config.externals(externals)
      // 添加 CDN 参数到 htmlWebpackPlugin 配置中
      const targetHtmlPluginNames = ['html']
      targetHtmlPluginNames.forEach((name) => {
        config.plugin(name).tap(options => {
          options[0].cdn = process.env.NODE_ENV === 'production' ? cdn : []
          return options
        })
      })
    }

    // 设置 svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
