define(['dojo/_base/declare',
        'balek-modules/base/database/controller',],
    function (declare, databaseController) {
        return declare("coopilotDatabaseController", [databaseController], {

            _Database: "coopilot",

            constructor: function (args) {

                declare.safeMixin(this, args);
                console.log("coopilotDatabaseController  starting...");
            }
        });
    }
);


