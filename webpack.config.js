const webpack = require('webpack');
const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin');

const commonConfig = {
	node: {
		__dirname: true
	},
	module: {
		rules: [
			{
				test: /\.ts(x)?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [MiniCssExtractPlugin.loader, "css-loader"]
			},
			{
				test: /\.(png|svg|jpe?g|gif)$/i,
				loader: 'file-loader',
				options: {
					name: 'img/[name].[ext]',
					publicPath: '../',
				},
			},
		]
	},
	resolve: {
		plugins: [],
		extensions: ['.js', '.ts', '.tsx', '.jsx', '.json']
	}
}

const miniext = (mode) => mode == "production" ? ".min" : "";

module.exports = env => {

	let
		plugins = [
			new MiniCssExtractPlugin({
				filename: `[name]${miniext(env.mode)}.css`
			}),
			new CopyPlugin({
				patterns: [
					{ from: './libs/purecss.min.css', to: 'purecss.min.css' },
				]
			})
		];
	if (env.mode == 'development') {
		plugins.push(new webpack.NamedModulesPlugin());
		plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	let obj = {
		mode: env.mode,
		output: {
			path: path.resolve(__dirname, 'dist'), // __dirname, //
			filename: `[name]${miniext(env.mode)}.js`,
		},
		devServer: {
			contentBase: path.resolve(__dirname, 'dist'),
			hot: true,
			port: 9000
		},
		entry: {
			'index': ["./src/test/index.ts", "./src/test/styles.css"],
		},
		plugins: plugins,
	};

	if (env.mode == 'production') {
		obj.optimization = {
			minimize: true,
			minimizer: [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})],
		}
	}

	return [
		Object.assign(obj, commonConfig),
	]
}