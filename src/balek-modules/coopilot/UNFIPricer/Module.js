define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
        'balek-modules/Module',
        'balek-modules/coopilot/UNFIPricer/Instance',
    ],
    function (declare, lang, topic, baseModule, moduleInstance) {

        return declare("coopilotUNFIPricerModule", baseModule, {
            _displayName: "CooPilot Tabbed Data Importer",
            _allowedSessions: [1],

            constructor: function (args) {

                declare.safeMixin(this, args);
                console.log("coopilotUNFIPricerModule  starting...");

            },
            newInstance: function (args) {
                //must be overridden from base
                return new moduleInstance(args);
            }
        });
    }
);


