module.exports = {
    // TODO: if you need to change entry point
    // TODO: if you need to change output
    module: {
        rules: [{
            test: /\.(graphql|gql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
        }]
    }
}

