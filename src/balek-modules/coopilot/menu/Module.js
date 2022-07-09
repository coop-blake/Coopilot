define(['dojo/_base/declare',
        'balek-modules/Module',


        'balek-modules/coopilot/menu/Instance'],
    function (declare, baseModule, moduleInstance) {
        return declare("coopilotMenuModule", [baseModule], {
            _displayName: "Coopilot Menu",
            _allowedSessions: [1],

            constructor: function (args) {

                declare.safeMixin(this, args);

                console.log("coopilotMenuModule  starting...");
            },
            newInstance: function (args) {
                //must be overridden from base
                return new moduleInstance(args);
            }
        });
    }
);


