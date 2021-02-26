module.exports = {
    devServer: {
        port: 9000,
        host: '0.0.0.0',
        open: true,
        hot: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },

}