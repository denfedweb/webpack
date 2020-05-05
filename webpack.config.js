const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin"); 
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimazeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");


// flag dev
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

function optimization() { 
    const config = {
        splitChunks: {
            chunks: "all"
        },
        minimizer: []
    }

    if(isProd){
        // оптимизация и минификация жс и ксс
        config.minimizer = [
            new OptimazeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
 }

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

function cssLoaders(extra) { 
    const loaders =  [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                // hot moving replacment
                hmr: isDev,
                reloadAll: true
            }
        },
        'css-loader'
    ]

    if(extra) {
        loaders.push(extra);
    }

    return  loaders
 }

 function babelOptions(preset){
     const options = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if(preset){
        options.presets.push(preset);
    }

    return options
 }

 function jsLoaders() { 
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }];

    if(isDev){
        loaders.push('eslint-loader')
    }
    return loaders
  }

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: ['@babel/polyfill','./app.js'],
        analytics: "./analytics.ts"
    },
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        // расширения по умолчанию
        extensions: [".js", ".json"],
        // пресеты для путей 
        alias: {
            "@models": path.resolve(__dirname, "src/models"),
            '@': path.resolve(__dirname, 'src')
        }
    },
    // соурс мэпы для отслеживания исходного кода
    devtool: isDev ? "source-map" : '',
    // что бы не тащить в бандл библиотеки во все файлы где они юзаются 
    // общие либы будут хранится в вендор файлах 
    optimization: optimization(),
    devServer: {
        port: 3200,
        hot: isDev
    },
    // плагины
    plugins: [
        // путь до хтмл, подсовывет скрипты из билда
        new HTMLWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: isProd
            }
        }),
        // очищает папку с билдом
        new CleanWebpackPlugin(),
        // перенос файлов
        new CopyPlugin([
            {
                from: path.resolve(__dirname, "src/favicon.ico"),
                to: path.resolve(__dirname, "dist")
            }
        ]),
        // создание файла ксс в бандле 
        new MiniCssExtractPlugin({
            filename: filename("css")
        })
    ],
    module: {
        // работа с файлами разных типов
        rules: [
            // работа с ксс
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.stylus$/,
                use: cssLoaders('stylus-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|jpeg|svg|ico|gif)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
               test: /\.xml$/,
               use: ['xml-loader'] 
            },
            {
               test: /\.csv$/,
               use: ['csv-loader'] 
            },
            // BABEL
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: jsLoaders()
                // loader: {
                //     loader: "babel-loader",
                //     options: babelOptions()
                // } 
            },
            // TYPESCRIPT
            { 
                test: /\.ts$/, 
                exclude: /node_modules/, 
                loader: {
                    loader: "babel-loader",
                    options: babelOptions('@babel/preset-typescript')
                } 
            },
            // react (need install react, react-dom)
            { 
                test: /\.jsx$/, 
                exclude: /node_modules/, 
                loader: {
                    loader: "babel-loader",
                    options: babelOptions('@babel/preset-react')
                } 
            },
        ]
    }
}