const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
	entry: {
		app: './js/entry.js'
	},
	output: {
		path: `${__dirname}/public`,
		filename: 'main.js'
	},
	devServer: {
		contentBase: './public',
		inline: true,
		hot: true
	},
	resolve: {
		extensions: ['.js', '.html', '.css', '.txt', '.less', '.ejs', '.json'],
		alias: {
			template: path.resolve(__dirname, 'template/'),
			css: path.resolve(__dirname, 'css/')
		}
	},
	module: {
		rules: [
			{
				test: /\.(css|less)?$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{ loader: 'css-loader?modules', options: { importLoaders: 1 } },
						{
							loader: 'postcss-loader',
							options: { plugins: loader => [require('autoprefixer')()] }
						},
						{ loader: 'less-loader' }
					]
				})
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: { presets: ['latest'] },
				include: path.resolve(__dirname, './js'),
				exclude: path.resolve(__dirname, './node_modules')
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin('public'),

		new htmlWebpackPlugin({
			filename: 'index.html',
			template: './template/index.html',
			title: '2048',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			}
		}),

		new ExtractTextPlugin('./css/[name].min.css'),

		new webpack.BannerPlugin('Anthor:Simon'),

		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
		}),

		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),

		new webpack.HotModuleReplacementPlugin()
	]
}
