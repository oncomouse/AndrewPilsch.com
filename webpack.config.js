const webpack = require('webpack');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

var productionPlugins = [
	new webpack.LoaderOptionsPlugin({
		minimize: true,
		debug: false
	}),
	new webpack.optimize.UglifyJsPlugin({
		compress: {
			warnings: false
		},
		output: {
			comments: false
		},
		sourceMap: false
	})
];

var webpackConfig = {
	devtool: isProd ? 'hidden-source-map' : 'eval',
	entry: {
		js: [
			'index', 'vanilla-lazyload', 'add-ons'
		]
	},
	output: {
		path: path.join(__dirname, '.tmp', 'javascripts'),
		filename: 'bundle.js',
		publicPath: '/javascripts/'
	},
	module: {
		loaders: [
			{
				test: /\.(jsx|js)$/,
				exclude: /(node_modules|bower_components)/,
				loaders: [
					{
						loader: 'babel-loader',
						query: {
							cacheDirectory: true,
							presets: [['es2015', { "modules": false }], 'stage-0'],
							plugins: ['transform-runtime']
						},
						
					}
				]
			}
		],
	},
	resolve: {
		extensions: ['.js'],
		modules: [
			path.resolve('./app/'),
			path.resolve('./node_modules')
		],
		alias: {
			'masonry': 'masonry-layout'
		}
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin,
		new webpack.ProvidePlugin({
            'Promise': 'es6-promise',
            'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
        }),
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
		}),
		new webpack.LoaderOptionsPlugin({
			test: /\.s{0,1}css$/,
			options: {
				context: __dirname,
			}
		})
	],
	devServer: {
		contentBase: './app',
		noInfo: false,
		historyApiFallback: true
	}
};

if(isProd) {
	webpackConfig.plugins = webpackConfig.plugins.concat(productionPlugins)
}

module.exports = webpackConfig