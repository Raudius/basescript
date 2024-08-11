import path from 'path'

import { routes } from './routes'

export default function () {
  this.options.alias['@basescript'] = path.resolve(
    __dirname,
    './'
  )
  this.extendRoutes((configRoutes) => {
    configRoutes.push(...routes)
  })
  this.appendPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
  })
  this.options.css.push(path.resolve(__dirname, 'assets/scss/default.scss'))

  this.requireModule('worker-loader')

  this.extendBuild((config, { isDev, isClient }) => {
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: {
        loader: 'worker-loader',
      },
    })
  })
}
