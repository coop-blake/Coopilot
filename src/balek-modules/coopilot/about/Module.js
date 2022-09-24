define(['dojo/_base/declare',
        'balek-modules/Module',
        'balek-modules/coopilot/about/Instance'],
    function (declare, baseModule, moduleInstance) {
        return declare("coopilotAboutModule", baseModule, {
            _displayName: "Coopilot About",
            _allowedSessions: [0,1],

            constructor: function (args) {

                declare.safeMixin(this, args);
                console.log("coopilotAboutModule  starting...");
            },
            newInstance: function (args) {
                //must be overridden from base
                return new moduleInstance(args);
            }
        });
    }
);


