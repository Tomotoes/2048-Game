const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	entry: {
		app: './js/entry.js'
	},
	output: {
		path: `${__dirname}/public/`,
		filename: '[name].[hash].js',
		publicPath:
			process.env.NODE_ENV !== 'DEV'
				? 'https://cdn.jsdelivr.net/gh/Tomotoes/2048/'
				: '/'
	},
	devServer: {
		contentBase: './public',
		inline: true,
		hot: true,
		open: true
	},
	resolve: {
		extensions: ['.js', '.html', '.css', '.txt', '.scss', '.ejs', '.json'],
		alias: {
			template: path.resolve(__dirname, 'template/'),
			css: path.resolve(__dirname, 'css/')
		}
	},
	module: {
		rules: [
			{
				test: /\.(css|scss)?$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{ loader: 'css-loader?modules', options: { importLoaders: 1 } },
						{
							loader: 'postcss-loader',
							options: { plugins: loader => [require('autoprefixer')()] }
						},
						{ loader: 'sass-loader' }
					]
				})
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: { presets: ['latest'] },
				include: path.resolve(__dirname, './js'),
				exclude: path.resolve(__dirname, './node_modules')
			},
			{
				test: /\.pug$/,
				use: {
					loader: 'pug-loader',
					options: { self: true, pretty: true }
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),

		new htmlWebpackPlugin({
			filename: 'index.html',
			template: './template/index.pug',
			title: '2048',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			}
		}),

		new ExtractTextPlugin('css/[name].[hash].css'),

		new webpack.BannerPlugin('Anthor:Simon'),

		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),

		new webpack.HotModuleReplacementPlugin()
	],
	optimization: {
		minimizer: [new UglifyJsPlugin()]
	}
}
