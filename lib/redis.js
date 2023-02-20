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
        console.info('\x1b[34m%s\x1b[0m', '[mahudas-redis] client connect success');
    });
    client.on('error', err => {
        console.error('\x1b[34m%s\x1b[0m', '[mahudas-redis] client Error: %s', err);
    });

    return client;
};

const disconnect = async () => {
    try {
        await client.disconnect();
        console.log('\x1b[34m%s\x1b[0m', '[mahudas-redis] client destroyed');
    } catch (e) {
        console.log('\x1b[34m%s\x1b[0m', '[mahudas-redis] client destroy Error');
        console.log('\x1b[34m%s\x1b[0m', e);
    }
};

module.exports = {
    createConnect,
    disconnect
}
