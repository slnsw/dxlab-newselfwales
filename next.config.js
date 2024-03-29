require('dotenv').config();
// eslint-disable-line
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const withCSS = require('@zeit/next-css');

module.exports = withCSS({
	assetPrefix: '/newselfwales/assets',
	webpack: (config, { dev }) => {
		const customConfig = {
			...config,
		};

		customConfig.plugins = config.plugins.filter(
			(plugin) => plugin.constructor.name !== 'UglifyJsPlugin',
		);

		// Environment variables
		customConfig.plugins.push(new webpack.EnvironmentPlugin(process.env));

		// customConfig.plugins.push(
		// 	new ExtractTextPlugin({
		// 		filename: '/static/newselfwales/style.css',
		// 	}),
		// );

		if (dev) {
			config.plugins.push(
				new StyleLintPlugin({
					configFile: './.stylelintrc.js',
					files: ['**/*.css'],
					emitErrors: false,
				}),
			);

			customConfig.module.rules.push({
				enforce: 'pre',
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
			});
		}

		return customConfig;
	},
});
