define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
        'balek-modules/Module',
        'balek-modules/coopilot/tabImporter/Instance',
    ],
    function (declare, lang, topic, baseModule, moduleInstance) {

        return declare("coopilotTabImporterModule", baseModule, {
            _displayName: "CooPilot Tabbed Data Importer",
            _allowedSessions: [1],

            constructor: function (args) {

                declare.safeMixin(this, args);
                console.log("coopilotTabImporterModule  starting...");

            },
            newInstance: function (args) {
                //must be overridden from base
                return new moduleInstance(args);
            }
        });
    }
);


