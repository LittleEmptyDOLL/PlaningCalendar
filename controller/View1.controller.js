sap.ui.define([
	'sap/m/Label',
	'sap/m/Popover',
	'sap/ui/core/library',
	'sap/ui/core/format/DateFormat',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
    'sap/base/Log',
    'sap/m/MessageToast'
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Label, Popover, coreLibrary, DateFormat, Fragment, Controller, JSONModel, Log, MessageToast) {
		"use strict";

        var ValueState = coreLibrary.ValueState;

		return Controller.extend("sap.btp.sapui5.controller.View1", {
			onInit: function () {
                var oModel = new JSONModel();
                oModel.setData({
                    startDate: new Date("2021", "07", "02", "8", "0"),
                    people: [{
                        name: "Андрей",
                        role: "разработчик",
                        freeDays: [0, 6],
						freeHours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23],
                        appointments: [
                            {
                                start: new Date("2021", "07", "2", "09", "0"),
                                end: new Date("2021", "07", "2", "09", "30"),
                                title: "Собрание",
                                info: "Приложение Teams",                               
                                type: "Type01",
                                tentative: false
                            },
                            {
                                start: new Date("2021", "07", "2", "09", "30"),
                                end: new Date("2021", "07", "4", "15", "0"),
                                title: "Разработка приложения SAPUI5",
                                info: "Планировщик задач",
                                type: "Type01",
                                tentative: false
                            },
                            {
                                start: new Date("2021", "07", "5", "09", "30"),
                                end: new Date("2021", "07", "8", "13", "0"),
                                title: "Разработка бота",
                                info: "RPA Bot",
                                type: "Type01",
                                tentative: false
                            }


                        ]

                    },
                    {
                        name: "Евгения",
                        role: "постановщик",
                        freeDays: [0, 6],
						freeHours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23],
                        appointments: [
                            {
                                start: new Date("2021", "07", "2", "09", "0"),
                                end: new Date("2021", "07", "2", "09", "30"),
                                title: "Собрание",
                                info: "Приложение Teams",                               
                                type: "Type01",
                                tentative: false
                            },
                            {
                                start: new Date("2021", "07", "2", "10", "0"),
                                end: new Date("2021", "07", "2", "15", "10"),
                                title: "Написание постановки",
                                info: "Разработка отчёта для бизнеса",
                                type: "Type01",
                                tentative: false
                            },
                            {
                                start: new Date("2021", "07", "11", "10", "0"),
                                end: new Date("2021", "07", "11", "17", "10"),
                                title: "Совещание с бизнесом",
                                info: "Кабинет 102",
                                type: "Type01",
                                tentative: false
                            }
                        ]

                    },
                    {
                        name: "Олег",
                        role: "руководитель",
                        freeDays: [0, 6],
						freeHours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23],
                        appointments: [
                            {
                                start: new Date("2021", "07", "2", "09", "0"),
                                end: new Date("2021", "07", "2", "09", "30"),
                                title: "Собрание",
                                info: "Приложение Teams",                               
                                type: "Type01",
                                tentative: false
                            },

                            {
                                start: new Date("2021", "07", "2", "11", "0"),
                                end: new Date("2021", "07", "2", "18", "0"),
                                title: "Встреча",
                                info: "руководство компании",
                                type: "Type01",
                                tentative: false
                            }
                        ]

                    }
                    ]
                });
                this.getView().setModel(oModel);
            },

        _aDialogTypes: [
				{ title: "Создать задачу", type: "create_appointment" },
				{ title: "Создать задачу", type: "create_appointment_with_context"},
                { title: "Редактировать задачу", type: "edit_appointment" }],
        
        handleAppointmentSelect: function (oEvent) {
				var oAppointment = oEvent.getParameter("appointment");

				if (oAppointment) {
					this._handleSingleAppointment(oAppointment);
				} else {
					this._handleGroupAppointments(oEvent);
				}
			},

			_addNewAppointment: function(oAppointment){
				var oModel = this.getView().getModel(),
					sPath = "/people/" + this.byId("selectPerson").getSelectedIndex().toString(),
					oPersonAppointments;

				if (this.byId("isIntervalAppointment").getSelected()){
					sPath += "/headers";
				} else {
					sPath += "/appointments";
				}

				oPersonAppointments = oModel.getProperty(sPath);

				oPersonAppointments.push(oAppointment);

				oModel.setProperty(sPath, oPersonAppointments);
			},

			handleCancelButton: function () {
				this.byId("detailsPopover").close();
			},

			handleAppointmentCreate: function () {
				this._arrangeDialogFragment(this._aDialogTypes[0].type);
			},

			handleAppointmentAddWithContext: function (oEvent) {
				this.oClickEventParameters = oEvent.getParameters();
				this._arrangeDialogFragment(this._aDialogTypes[1].type);
			},

			_validateDateTimePicker: function (oDateTimePickerStart, oDateTimePickerEnd) {
				var oStartDate = oDateTimePickerStart.getDateValue(),
					oEndDate = oDateTimePickerEnd.getDateValue(),
					sValueStateText = "Дата начала должна быть раньше даты окончания";

				if (oStartDate && oEndDate && oEndDate.getTime() <= oStartDate.getTime()) {
					oDateTimePickerStart.setValueState(ValueState.Error);
					oDateTimePickerEnd.setValueState(ValueState.Error);
					oDateTimePickerStart.setValueStateText(sValueStateText);
					oDateTimePickerEnd.setValueStateText(sValueStateText);
				} else {
					oDateTimePickerStart.setValueState(ValueState.None);
					oDateTimePickerEnd.setValueState(ValueState.None);
				}
			},

			updateButtonEnabledState: function (oDialog) {
				var oStartDate = this.byId("startDate"),
					oEndDate = this.byId("endDate"),
					bEnabled = oStartDate.getValueState() !== ValueState.Error
					&& oStartDate.getValue() !== ""
					&& oEndDate.getValue() !== ""
					&& oEndDate.getValueState() !== ValueState.Error;

					oDialog.getBeginButton().setEnabled(bEnabled);
			},

			handleCreateChange: function (oEvent) {
				var oDateTimePickerStart = this.byId("startDate"),
					oDateTimePickerEnd = this.byId("endDate");

				if (oEvent.getParameter("valid")) {
					this._validateDateTimePicker(oDateTimePickerStart, oDateTimePickerEnd);
				} else {
					oEvent.getSource().setValueState(ValueState.Error);
				}

				this.updateButtonEnabledState(this.byId("createDialog"));
			},

			_removeAppointment: function(oAppointment, sPersonId){
				var oModel = this.getView().getModel(),
					sTempPath,
					aPersonAppointments,
					iIndexForRemoval;

				if (!sPersonId){
					sTempPath = this.sPath.slice(0,this.sPath.indexOf("appointments/") + "appointments/".length);
				} else {
					sTempPath = "/people/" + sPersonId + "/appointments";
				}

				aPersonAppointments = oModel.getProperty(sTempPath);
				iIndexForRemoval = aPersonAppointments.indexOf(oAppointment);

				if (iIndexForRemoval !== -1){
					aPersonAppointments.splice(iIndexForRemoval, 1);
				}

				oModel.setProperty(sTempPath, aPersonAppointments);
			},

			handleDeleteAppointment: function(){
				var oDetailsPopover = this.byId("detailsPopover"),
					oBindingContext = oDetailsPopover.getBindingContext(),
					oAppointment = oBindingContext.getObject(),
					iPersonIdStartIndex = oBindingContext.getPath().indexOf("/people/") + "/people/".length,
					iPersonId = oBindingContext.getPath()[iPersonIdStartIndex];

				this._removeAppointment(oAppointment, iPersonId);
				oDetailsPopover.close();
			},

			handleEditButton: function(){
				var oDetailsPopover = this.byId("detailsPopover");
				this.sPath = oDetailsPopover.getBindingContext().getPath();
				oDetailsPopover.close();
				this._arrangeDialogFragment(this._aDialogTypes[2].type);

			},

			_arrangeDialogFragment: function (iDialogType) {
				var oView = this.getView();

				if (!this._pNewAppointmentDialog) {
					this._pNewAppointmentDialog = Fragment.load({
						id: oView.getId(),
						name: "sap.btp.sapui5.Create",
						controller: this
					}).then(function(oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pNewAppointmentDialog.then(function(oDialog) {
					this._arrangeDialog(iDialogType, oDialog);
				}.bind(this));
			},

			_arrangeDialog: function(sDialogType, oDialog) {
				var sTempTitle = "";
				oDialog._sDialogType = sDialogType;
				if (sDialogType === "edit_appointment"){
					this._setEditAppointmentDialogContent(oDialog);
					sTempTitle = this._aDialogTypes[2].title;
				} else if (sDialogType === "create_appointment_with_context"){
					this._setCreateWithContextAppointmentDialogContent();
					sTempTitle = this._aDialogTypes[1].title;
				} else if (sDialogType === "create_appointment"){
					this._setCreateAppointmentDialogContent();
					sTempTitle = this._aDialogTypes[0].title;
				} else {
					Log.error("Неправильный тип диалога.");
				}

				this.updateButtonEnabledState(oDialog);
				oDialog.setTitle(sTempTitle);
				oDialog.open();
			},

			handleAppointmentTypeChange: function(oEvent){
				var oAppointmentType = this.byId("isIntervalAppointment");

				oAppointmentType.setSelected(oEvent.getSource().getSelected());
			},

			handleDialogCancelButton: function(){
				this.byId("createDialog").close();
			},

			_editAppointment: function(oAppointment, bIsIntervalAppointment, iPersonId, oNewAppointmentDialog){
				var sAppointmentPath = this._appointmentOwnerChange(oNewAppointmentDialog),
					oModel = this.getView().getModel();

				if (bIsIntervalAppointment) {
					this._convertToHeader(oAppointment, iPersonId, oNewAppointmentDialog);
				} else {
					if (this.sPath !== sAppointmentPath) {
						this._addNewAppointment(oNewAppointmentDialog.getModel().getProperty(this.sPath));
						this._removeAppointment(oNewAppointmentDialog.getModel().getProperty(this.sPath));
					}
					oModel.setProperty(sAppointmentPath + "/title", oAppointment.title);
					oModel.setProperty(sAppointmentPath + "/info", oAppointment.info);
					oModel.setProperty(sAppointmentPath + "/type", oAppointment.type);
					oModel.setProperty(sAppointmentPath + "/start", oAppointment.start);
					oModel.setProperty(sAppointmentPath + "/end", oAppointment.end);
				}
			},

			_convertToHeader: function(oAppointment, oNewAppointmentDialog){
				var sPersonId = this.byId("selectPerson").getSelectedIndex().toString();

				this._removeAppointment(oNewAppointmentDialog.getModel().getProperty(this.sPath), sPersonId);
				this._addNewAppointment({start: oAppointment.start, end: oAppointment.end, title: oAppointment.title, type: oAppointment.type});
			},

			handleDialogSaveButton: function(){
				var oStartDate = this.byId("startDate"),
					oEndDate = this.byId("endDate"),
					sInfoValue = this.byId("moreInfo").getValue(),
					sInputTitle = this.byId("inputTitle").getValue(),
					iPersonId = this.byId("selectPerson").getSelectedIndex(),
					oModel = this.getView().getModel(),
					bIsIntervalAppointment = this.byId("isIntervalAppointment").getSelected(),
					oNewAppointmentDialog = this.byId("createDialog"),
					oNewAppointment;

					if (oStartDate.getValueState() !== ValueState.Error
					&& oEndDate.getValueState() !== ValueState.Error){
						if (this.sPath && oNewAppointmentDialog._sDialogType === "edit_appointment") {
							this._editAppointment({
								title: sInputTitle,
								info: sInfoValue,
								type: this.byId("detailsPopover").getBindingContext().getObject().type,
								start: oStartDate.getDateValue(),
								end: oEndDate.getDateValue()}, bIsIntervalAppointment, iPersonId, oNewAppointmentDialog);
						} else {
							if (bIsIntervalAppointment) {
								oNewAppointment = {
									title: sInputTitle,
									start: oStartDate.getDateValue(),
									end: oEndDate.getDateValue()
								};
							} else {
								oNewAppointment = {
									title: sInputTitle,
									info: sInfoValue,
									start: oStartDate.getDateValue(),
									end: oEndDate.getDateValue()
								};
							}
							this._addNewAppointment(oNewAppointment);
					}

					oModel.updateBindings();

					oNewAppointmentDialog.close();
				}
			},

			_appointmentOwnerChange: function(oNewAppointmentDialog){
				var iSpathPersonId = this.sPath[this.sPath.indexOf("/people/") + "/people/".length],
					iSelectedPerson = this.byId("selectPerson").getSelectedIndex(),
					sTempPath = this.sPath,
					iLastElementIndex = oNewAppointmentDialog.getModel().getProperty("/people/" + iSelectedPerson.toString() + "/appointments/").length.toString();

				if (iSpathPersonId !== iSelectedPerson.toString()){
					sTempPath = "".concat("/people/", iSelectedPerson.toString(), "/appointments/", iLastElementIndex.toString());
				}

				return sTempPath;
			},

			_setCreateAppointmentDialogContent: function(){
				var oAppointmentType = this.byId("isIntervalAppointment"),
					oDateTimePickerStart = this.byId("startDate"),
					oDateTimePickerEnd =  this.byId("endDate"),
					oTitleInput = this.byId("inputTitle"),
					oMoreInfoInput = this.byId("moreInfo"),
					oPersonSelected = this.byId("selectPerson");

				//Set the person in the first row as selected.
				oPersonSelected.setSelectedItem(this.byId("selectPerson").getItems()[0]);
				oDateTimePickerStart.setValue("");
				oDateTimePickerEnd.setValue("");
				oDateTimePickerStart.setValueState(ValueState.None);
				oDateTimePickerEnd.setValueState(ValueState.None);
				oTitleInput.setValue("");
				oMoreInfoInput.setValue("");
				oAppointmentType.setSelected(false);
			},

			_setCreateWithContextAppointmentDialogContent: function(){
				var aPeople = this.getView().getModel().getProperty('/people/'),
					oSelectedIntervalStart = this.oClickEventParameters.startDate,
					oStartDate = this.byId("startDate"),
					oSelectedIntervalEnd = this.oClickEventParameters.endDate,
					oEndDate = this.byId("endDate"),
					oDateTimePickerStart = this.byId("startDate"),
					oDateTimePickerEnd =  this.byId("endDate"),
					oAppointmentType = this.byId("isIntervalAppointment"),
					oTitleInput = this.byId("inputTitle"),
					oMoreInfoInput = this.byId("moreInfo"),
					sPersonName,
					oPersonSelected;

				if (this.oClickEventParameters.row){
					sPersonName = this.oClickEventParameters.row.getTitle();
					oPersonSelected = this.byId("selectPerson");

					oPersonSelected.setSelectedIndex(aPeople.indexOf(aPeople.filter(function(oPerson){return  oPerson.name === sPersonName;})[0]));

				}

				oStartDate.setDateValue(oSelectedIntervalStart);

				oEndDate.setDateValue(oSelectedIntervalEnd);

				oTitleInput.setValue("");

				oMoreInfoInput.setValue("");

				oAppointmentType.setSelected(false);

				oDateTimePickerStart.setValueState(ValueState.None);
				oDateTimePickerEnd.setValueState(ValueState.None);

				delete this.oClickEventParameters;
			},

			_setEditAppointmentDialogContent: function(oDialog){
				var oAppointment = oDialog.getModel().getProperty(this.sPath),
					oSelectedIntervalStart = oAppointment.start,
					oSelectedIntervalEnd = oAppointment.end,
					oDateTimePickerStart = this.byId("startDate"),
					oDateTimePickerEnd = this.byId("endDate"),
					sSelectedInfo = oAppointment.info,
					sSelectedTitle = oAppointment.title,
					iSelectedPersonId = this.sPath[this.sPath.indexOf("/people/") + "/people/".length],
					oPersonSelected = this.byId("selectPerson"),
					oStartDate = this.byId("startDate"),
					oEndDate = this.byId("endDate"),
					oMoreInfoInput = this.byId("moreInfo"),
					oTitleInput = this.byId("inputTitle"),
					oAppointmentType = this.byId("isIntervalAppointment");

				oPersonSelected.setSelectedIndex(iSelectedPersonId);

				oStartDate.setDateValue(oSelectedIntervalStart);

				oEndDate.setDateValue(oSelectedIntervalEnd);

				oMoreInfoInput.setValue(sSelectedInfo);

				oTitleInput.setValue(sSelectedTitle);

				oDateTimePickerStart.setValueState(ValueState.None);
				oDateTimePickerEnd.setValueState(ValueState.None);

				oAppointmentType.setSelected(false);
			},

			_handleSingleAppointment: function (oAppointment) {
				var oView = this.getView();
				if (oAppointment === undefined) {
					return;
				}

				if (!oAppointment.getSelected() && this._pDetailsPopover) {
					this._pDetailsPopover.then(function(oDetailsPopover){
						oDetailsPopover.close();
					});
					return;
				}

				if (!this._pDetailsPopover) {
					this._pDetailsPopover = Fragment.load({
						id: oView.getId(),
						name: "sap.btp.sapui5.Details",
						controller: this
					}).then(function(oDetailsPopover){
						oView.addDependent(oDetailsPopover);
						return oDetailsPopover;
					});
				}

				this._pDetailsPopover.then(function(oDetailsPopover){
					this._setDetailsDialogContent(oAppointment, oDetailsPopover);
				}.bind(this));
			},

			_setDetailsDialogContent: function(oAppointment, oDetailsPopover){
				oDetailsPopover.setBindingContext(oAppointment.getBindingContext());
				oDetailsPopover.openBy(oAppointment);
			},

			formatDate: function (oDate) {
				if (oDate) {
					var iHours = oDate.getHours(),
						iMinutes = oDate.getMinutes(),
						iSeconds = oDate.getSeconds();

					if (iHours !== 0 || iMinutes !== 0 || iSeconds !== 0) {
						return DateFormat.getDateTimeInstance({ style: "medium" }).format(oDate);
					} else  {
						return DateFormat.getDateInstance({ style: "medium" }).format(oDate);
					}
				}
			},

			_handleGroupAppointments: function (oEvent) {
				var aAppointments,
					sGroupAppointmentType,
					sGroupPopoverValue,
					sGroupAppDomRefId,
					bTypeDiffer;

				aAppointments = oEvent.getParameter("appointments");
				sGroupAppointmentType = aAppointments[0].getType();
				sGroupAppDomRefId = oEvent.getParameter("domRefId");
				bTypeDiffer = aAppointments.some(function (oAppointment) {
					return sGroupAppointmentType !== oAppointment.getType();
				});

				if (bTypeDiffer) {
					sGroupPopoverValue = aAppointments.length + " Appointments of different types selected";
				} else {
					sGroupPopoverValue = aAppointments.length + " Appointments of the same " + sGroupAppointmentType + " selected";
				}

				if (!this._oGroupPopover) {
					this._oGroupPopover = new Popover({
						title: "Группы задач",
						content: new Label({
							text: sGroupPopoverValue
						})
					});
				} else {
					this._oGroupPopover.getContent()[0].setText(sGroupPopoverValue);
				}
				this._oGroupPopover.addStyleClass("sapUiContentPadding");
				this._oGroupPopover.openBy(document.getElementById(sGroupAppDomRefId));
            },
            







            roles: {
				manager: "manager",
				admin: "admin"
			},

			handleRoleChange: function () {
				this.getView().getModel().refresh(true);
			},

			getUserRole: function() {
				return this.roles[this.byId("userRole").getSelectedKey()];
			},

			canModifyAppointments: function(sRole) {
				var sUserRole = this.getUserRole();

				if (sUserRole === this.roles.manager || sUserRole === this.roles.admin || sUserRole === sRole) {
					return true;
				}
			},

			handleAppointmentDragEnter: function(oEvent) {
				if (this.isAppointmentOverlap(oEvent, oEvent.getParameter("calendarRow"))) {
					oEvent.preventDefault();
				}
			},

			handleAppointmentDrop: function (oEvent) {
				var oAppointment = oEvent.getParameter("appointment"),
					oStartDate = oEvent.getParameter("startDate"),
					oEndDate = oEvent.getParameter("endDate"),
					oCalendarRow = oEvent.getParameter("calendarRow"),
					bCopy = oEvent.getParameter("copy"),
					sTitle = oAppointment.getTitle(),
					oModel = this.getView().getModel(),
					oAppBindingContext = oAppointment.getBindingContext(),
					oRowBindingContext = oCalendarRow.getBindingContext(),
					handleAppointmentDropBetweenRows = function () {
						var aPath = oAppBindingContext.getPath().split("/"),
							iIndex = aPath.pop(),
							sRowAppointmentsPath = aPath.join("/");

						oRowBindingContext.getObject().appointments.push(
							oModel.getProperty(oAppBindingContext.getPath())
						);

						oModel.getProperty(sRowAppointmentsPath).splice(iIndex, 1);
					};

				if (bCopy) { // "copy" appointment
					var oProps = Object.assign({}, oModel.getProperty(oAppointment.getBindingContext().getPath()));
					oProps.start = oStartDate;
					oProps.end = oEndDate;

					oRowBindingContext.getObject().appointments.push(oProps);
				} else { // "move" appointment
					oModel.setProperty("start", oStartDate, oAppBindingContext);
					oModel.setProperty("end", oEndDate, oAppBindingContext);

					if (oAppointment.getParent() !== oCalendarRow) {
						handleAppointmentDropBetweenRows();
					}
				}

				oModel.refresh(true);

				MessageToast.show("Задача '" + sTitle + "' назначеная на " + oCalendarRow.getTitle() + " теперь начинается в \n" + oStartDate + "\n и заканчивается в \n" + oEndDate + ".");
			},

			handleAppointmentResize: function (oEvent) {
				var oAppointment = oEvent.getParameter("appointment"),
					oStartDate = oEvent.getParameter("startDate"),
					oEndDate = oEvent.getParameter("endDate");

				if (!this.isAppointmentOverlap(oEvent, oAppointment.getParent())) {
					MessageToast.show("Задача '" + oAppointment.getTitle() + "' теперь начинается в \n" + oStartDate + "\n и заканчивается в \n" + oEndDate + ".");

					oAppointment
						.setStartDate(oStartDate)
						.setEndDate(oEndDate);
				} else {
					MessageToast.show("Как менеджер, вы не можете изменять размер событий, если они перекрываются с другими событиями.");
				}
			},

			handleAppointmentCreate1: function (oEvent) {
				var oStartDate = oEvent.getParameter("startDate"),
					oEndDate = oEvent.getParameter("endDate"),
					oPlanningCalendarRow = oEvent.getParameter("calendarRow"),
					oModel = this.getView().getModel(),
					sPath = oPlanningCalendarRow.getBindingContext().getPath();

				oModel.getProperty(sPath).appointments.push({
					title: "New Appointment",
					start: oStartDate,
					end: oEndDate
				});

				MessageToast.show("Новая задача задана на \n" + oStartDate + "\n и заканчивается в \n" + oEndDate + ".");

				oModel.refresh(true);
			},

			isAppointmentOverlap: function (oEvent, oCalendarRow) {
				var oAppointment = oEvent.getParameter("appointment"),
					oStartDate = oEvent.getParameter("startDate"),
					oEndDate = oEvent.getParameter("endDate"),
					bAppointmentOverlapped;

				if (this.getUserRole() === this.roles.manager) {
					bAppointmentOverlapped = oCalendarRow.getAppointments().some(function (oCurrentAppointment) {
						if (oCurrentAppointment === oAppointment) {
							return;
						}

						var oAppStartTime = oCurrentAppointment.getStartDate().getTime(),
							oAppEndTime = oCurrentAppointment.getEndDate().getTime();

						if (oAppStartTime <= oStartDate.getTime() && oStartDate.getTime() < oAppEndTime) {
							return true;
						}

						if (oAppStartTime < oEndDate.getTime() && oEndDate.getTime() <= oAppEndTime) {
							return true;
						}

						if (oStartDate.getTime() <= oAppStartTime && oAppStartTime < oEndDate.getTime()) {
							return true;
						}
					});
				}

				return bAppointmentOverlapped;
            },
            










        _aDialogTypes1: [
				{ title: "Добавить сотрудника", type: "create_user" },
                { title: "Редактировать сотрудника", type: "edit_user" }],

			_addNewUser: function(oUser){
				var oModel = this.getView().getModel(),
					sPath = "/people",
					oPersonUsers;

				oPersonUsers = oModel.getProperty(sPath);

				oPersonUsers.push(oUser);

				oModel.setProperty(sPath, oPersonUsers);
			},

			handleUserCreate: function () {
				this._arrangeDialogFragment1(this._aDialogTypes1[0].type);
			},

			_arrangeDialogFragment1: function (iDialogType) {
				var oView = this.getView();

				if (!this._pNewUserDialog) {
					this._pNewUserDialog = Fragment.load({
						id: oView.getId(),
						name: "sap.btp.sapui5.CreateUser",
						controller: this
					}).then(function(oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pNewUserDialog.then(function(oDialog) {
					this._arrangeDialog1(iDialogType, oDialog);
				}.bind(this));
			},

			_arrangeDialog1: function(sDialogType, oDialog) {
				var sTempTitle = "";
				oDialog._sDialogType = sDialogType;
				if (sDialogType === "edit_user"){
					this._setEditUserDialogContent(oDialog);
					sTempTitle = this._aDialogTypes1[1].title;
				} else if (sDialogType === "create_user"){
					this._setCreateUserDialogContent();
					sTempTitle = this._aDialogTypes1[0].title;
				} else {
					Log.error("Неправильный тип диалога.");
				}

				oDialog.setTitle(sTempTitle);
				oDialog.open();
			},

            handleDialogCancelButton1: function(){
				this.byId("createDialog1").close();
			},

			handleDialogSaveButton1: function(){
				var sInputUser = this.byId("InputUser").getValue(),
					sInputRole = this.byId("inputRole").getValue(),
					oModel = this.getView().getModel(),
					oNewUserDialog = this.byId("createDialog1"),
                    oNewUser;

			    	
                    if (sInputUser != "" && sInputRole != ""){
					    oNewUser = {
					    	name: sInputUser,
					    	role: sInputRole,
                            freeDays: [0, 6],
						    freeHours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23],
					    };
                        this._addNewUser(oNewUser);

					    oModel.updateBindings();

                        oNewUserDialog.close();
                    } else {
                        MessageToast.show("Заполните все обязательные поля!");
                    }
			},

			_setCreateUserDialogContent: function(){
				var oInputUser = this.byId("InputUser"),
					oInputRole = this.byId("inputRole");

				oInputUser.setValue("");
				oInputRole.setValue("");
            }
            



		});
	});
