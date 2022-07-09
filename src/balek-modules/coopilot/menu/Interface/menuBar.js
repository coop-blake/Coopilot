define(['dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/topic',
        //Dojo browser includes
        'dojo/dom',
        'dojo/dom-construct',
        "dojo/dom-geometry",
        "dojo/dom-style",
        "dojo/_base/window",
        "dojo/ready",
        "dojo/fx",
        "dojo/keys",
        //Dijit widget includes
        "dijit/Viewport",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        'dojo/text!balek-modules/coopilot/menu/resources/html/menuBar.html',
        'dojo/text!balek-modules/coopilot/menu/resources/css/menuBar.css',

        //Coopilot ui components
        "balek-modules/coopilot/ui/input/getUserInput",

        "balek-modules/coopilot/menu/Interface/menus/workspacesMenu/menuWidget",
        //Balek Interface Includes
        'balek-modules/components/syncedCommander/Interface',

    ],
    function (declare,
              lang,
              topic,
              //Dojo browser includes
              dom,
              domConstruct,
              domGeometry,
              domStyle,
              win,
              dojoReady,
              fx,
              dojoKeys,
              //Dijit widget includes
              dijitViewPort,
              _WidgetBase,
              _TemplatedMixin,
              template,
              mainCss,
              //Coopilot ui components
              getUserInput,
              workspaceMenu,

              //Balek Interface Includes
              _SyncedCommanderInterface
             ) {
        return declare("moduleCoopilotMenuInterfaceMenuBar", [_WidgetBase, _TemplatedMixin, _SyncedCommanderInterface], {
            _instanceKey: null,

            templateString: template,
            _mainCssString: mainCss,
            baseClass: "coopilotMenuInterfaceMenuBar",

            _workspacesMenuDiv: null,

            _workspaceMenuWidget: null,
            _workspaceManagerState: null,
            _workspaceStateList: null,

            //##########################################################################################################
            //Startup Functions Section
            //##########################################################################################################

            constructor: function (args) {
                declare.safeMixin(this, args);

                this._workspaceMenuWidget = new workspaceMenu();
                this._workspaceManagerState = null;
                this._workspaceStateList =  null;

                domConstruct.place(domConstruct.toDom("<style>" + this._mainCssString + "</style>"), win.body());

                console.log("menu", "menuCommands", this._menuInstanceCommands);

            },

            postCreate: function () {
                let timeout;

                dijitViewPort.on( 'resize', lang.hitch(this, function(event){
                    clearTimeout(timeout);
                    timeout = setTimeout(lang.hitch(this, this._onViewportResize), 500)
                }));

                topic.publish("addToMainContentLayerAlwaysOnTop", this.domNode);
                topic.publish("addToMainContentLayerAlwaysOnTop",  this._workspaceMenuWidget.domNode );

                this.checkForWorkspaceStates();

            },

            startup: function()
            {
                console.log("menu","startup MenuBar",this,  this.domNode);
            },

            checkForWorkspaceStates: function() {
                if (this._workspaceManagerState === null){

                    this._workspaceManagerState = this._workspaceMenuWidget.getWorkspaceManagerState();
                    this._workspaceManagerStateWatchHandle = this._workspaceManagerState.watch(lang.hitch(this, this.onWorkspaceManagerStateChange));

                }

                if (this._workspaceStateList === null){
                    this._workspaceStateList = this._workspaceMenuWidget.getWorkspacesStateList();
                    this._workspaceManagerStateListWatchHandle = this._workspaceStateList.watch(lang.hitch(this, this.onWorkspaceManagerStateChange));

                    this.updateWorkspaceNameDiv();
                }

            },
            //##########################################################################################################
            //Event Functions Section
            //##########################################################################################################

            updateWorkspaceNameDiv: function()
            {
                if(this._workspaceManagerState !== null && this._workspaceStateList !== null )
                {
                    let activeWorkspaceKey = this._workspaceManagerState.get("activeWorkspace");
                    if (activeWorkspaceKey){
                        let activeWorkspaceInfo = this._workspaceStateList.get(activeWorkspaceKey);
                       this._workspacesMenuDiv.innerHTML = activeWorkspaceInfo.workspaceName +" - ❖" ;
                    }
                }else {
                    this.checkForWorkspaceStates();
                }
            },
            onWorkspaceManagerStateChange: function(name, oldState, newState){
                console.log("workspaceMenu", name, oldState, newState);

                    this.updateWorkspaceNameDiv();

            },

            onInterfaceStateChange: function (name, oldState, newState) {
                this.inherited(arguments);     //this has to be done so remoteMenu works
                if (name === "Status" && newState === "Ready") {
                   // console.log("Instance Status:", newState);
                }
            },

            _onFocus: function(event){

            },

            _onBlur: function(event){

            },

            _onInfoClicked: function(event){
              alert("No Info Yet")
            },
            _onScansClicked: function(event){
                topic.publish("saleTagScanToggleShowMainInterface")
            },
            _onImportClicked: function(eventObject){

                topic.publish("newImporter", function(returnResult)
                {
                    console.log("newImporter", returnResult)
                })

            },
            _onLoadModuleButtonClicked: function(clickEvent){
                console.log("New Command clicked");

                let getModuleName = new getUserInput({question: "Module Name",
                    inputReplyCallback: lang.hitch(this, function(loadModuleName){
                        console.log("Requesting Module ", loadModuleName);

                        //topic.publish("createNewCoopilotCommand", newCommandName);
                        //this could be something the menu handles
                        let moduleID = loadModuleName;
                        topic.publish("isModuleLoaded", moduleID, function (moduleIsLoaded) {

                            topic.publish("getAvailableModulesState", lang.hitch(this, function (availableModulesStore) {
                               console.log("getAvailableModulesState", availableModulesStore);
                            }));

                            console.log("isModuleLoaded ", moduleIsLoaded);
                            if (moduleIsLoaded) {
                                moduleIsLoaded.toggleShowView();
                            } else {
                                topic.publish("requestModuleLoad", moduleID);
                            }
                        });

                        getModuleName.unload();
                    }) });

            },
            _onWorkspacesClicked: function(event){
                console.log("Workspaces Clicked");
                this.checkForWorkspaceStates();
                this._workspaceMenuWidget.toggleShowView();

            },
            _onViewportResize: function(resizeEvent)
            {
                console.log("resized event", resizeEvent);
            },
            //##########################################################################################################
            //UI Functions Section
            //##########################################################################################################

            //##########################################################################################################
            //Interface Functions Section
            //##########################################################################################################
            unload: function () {
                this.inherited(arguments);

                this._workspaceManagerStateListWatchHandle.unwatch();
                this._workspaceManagerStateListWatchHandle.unload();

                this._workspaceManagerStateWatchHandle.unwatch();
                this._workspaceManagerStateWatchHandle.unload();

                this.destroy();
            }
        });
    });