define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
        'balek-modules/Module',
        'balek-modules/coopilot/UNFIPackChange/Instance',
    ],
    function (declare, lang, topic, baseModule, moduleInstance) {

        return declare("coopilotUNFIPackChangeModule", baseModule, {
            _displayName: "CooPilot UNFI Pack Change Helper",
            _allowedSessions: [1],

            constructor: function (args) {

                declare.safeMixin(this, args);
                console.log("coopilotUNFIPackChangeModule  starting...");

            },
            newInstance: function (args) {
                //must be overridden from base
                return new moduleInstance(args);
            }
        });
    }
);


