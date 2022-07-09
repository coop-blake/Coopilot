//Navigator Interface Workspaces Menu Class
define([
        //Dojo Includes
        'dojo/_base/declare',
        "dojo/_base/lang",
        'dojo/dom-class',
        "dojo/dom-style",
        'dojo/dom-construct',
        'dojo/on',
        //Balek Includes
        'balek-client/session/workspace/workspaceManagerInterfaceCommands',
    ],
    function (
              //Dojo Includes
              declare,
              lang,
              domClass,
              domStyle,
              domConstruct,
              on,
              //Balek Includes
              balekWorkspaceManagerInterfaceCommands ) {

        return declare( "coopilotMenuInterfaceWorkspacesMenu",null, {
             _actions: null,

            _workspaceMenuWidgets:null,

            workspaceManagerCommands: null,

            _availableWorkspacesState: null,
            _availableWorkspacesStateWatchHandle: null,
            _workspaceManagerState: null,
            _workspaceManagerStateWatchHandle: null,

            constructor: function (args) {
                declare.safeMixin(this, args);

                this._workspaceMenuWidgets = {};
                console.log("Initializing Coopilot Menu Interface Workspaces Menu...");

                let workspaceManagerInterfaceCommands = new balekWorkspaceManagerInterfaceCommands();
                this.workspaceManagerCommands = workspaceManagerInterfaceCommands.getCommands();

                this._availableWorkspacesState = this.workspaceManagerCommands.getAvailableWorkspacesState();
                this._workspaceManagerState = this.workspaceManagerCommands.getWorkspaceManagerState();
            },
            onAvailableWorkspacesStateChange: function(name, oldState, newState){
                console.log("menu", name, oldState, newState);
                //let workspaceName = newState.workspaceName;
                let workspaceKey = name.toString();
                if(this._workspaceMenuWidgets[workspaceKey] === undefined){
                    this._workspaceMenuWidgets[workspaceKey] = newState;
                }else
                {
                    this._workspaceMenuWidgets[workspaceKey] = newState;
                }

                this.refreshWidget();
            },
            onWorkspaceManagerStateChange: function(name, oldState, newState){
                this.refreshWidget();
            },
            loadAndWatchWorkspaces: function(){
                let availableWorkspacesInState = JSON.parse(JSON.stringify(this._availableWorkspacesState));
                this._availableWorkspacesStateWatchHandle = this._availableWorkspacesState.watch(lang.hitch(this, this.onAvailableWorkspacesStateChange));

                this._workspaceManagerStateWatchHandle = this._workspaceManagerState.watch(lang.hitch(this, this.onWorkspaceManagerStateChange));

                for (const name in availableWorkspacesInState)
                {
                    console.log("menu", name, availableWorkspacesInState[name]);
                    this._workspaceMenuWidgets[name.toString()] =  availableWorkspacesInState[name];
                }

                this.refreshWidget();
            },
            isActiveWorkspace: function(workspaceKey){
                 let activeWorkspace = this._workspaceManagerState.get("activeWorkspace");
                 console.log("activeWorkspace", activeWorkspace);
                 if(activeWorkspace === workspaceKey){
                     return true;
                 }
                 else{
                     return false;
                 }
            },
            toggleShowView: function(){
                let currentStateToggle = {"inline-block": "none", "none": "inline-block"};
                domStyle.set(this.domNode, {"display": currentStateToggle[domStyle.get(this.domNode, "display")]});
            },
            refreshWidget: function(){

            },
            unload: function(){
                this._availableWorkspacesStateWatchHandle.unwatch();
                this._availableWorkspacesStateWatchHandle.remove();
                this._workspaceManagerStateWatchHandle.unwatch();
                this._workspaceManagerStateWatchHandle.remove();
            }

        });
    });