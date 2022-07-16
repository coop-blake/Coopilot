
var loadModule = "../../../../balek-modules/coopilot/UNFIPricer/Interface/main.js";

function getConfig(env) {
    // env is set by the 'buildEnvronment' and/or 'environment' plugin options (see webpack.config.js),
    // or by the code at the end of this file if using without webpack
    dojoConfig = {
        baseUrl: '.',
        packages: [
            {
                name: 'dojo',
                location: '../../../../lib/dojo-release-src' + '/dojo',
                lib: '.'
            },
            {
                name: 'dijit',
                location: '../../../../lib/dojo-release-src' + '/dijit',
                lib: '.'
            },
            {
                name: 'dojox',
                location: '../../../../lib/dojo-release-src' + '/dojox',
                lib: '.'
            },
            {
                name: "balek",
                location: "../../../../src/balek"
            },
            {
                name: "balek-server",
                location: "../../../../src/balek-server"
            },
            {
                name: "balek-modules",
                location: "../../../../src/balek-modules"
            },
            {
                name: "balek-client",
                location: "../../../../src/balek-client"
            }
        ],

        deps: [loadModule],

        async: true,

        has: {'dojo-config-api': 0},


    };
    return dojoConfig;
}
// For Webpack, export the config.  This is needed both at build time and on the client at runtime
// for the packed application.
if (typeof module !== 'undefined' && module) {
    module.exports = getConfig;
} else {

}
