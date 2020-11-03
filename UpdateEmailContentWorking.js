// JavaScript source code
// the following code is working because earlier in UpdateEmailContent.js my second call were out side of first call
//so when the first request is still in progress my second call was trying to run and activity id was null so this time i made the
//call from the first request itself 
function toAccessMailContent(executionContext) {

    var formContext = executionContext.getFormContext();

    var caseID = formContext.getAttribute("ticketnumber").getValue();

    var CaseGuid = Xrm.Page.data.entity.getId();

    if (CaseGuid) {

        CaseGuid = CaseGuid.replace("{", "").replace("}", "");

    }

    var emailActivityId = null;

    Xrm.WebApi.online.retrieveMultipleRecords("email", "?$select=activityid&$filter=_regardingobjectid_value eq " + CaseGuid + "").then(

        function success(results) {

            for (var i = 0; i < results.entities.length; i++) {

                if (results.entities.length > 0) {

                    emailActivityId = results.entities[i]["activityid"];

                    var entity = {};

                    entity.subject = "Case Record Created" + " " + caseID + " " + "Updated from Javascript";

                    entity.cts_source = "Created from OOB Workflow + Updated from Java script";

                    Xrm.WebApi.online.updateRecord("email", emailActivityId, entity).then(

                        function success(result) {

                            var updatedEntityId = result.id;

                            console.log(updatedEntityId);

                        },

                        function (error) {

                            Xrm.Utility.alertDialog(error.message);

                        }

                    );

                }

                else {

                    console.log("no value");

                }

            }

        },

        function (error) {

            Xrm.Utility.alertDialog(error.message);

        }

    );

}


