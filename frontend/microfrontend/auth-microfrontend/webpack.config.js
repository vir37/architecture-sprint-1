const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');

module.exports = {
    resolve: {
        alias: {
          'shared-usercontext_shared-library': path.resolve(__dirname, '../../shared-library'),
        },
    },
    plugins : [
        new ModuleFederationPlugin({
            name: "auth",
            filename: 'remoteEntry.js',
            exposes : {
                './Auth': './src/AuthApp',
            },
            shared: [
                'react',
                'react-dom',
                {
                    'shared-usercontext_shared-library': {
                        import: 'shared-usercontext_shared-library',
                        requiredVersion: require('../../shared-library/package.json').version,
                    }
                }
            ]
        }),
    ]
}