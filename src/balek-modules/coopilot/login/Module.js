define(['dojo/_base/declare',
        'balek-modules/Module',
        'balek-modules/coopilot/login/Instance'],
    function (declare, baseModule, moduleInstance) {
        return declare("coopilotLoginModule", baseModule, {
            _displayName: "Coopilot Login",
            _allowedSessions: [0],

            constructor: function (args) {

                declare.safeMixin(this, args);
                console.log("coopilotLoginModule  starting...");
            },
            newInstance: function (args) {
                //must be overridden from base
                return new moduleInstance(args);
            }
        });
    }
);


