const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:3030',
            //target: 'https://loa.vatsim-germany.org',
            changeOrigin: true,
        })
    );
};
