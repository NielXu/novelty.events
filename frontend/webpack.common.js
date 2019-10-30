module.exports = {
    entry: __dirname + '/js/index.jsx',

    output: {
        path: __dirname + '/../backend/static',
        filename: 'bundle.js'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/react']
                        }
                    }
                ]
            }
        ]
    }
}