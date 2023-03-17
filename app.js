const redis = require('./lib/redis');

module.exports = (app) => {
    // 當config被載入後就開始進行連線
    app.on('configDidLoad', () => {
        app.redis = redis.createConnect(app);
    });

    // 離開app時切斷連線
    app.on('beforeClose', async () => {
        await app.redis.disconnect(app);
    });
};
