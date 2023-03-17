const assert = require('assert');
const redis = require('ioredis');

let client;
const createConnect = (app) => {
    const config = app.config.redis;

    if(config.client.cluster === true) {
        assert(config.client.nodes && config.client.nodes.length !== 0, '[mahudas-redis] cluster nodes config is required');

        config.client.nodes.map((node) => {
            assert(node.host && node.port && node.password !== undefined && node.db !== undefined, `[mahudas-redis] 'host: ${node.host}', 'port: ${node.port}', 'password: ${node.password}', 'db: ${node.db}' are required on config`);
        });

        client = new redis.Cluster(config.client.nodes, config);
    } else {
        assert(config.client.host && config.client.port && config.client.password !== undefined && config.client.db !== undefined,
            `[mahudas-redis] 'host: ${config.client.host}', 'port: ${config.client.port}', 'password: ${config.client.password}', 'db: ${config.client.db}' are required on config`);

        client = new redis(config.client);
    }

    client.on('connect', () => {
        app.coreLogger.info('\x1b[34m▉ Redis client connect success;\x1b[0m');
    });
    client.on('error', err => {
        app.coreLogger.error('\x1b[31m▉ Redis client Error: %s\x1b[0m', err);
    });

    return client;
};

const disconnect = async (app) => {
    try {
        await client.disconnect();
        app.coreLogger.info('\x1b[34m▉ Redis client destroyed\x1b[0m');
    } catch (e) {
        app.coreLogger.info('\x1b[31m▉ Redis client destroyed Error\x1b[0m');
        app.coreLogger.error(e);
    }
};

module.exports = {
    createConnect,
    disconnect
}
