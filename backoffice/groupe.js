var userDatas = [];
var currentGroupUid;

function loadGroups(){
$.ajax({
    type: "GET",
    url: config.url + "/group",
    success: function(data) {
        $("#login-div").css("display", "none");
        $("#logout-div").css("display", "block");
        $("#mainContainer").css("display", "block");
        if (data.length == undefined) {
            appendGroup(data);
            userDatas = [data];
        } else {
            for (var i = 0; i < data.length; i++) {
                appendGroup(data[i]);
            }
            ;
            userDatas = data;
        }
        console.log(data);
        var options = {
            valueNames: ['groupname', 'description']
        };

        var groupList = new List('table-filter-groups', options);
        console.log(groupList);
    },
    crossDomain: true,
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    statusCode: {
        //si jamais camomile renvoie une erreur unauthorised, on balance sur la page de login
        401: function() {
            //alert( "not authorized" );
            $("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
            $("#login-div").css("display", "block");
            $("#logout-div").css("display", "none");
            deleteCookie("pseudo");
        },
        501: function(data) {
            alert("Opération interdite : " + data.responseText);
        },
        404: function(data) {
            alert("Opération non prévue : " + data.responseText);
        }
    }
});
}



function loadUsersGroup(event){
var id = $(event.target).parents("tr").attr("x-uid");
changeListUsersApparence(event);
currentGroupUid = id;
$.ajax({
       type: "GET",
       url: config.url + "/group/"+id,
       success: function(data) { console.log(data);
            $("#login-div").css("display", "none");
            $("#logout-div").css("display", "block");
            $("#usersGroupContainer").css("display", "block");
       $("#users tr").remove();
       groupUsers = data.usersList;
       
            $.ajax({
              type: "GET",
              url: config.url + "/user",
              success: function(userGlobalList) {
              $("#login-div").css("display", "none");
              $("#logout-div").css("display", "block");
              $("#usersGroupContainer").css("display", "block");
                   for (var i = 0; i < userGlobalList.length; i++) {
                        if($.inArray(userGlobalList[i].username, groupUsers) != -1){
                            appendUser(userGlobalList[i], true);
                   } else {
                        appendUser(userGlobalList[i], false);
                   } }
                   var options = {
                    valueNames: ['username', 'affiliation', 'id']
                   };
                   
                   var userList = new List('table-filter-users', options);
                    console.log(userList);
                   }
            });
       
       },
       
       crossDomain: true,
       dataType: 'json',
       xhrFields: {
       withCredentials: true
       },
       statusCode: {
       //si jamais camomile renvoie une erreur unauthorised, on balance sur la page de login
       401: function() {
       //alert( "not authorized" );
       $("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
       $("#login-div").css("display", "block");
       $("#logout-div").css("display", "none");
       deleteCookie("pseudo");
       },
       501: function(data) {
       alert("Opération interdite : "+data.responseText);
       $("#login-div").css("display", "block");
       $("#logout-div").css("display", "none");
       },
       404: function(data) {
       alert("Opération non prévue : "+data.responseText);
       $("#login-div").css("display", "block");
       $("#logout-div").css("display", "none");
       }
       }
       });
}

function appendGroup(data){
td = $("<tr></tr>").attr("x-groupname", data["groupname"]);
td = td.attr("x-uid", data["_id"]);
td.append($("<td></td>").addClass("id").html(data["_id"]));
td_inside = $("<td></td>").addClass("groupname");
td_inside.append($("<span></span>").html(data["groupname"]).addClass("changeGroupname"));
td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "text").css("margin-right", "4px").attr("value", data["groupname"]).addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changeGroupnameValid").html("Valid")));
td.append(td_inside);
//td.append($("<td></td>").html(data["username"]));
td_inside = $("<td></td>").addClass("description");
td_inside.append($("<span></span>").html(data["description"]).addClass("changeDescription"));
td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "text").css("margin-right", "4px").attr("value", data["description"]).addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changeDescriptionValid").html("Valid")));
td.append(td_inside);
//list Users
td.append($("<td></td>").append($('<button type="button" class="btn btn-sm btn-default listUsers" style="margin-right:4px"></button>').html("List").attr("x-groupname", data["groupname"])));
//delete
td.append($("<td></td>").append($('<button type="button" class="btn btn-sm btn-default deleteGroup" style="margin-right:4px"></button>').html("delete").attr("x-groupname", data["groupname"])));
$("#groups").append(td);
//changeRoleApparence(data["username"], data["role"]);
}

