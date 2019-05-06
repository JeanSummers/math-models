const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Path relative to folder where this file located
const homePath = (...args) => path.resolve(__dirname, ...args)


// List of all options on https://webpack.js.org/configuration/
module.exports = {
    
    // Chosen mode tells webpack to use its built-in optimizations accordingly.
    mode: 'production', // "production" | "development" | "none"

    // Here the application starts executing and webpack starts bundling
    // Defaults to ./src
    entry: { // string | object | array
        "springs": homePath('./src/springs/index.ts'), 
        "temperature": homePath('./src/temperature/index.ts'), 
        "randomStream": homePath('./src/randomStream/index.ts'), 
    },

    // Options related to how webpack emits results
    output: {

        // The target directory for all output files
        // Must be an absolute path (use the Node.js path module)
        path: homePath('./dist'), // string

        // The filename template for entry chunks
        filename: '[name].js' // string
    },

    // Configuration regarding modules
    module: {

        // Rules for modules (configure loaders, parser options, etc.)
        rules: [
            { 
                test: /\.tsx?$/, 
                loader: 'ts-loader' 
            }
        ]
    },

    // Options for resolving module requests
    // (does not apply to resolving to loaders)
    resolve: {

        // Extensions that are used
        extensions: ['.ts', '.tsx', '.js'],

        // A list of module name aliases
        // Dont forget to sync tsconfig.json "path" option
        alias: {
            "@Animations": homePath('./src/animation-lib/src'),
        }
    },

    plugins: [
        // Plugin to generate separate 
        // web pages for different projects
        new HtmlWebpackPlugin({
            template: "./templates/springs.html",
            filename: "springs.html",
            chunks: ["springs"]
        }),
        new HtmlWebpackPlugin({
            template: "./templates/temperature.html",
            filename: "temperature.html",
            chunks: ["temperature"]
        }),
        new HtmlWebpackPlugin({
            template: "./templates/randomStream.html",
            filename: "randomStream.html",
            chunks: ["randomStream"]
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: "./templates/index.html",
            filename: "index.html",
        }),
    ],
}