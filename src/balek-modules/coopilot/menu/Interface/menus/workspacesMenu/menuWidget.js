define(['dojo/_base/declare',
        'dojo/_base/lang',

        'dojo/dom-construct',
        "dojo/_base/window",
        'dojo/on',
        "dojo/dom-class",
        "dojo/dom-attr",
        "dojo/dom-style",
        "dojo/keys",
        "dijit/focus",
        "dojo/ready",
        'dojo/_base/fx',

        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",

        'dojo/text!balek-modules/coopilot/menu/Interface/menus/workspacesMenu/resources/html/menuWidget.html',
        'dojo/text!balek-modules/coopilot/menu/Interface/menus/workspacesMenu/resources/css/menuWidget.css',

        "balek-modules/coopilot/menu/Interface/menus/workspacesMenu/workspacesMenu",
        //Coopilot ui components
        "balek-modules/coopilot/ui/input/getUserInput",

        'balek-modules/Interface'
    ],
    function (declare, lang,
              domConstruct, win, on, domClass, domAttr, domStyle, dojoKeys,
              dijitFocus, dojoReady, fx,  _WidgetBase, _TemplatedMixin, template,
              mainCss, workspacesMenu, getUserInput,
              baseInterface) {

        return declare("coopilotMenuInterfaceWorkspacesMenuMenuWidget", [_WidgetBase, _TemplatedMixin, workspacesMenu, baseInterface], {

            templateString: template,
            baseClass: "coopilotMenuInterfaceWorkspacesMenuMenuWidget",

            _workspaceManagerState: null,
            _availableWorkspacesState: null,

            _mainCssString: mainCss,

            //##########################################################################################################
            //Startup Functions Section
            //##########################################################################################################

            constructor: function (args) {

                console.log("menu", "on workspaces main widget constructor", this.baseClass);
                domConstruct.place(domConstruct.toDom("<style>" + mainCss + "</style>"), win.body());

            },
            postCreate: function()
            {
                console.log("menu", "on workspaces main widget post create", this.domNode);
                this.loadAndWatchWorkspaces();
            },
            startup: function(){
                console.log("menu", "workspacesMenu", "Startup called");
            },

            getWorkspaceManagerState: function()
            {
               return this._workspaceManagerState;
            },
            getWorkspacesStateList: function(){
                return this._availableWorkspacesState;
            },
            //##########################################################################################################
            //Event Functions Section
            //##########################################################################################################

            _onClick: function(){
                console.log("Coopilot Menu Workspace Menu Menu Widget clicked");
            },

            onWorkspaceMenuClick: function (workspaceKey, changeActiveWorkspace, event) {
                event.stopPropagation();
                this.hide();
                console.log(event);
                if(event.altKey){
                    let getNameForWorkspace = new getUserInput({question: "Choose a Workspace Name", inputReplyCallback: lang.hitch(this, function(newWorkspaceName){
                            console.log("Requesting new workspace name", newWorkspaceName, this.workspaceManagerCommands);
                            this.workspaceManagerCommands.changeWorkspaceName(workspaceKey, newWorkspaceName, function(result){
                                console.log("workspaceManagerCommands.changeWorkspaceName", "Workspace name changed", result);
                            });
                            getNameForWorkspace.unload();
                        }) });
                }else
                {
                    changeActiveWorkspace(workspaceKey, function(result){
                        console.log("changeActiveWorkspace", result);
                    });
                }

            },
            onAddWorkspaceClicked: function (event){
                console.log(event);
                let getNameForWorkspace = new getUserInput({question: "Choose a Workspace Name", inputReplyCallback: lang.hitch(this, function(newWorkspaceName){
                        console.log("Requesting new Workspace", newWorkspaceName, this.workspaceManagerCommands);
                        this.workspaceManagerCommands.requestNewWorkspace(newWorkspaceName).then(function(result){
                            console.log("New Workspace created", result);
                        }).catch(function(errorResult){
                            alert(errorResult);
                        });
                        getNameForWorkspace.unload();
                    }) });

            },
            //##########################################################################################################
            //UI Functions Section
            //##########################################################################################################
            refreshWidget: function(){
                if(this.domNode){
                    this.domNode.innerHTML = "";

                    let activeWorkspace = this._workspaceManagerState.get("activeWorkspace");

                    let newWorkspaceButton = domConstruct.create("div");
                    newWorkspaceButton.innerHTML = "➕ New Workspace"
                    domClass.add(newWorkspaceButton, "coopilotMenuInterfaceWorkspacesMenuNewWorkspaceDiv");

                    on(newWorkspaceButton, 'click', lang.hitch(this, function (evt) {
                        evt.stopPropagation();
                        this.onAddWorkspaceClicked();
                    }));

                    domConstruct.place(newWorkspaceButton, this.domNode);
                    let lastPlacedDiv = null;
                    for( const workspaceKey in this._workspaceMenuWidgets )
                    {
                        if(workspaceKey !== activeWorkspace)
                        {
                            let workspaceState = this._workspaceMenuWidgets[workspaceKey];

                            let newWorkspaceInfo = domConstruct.create("div");

                            newWorkspaceInfo.innerHTML = "❖ - " + workspaceState.workspaceName;
                            domClass.add(newWorkspaceInfo, "coopilotMenuInterfaceWorkspacesMenuMenuWidgetWorkspaceNameDiv");
                            on(newWorkspaceInfo, 'click', lang.hitch(this, this.onWorkspaceMenuClick , workspaceKey,  this.workspaceManagerCommands.changeActiveWorkspace));

                            domConstruct.place(newWorkspaceInfo, this.domNode);
                            lastPlacedDiv = newWorkspaceInfo;
                        }
                    }
                    if(lastPlacedDiv != null)
                    {
                        domStyle.set(lastPlacedDiv, {"border": "none"});
                    }
                }
            },

            toggleShowView: function(){
                let currentStateToggle = {"block": "none", "none": "block"};
                domStyle.set(this.domNode, {"z-index": 70000});
                domStyle.set(this.domNode, {"display": currentStateToggle[domStyle.get(this.domNode, "display")]});

            },
            hide(){
                domStyle.set(this.domNode, {"display": "none"});
            },
            //##########################################################################################################
            //Interface Functions Section
            //##########################################################################################################

            unload: function () {
                console.log("Destroying menu");
                this.inherited(arguments);
                this.destroy();
            }

        });
    });