function appendUser(data, ingroup){
td = $("<tr></tr>").attr("x-username", data["username"]);
td = td.attr("x-uid", data["_id"]);
td.append($("<td></td>").addClass("id").html(data["_id"]));
td_inside = $("<td></td>").addClass("username");
//<span class="hint--bottom" data-hint="Thank you!">hover over me.</span>
td_inside.append($("<span></span>").html(data["username"]).addClass("changeUsername").attr("data-hint", "double-click pour modifier").addClass("hint--top"));
td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "text").css("margin-right", "4px").attr("value", data["username"]).addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changeUsernameValid").html("Valid")));
td.append(td_inside);
//td.append($("<td></td>").html(data["username"]));
td_inside = $("<td></td>").addClass("affiliation");
td_inside.append($("<span></span>").html(data["affiliation"]).addClass("changeAffiliation").attr("data-hint", "double-click pour modifier").addClass("hint--top"));
td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "text").css("margin-right", "4px").attr("value", data["affiliation"]).addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changeAffiliationValid").html("Valid")));
td.append(td_inside);
//td.append($("<td></td>").html(data["affiliation"]));
tdd = $("<td></td>");
if(ingroup){
tdd.append($('<button type="button" class="btn btn-sm btn-default setInGroup" style="margin-right:4px" disabled="disabled"></button>').html("Add"));
    td.append(tdd);
    td_inside = $("<td></td>");
    td.append(td_inside);
    tdd.append($('<button type="button" class="btn btn-sm btn-default deleteFromGroup" style="margin-right:4px"></button>').html("Delete"));
}
else{
    tdd.append($('<button type="button" class="btn btn-sm btn-default setInGroup" style="margin-right:4px"></button>').html("Add"));
    td.append(tdd);
    td_inside = $("<td></td>");
    td.append(td_inside);
    tdd.append($('<button type="button" class="btn btn-sm btn-default deleteFromGroup" style="margin-right:4px" disabled="disabled"></button>').html("Delete"));
}
$("#users").append(td);
$("span[data-toggle=tooltip]").tooltip();
}

function changeListUsersApparence(event) {
    $('#groups').find(".btn-primary.active").removeClass("btn-primary").removeClass("active").addClass("btn-default");
    $(event.target).addClass("btn-primary").addClass("active").removeClass("btn-default");
}


function setInGroup(event){
var currentUser = {};
currentUser.id_user = $(event.target).parents("tr").attr("x-uid");
currentUser.username = $(event.target).parents("tr").attr("x-username");
$.ajax({
   type: "POST",
   url: config.url + "/group/" + currentGroupUid + "/user",
   data: currentUser,
   success: function(userGlobalList) {
   $("#login-div").css("display", "none");
   $("#logout-div").css("display", "block");
   $("#usersGroupContainer").css("display", "block");
   addApparence(currentUser.username);
   }
   });
}


function deleteFromGroup(event){
var userUsername = $(event.target).parents("tr").attr("x-username"); console.log(userUsername);
console.log("Ok");
$.ajax({
       type: "DELETE",
       url: config.url + "/group/" + currentGroupUid + "/user/" + userUsername,
       success: function(userGlobalList) {
       $("#login-div").css("display", "none");
       $("#logout-div").css("display", "block");
       $("#usersGroupContainer").css("display", "block");
       deleteApparence(userUsername);
       }
       });
}



function addApparence(name){
tr = $("tr[x-username=" + name + "]");
tr.find(".btn-primary.active").removeClass("btn-primary").removeClass("active").addClass("btn-default");

var buttons = tr.find(".btn-default");

$(buttons).each(function()
                {
                $(this).attr('disabled','disabled');
                });

for (var i = 0; i < buttons.length; i++) {
    if ($(buttons[i]).html() === "Delete") {
        $(buttons[i]).removeAttr('disabled');
        return;
    }
}
console.log("username : " + name + "\tchange role : Ajouté");
}



function deleteApparence(name){
tr = $("tr[x-username=" + name + "]");
tr.find(".btn-primary.active").removeClass("btn-primary").removeClass("active").addClass("btn-default");

var buttons = tr.find(".btn-default");

$(buttons).each(function()
                {
                $(this).attr('disabled','disabled');
                });

for (var i = 0; i < buttons.length; i++) {
    if ($(buttons[i]).html() === "Add") {
        $(buttons[i]).removeAttr('disabled');
        return;
    }
}
}

function signup() {
var data = {};
data.groupname = $("#signup-groupname").val();
data.description = $("#signup-description").val();
$.ajax({
    url: config.url + "/group",
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    crossDomain: true,
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    statusCode: {
        //si jamais camomile renvoie une erreur unauthorised, on balance sur la page de login
        401: function() {
            alert("not authorized");
            $("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
            $("#login-div").css("display", "block");
            $("#logout-div").css("display", "none");
            deleteCookie("pseudo");
        },
        200: function(data) {
            appendGroup(data);
        },
        501: function(data) {
            alert("Opération interdite : " + data.responseText);
        },
        404: function(data) {
            alert("Opération non prévue : " + data.responseText);
        }
    }
});

}

function deleteGroup(event) {
var data = {};
data.uid = $(event.target).parents("tr").attr("x-uid");
data.groupname = $(event.target).parents("tr").attr("x-groupname");
$.ajax({
    url: config.url + "/group/" + data.uid + "/",
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));
    },
    crossDomain: true,
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    statusCode: {
        //si jamais camomile renvoie une erreur unauthorised, on balance sur la page de login
        401: function() {
            alert("not authorized");
            $("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
            $("#login-div").css("display", "block");
            $("#logout-div").css("display", "none");
            deleteCookie("pseudo");
        },
        200: function() {
            $("tr[x-groupname=" + data.groupname + "]").remove();
        },
        501: function(data) {
            alert("Opération interdite : " + data.responseText);
        },
        404: function(data) {
            alert("Opération non prévue : " + data.responseText);
        }
    }
});
}


