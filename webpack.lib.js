const webpack = require('webpack');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PACKAGE = require('./package.json');
const banner = PACKAGE.name + ' - ' + PACKAGE.version + ' | ' +
	'(c) ' + new Date().getFullYear() + ',  ' + PACKAGE.author + ' | ' +
	PACKAGE.license + ' | ' +
	PACKAGE.homepage;

console.log('webpack __dirname', __dirname);

module.exports = env => {
	return [
		{
			entry: { 'ecljs': "./src/index.ts" },
			mode: 'development',
			devtool: 'source-map',
			output: {
				library: 'ecljs',
				libraryTarget: 'umd',
				//globalObject: 'this',
				path: path.resolve(__dirname, 'dist'),
				filename: '[name].js'
			},
			module: {
				rules: [
					{
						test: /\.(ts|js)x?$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
					},
				]
			},
			plugins: [
				new uglifyJsPlugin(),
				new webpack.BannerPlugin(banner),
			],
			resolve: {
				extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
			}
		},
		{
			entry: { 'ecljs.min': "./src/index.ts" },
			mode: "production",
			output: {
				library: 'ecljs',
				libraryTarget: 'umd',
				//globalObject: 'this',
				path: path.resolve(__dirname, 'dist'),
				filename: '[name].js'
			},
			module: {
				rules: [
					{
						test: /\.(ts|js)x?$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
					},
				]
			},
			plugins: [
				new uglifyJsPlugin(),
				new webpack.BannerPlugin(banner),
			],
			resolve: {
				plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.prod.json" })],
				extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
			}
		},
	];
}