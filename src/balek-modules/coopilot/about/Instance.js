define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
        'balek-modules/Instance',
    ],
    function (declare, lang, topic, baseInstance) {
        return declare("moduleCoopilotAboutInstance", baseInstance, {
            _instanceKey: null,

            constructor: function (args) {
                declare.safeMixin(this, args);
                console.log("moduleCoopilotAboutInstance starting...");

            }
        });
    }
);


