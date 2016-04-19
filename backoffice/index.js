var userDatas = [];

function loadUsers(){
	$.ajax({
		type: "GET",
		url: config.url + "/user",
		success: function(data) {
			$("#login-div").css("display", "none");
			$("#logout-div").css("display", "block");
			$("#mainContainer").css("display", "block");
			if (data.length == undefined) {
				appendUser(data);
				//appendAcl(data);
				userDatas = [data];
			} else {
				for (var i = 0; i < data.length; i++) {
					appendUser(data[i]);
					//appendAcl(data[i]);
				}
				userDatas = data;
			}
			console.log(data);
			var options = {
				valueNames: ['username', 'affiliation', 'id']
			};

			var userList = new List('table-filter', options);
			console.log(userList);
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



function appendUser(data){
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
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("user"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("supervisor"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("admin"));
	td.append(tdd);
	//password
	td_inside = $("<td></td>");
	td_inside.append($("<button></button>").attr("type", "button").addClass("btn changePassword").html("changePwd"));
	td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "password").css("margin-right", "4px").addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changePasswordValid").html("Valid")));
	td.append(td_inside);
	//delete
	td.append($("<td></td>").append($('<button type="button" class="btn btn-sm btn-default deleteUser" style="margin-right:4px"></button>').html("delete").attr("x-username", data["username"])));
	$("#users").append(td);
	changeRoleApparence(data["username"], data["role"]);
	$("span[data-toggle=tooltip]").tooltip();
}

function appendAcl(data)
{
	console.log("je passe dans le append acl !!");
	console.log(data.toString());
	td = $("<tr></tr>").attr("x-username", data["username"]);
	td = td.attr("x-uid", data["_id"]);
	td.append($("<td></td>").addClass("id").html(data["_id"]));
	td_inside = $("<td></td>").addClass("username");
	td_inside.append($("<span></span>").html(data["username"]).addClass("changeUsername"));
	td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "text").css("margin-right", "4px").attr("value", data["username"]).addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changeUsernameValid").html("Valid")));
	td.append(td_inside);
	//td.append($("<td></td>").html(data["username"]));
	td_inside = $("<td></td>").addClass("affiliation");
	td_inside.append($("<span></span>").html(data["affiliation"]).addClass("changeAffiliation"));
	td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "text").css("margin-right", "4px").attr("value", data["affiliation"]).addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changeAffiliationValid").html("Valid")));
	td.append(td_inside);
	//td.append($("<td></td>").html(data["affiliation"]));
	tdd = $("<td></td>");
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("user"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("supervisor"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("admin"));
	td.append(tdd);
	//password
	td_inside = $("<td></td>");
	td_inside.append($("<button></button>").attr("type", "button").addClass("btn changePassword").html("changePwd"));
	td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "password").css("margin-right", "4px").addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changePasswordValid").html("Valid")));
	td.append(td_inside);
	//delete
	td.append($("<td></td>").append($('<button type="button" class="btn btn-sm btn-default deleteUser" style="margin-right:4px"></button>').html("delete").attr("x-username", data["username"])));
	$("#acltbody").append(td);
}


function changeRoleApparence(name, role) {
	tr = $("tr[x-username=" + name + "]");
	tr.find(".btn-primary.active").removeClass("btn-primary").removeClass("active").addClass("btn-default");
	buttons = tr.find(".btn-default");
	for (var i = 0; i < buttons.length; i++) {
		if ($(buttons[i]).html() == role) {
			$(buttons[i]).addClass("btn-primary").addClass("active").removeClass("btn-default");
			return;
		}
	}
	;
}

function signup() {
	var data = {};
	data.username = $("#signup-username").val();
	data.password = $("#signup-password").val();
	data.affiliation = $("#signup-affiliation").val();
	data.role = $("input[type=radio][name=signup-role]:checked").val();
	$.ajax({
		url: config.url + "/signup",
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
				alert( "not authorized" );
				$("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
				$("#login-div").css("display", "block");
				$("#logout-div").css("display", "none");
				deleteCookie("pseudo");
			},
			200: function(data){
				appendUser(data);
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

function deleteUser(event) {
	var data = {};
	data.uid = $(event.target).parents("tr").attr("x-uid");
	data.username = $(event.target).parents("tr").attr("x-username");
	$.ajax({
		url: config.url + "/user/" + data.uid + "/",
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
				alert( "not authorized" );
				$("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
				$("#login-div").css("display", "block");
				$("#logout-div").css("display", "none");
				deleteCookie("pseudo");
			},
			200: function() {
				$("tr[x-username="+data.username+"]").remove();
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

function changeRole(event) {
	var data = {};
	data.username = $(event.target).parents("tr").attr("x-username");
	data.role = $(event.target).html();
	$.ajax({
		url: config.url + "/chmodUser",
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
				alert( "not authorized" );
				$("#mainContainer").html("<h1>Authentification required</h1>").css("display", "block");
				$("#login-div").css("display", "block");
				$("#logout-div").css("display", "none");
				deleteCookie("pseudo");
			},
			200: function() {
				changeRoleApparence(data.username, data.role);
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
			401: function(data) {
				//alert( "not authorized" );
				$("#mainContainer").html("<h1>"+data.responseText+"</h1>").css("display", "block");
				$("#login-div").css("display", "block");
				$("#logout-div").css("display", "none");
				deleteCookie("pseudo");
			},
			200: function() {
				$("#login-div").css("display", "none");
				$("#logout-div").css("display", "block");
				setCookie("pseudo", data.username);
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


function keyDownLogin(event){
	if(event.keyCode == 13){
		login();
	}
}

function changeUsernameDiv(event) {
	td = $(event.target).parents("td");
	$(event.target).css("display", "none");
	td.find("div").css("display", "block");
}

function changeUsername(event) {
	td = $(event.target).parents("td");
	td.find("div").css("display", "none");
	clearSelection();
	//envoi req
	var data = {};
	data.username = td.find("input[type=text]").val();
	id = td.parents("tr").attr("x-uid");
	$.ajax({
		url: config.url + "/user/" + id,
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
				alert("Opération interdite : "+data.responseText);
			},
			404: function(data) {
				alert("Opération non prévue : "+data.responseText);
			}
		}
	});
}

function changeAffiliation(event) {
	td = $(event.target).parents("td");
	td.find("div").css("display", "none");
	clearSelection();
	//envoi req
	var data = {};
	data.affiliation = td.find("input[type=text]").val();
	id = td.parents("tr").attr("x-uid");
	$.ajax({
		url: config.url + "/user/" + id,
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
				alert("Opération interdite : "+data.responseText);
			},
			404: function(data) {
				alert("Opération non prévue : "+data.responseText);
			}
		}
	});
}

function changePassword(event) {
	td = $(event.target).parents("td");
	if (td.find("input[type=password]").val() == "") {
		alert("Password can't be empty");
		td.find("div").css("display", "none");
		td.find("button.changePassword").css("display", "inline-block");
		return;
	}
	td.find("div").css("display", "none");
	//envoi req
	var data = {};
	data.password = td.find("input[type=password]").val();
	id = td.parents("tr").attr("x-uid");
	$.ajax({
		url: config.url + "/user/" + id,
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
				td.find("button.changePassword").css("display", "inline-block");
			}, 
			500: function(data){
				alert("Opération incorrecte :"+data.responseText);
				td.find("div").css("display", "block");
			},
			501: function(data) {
				alert("Opération interdite : "+data.responseText);
				td.find("div").css("display", "block");
			},
			404: function(data) {
				alert("Opération non prévue : "+data.responseText);
				td.find("div").css("display", "block");
			}
		}
	});

}


$(document).ready(function() {
	loadUsers();
	//loadAcl();

	$("#signup-submit").click(signup);
	$("body").on("click", "button.deleteUser", deleteUser);
	$("body").on("click", "button.changeRole", changeRole);
	$("body").on("click", "button.loginButton", login);
	$("body").on("click", "button.logoutButton", logout);
	$("body").on("keydown", "input[id=loginUsername]", keyDownLogin);
	$("body").on("keydown", "input[id=loginPassword]", keyDownLogin);
	$("body").on("dblclick", "span.changeUsername", changeUsernameDiv);
	$("body").on("click", "button.changeUsernameValid", changeUsername);
	$("body").on("dblclick", "span.changeAffiliation", changeUsernameDiv);
	$("body").on("click", "button.changeAffiliationValid", changeAffiliation);
	$("body").on("click", "button.changePassword", changeUsernameDiv);
	$("body").on("click", "button.changePasswordValid", changePassword);
	$("button[data-toggle=tooltip]").tooltip();
//	$(document).tooltip();
	$('#navTab a:first').tab('show');

});