function login(event) {
var data = {};
data.username = $("#loginUsername").val();
data.password = $("#loginPassword").val();
$.ajax({
    url: config.url + "/login",
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));
    },
    crossDomain: true,
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    statusCode: {
        //si jamais camomile renvoie une erreur unauthorised, on balance sur la page de login
        401: function() {
            //alert( "not authorized" );
            $("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
            $("#login-div").css("display", "block");
            $("#logout-div").css("display", "none");
            deleteCookie("pseudo");
        },
        200: function() {
            window.location.reload();
        },
        501: function(data) {
            alert("Opération interdite : " + data.responseText);
        },
        404: function(data) {
            alert("Opération non prévue : " + data.responseText);
        }
    }
});
}

function logout(event){
$.ajax({
    url: config.url + "/logout",
    type: 'GET',
    contentType: 'application/json',
    success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));
    },
    crossDomain: true,
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    statusCode: {
        //si jamais camomile renvoie une erreur unauthorised, on balance sur la page de login
        401: function() {
            //alert( "not authorized" );
            $("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
            $("#login-div").css("display", "block");
            $("#logout-div").css("display", "none");
            deleteCookie("pseudo");
        },
        200: function() {
            $("#login-div").css("display", "block");
            $("#logout-div").css("display", "none");
            deleteCookie("pseudo");
            window.location.reload(); 
        }, 
        501: function(data) {
            alert("Opération interdite : "+data.responseText);
        },
        404: function(data) {
            alert("Opération non prévue : "+data.responseText);
        }
    }
});
}

function keyDownLogin(event) {
if (event.keyCode == 13) {
    login();
}
}

function changeGroupnameDiv(event) {
td = $(event.target).parents("td");
$(event.target).css("display", "none");
td.find("div").css("display", "block");
}

function changeGroupname(event) {
td = $(event.target).parents("td");
td.find("div").css("display", "none");
//envoi req
var data = {};
data.groupname = td.find("input[type=text]").val();
id = td.parents("tr").attr("x-uid");
$.ajax({
    url: config.url + "/group/" + id,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));
    },
    crossDomain: true,
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    statusCode: {
        //si jamais camomile renvoie une erreur unauthorised, on balance sur la page de login
        401: function() {
            //alert( "not authorized" );
            $("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
            $("#login-div").css("display", "block");
            $("#logout-div").css("display", "none");
            deleteCookie("pseudo");
        },
        200: function() {
            td.find("span").css("display", "block").html(td.find("input[type=text]").val());
        },
        501: function(data) {
            alert("Opération interdite : " + data.responseText);
        },
        404: function(data) {
            alert("Opération non prévue : " + data.responseText);
        }
    }
});
}

function changeDescription(event) {
td = $(event.target).parents("td");
td.find("div").css("display", "none");
//envoi req
var data = {};
data.description = td.find("input[type=text]").val();
id = td.parents("tr").attr("x-uid");
$.ajax({
    url: config.url + "/group/" + id,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(data) {
        console.log('success');
        console.log(JSON.stringify(data));
    },
    crossDomain: true,
    dataType: 'json',
    xhrFields: {
        withCredentials: true
    },
    statusCode: {
        //si jamais camomile renvoie une erreur unauthorised, on balance sur la page de login
        401: function() {
            //alert( "not authorized" );
            $("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
            $("#login-div").css("display", "block");
            $("#logout-div").css("display", "none");
            deleteCookie("pseudo");
        },
        200: function() {
            td.find("span").css("display", "block").html(td.find("input[type=text]").val());
        },
        501: function(data) {
            alert("Opération interdite : " + data.responseText);
        },
        404: function(data) {
            alert("Opération non prévue : " + data.responseText);
        }
    }
});
}



$( document ).ready(function() {
loadGroups();
$("#signup-submit").click(signup);
$("body").on("click", "button.deleteGroup", deleteGroup);
$("body").on("click", "button.loginButton", login);
$("body").on("click", "button.logoutButton", logout);
$("body").on("keydown", "input[id=loginUsername]", keyDownLogin);
$("body").on("keydown", "input[id=loginPassword]", keyDownLogin);
$("body").on("dblclick", "span.changeGroupname", changeGroupnameDiv);
$("body").on("click", "button.changeGroupnameValid", changeGroupname);
$("body").on("dblclick", "span.changeDescription", changeGroupnameDiv);
$("body").on("click", "button.changeDescriptionValid", changeDescription);
$("body").on("click", "button.setInGroup", setInGroup);
$("body").on("click", "button.deleteFromGroup", deleteFromGroup);
$("body").on("click", "button.listUsers", loadUsersGroup);
});
