var userDatas = [];
var currentUrlMedia;

function loadUsersFirst() {
	$.ajax({
		type: "GET",
		url: config.url + "/user",
		success: function(data) {
			$("#login-div").css("display", "none");
			$("#logout-div").css("display", "block");
			$("#mainContainer").css("display", "block");
			if (data.length === undefined) {
				appendUserFirst(data);

				userDatas = [data];
			} else {
				for (var i = 0; i < data.length; i++) {
					appendUserFirst(data[i]);

				}
				;
				userDatas = data;
			}
			var options = {
				valueNames: ['username', 'affiliation']
			};

			var userList = new List('table-filter-users', options);
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

function loadGroupsFirst() {
	$.ajax({
		type: "GET",
		url: config.url + "/group",
		success: function(data) {
			$("#login-div").css("display", "none");
			$("#logout-div").css("display", "block");
			$("#mainContainer").css("display", "block");
			if (data.length === undefined) {
				appendGroupFirst(data);

				userDatas = [data];
			} else {
				for (var i = 0; i < data.length; i++) {
					appendGroupFirst(data[i]);

				}
				;
				userDatas = data;
			}
			var options = {
				valueNames: ['username', 'affiliation']
			};

			var grprList = new List('table-filter-groups', options);
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





/*function appendUser(data) {
	td = $("<tr></tr>").attr("x-username", data["username"]);
	td = td.attr("x-uid", data["_id"]);
	// td.append($("<td></td>").addClass("id").html(data["_id"]));
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
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("none"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("read"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("modify"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("delete"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRole" style="margin-right:4px"></button>').html("supervisor"));
	td.append(tdd);

	$("#users").append(td);
	//changeRoleApparence(data["username"], data["role"]);
}*/

function appendUserFirst(data) {
	td = $("<tr></tr>").attr("x-username", data["username"]);
	td = td.attr("x-uid", data["_id"]);
	// td.append($("<td></td>").addClass("id").html(data["_id"]));
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
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleUser N" style="margin-right:4px" disabled="disabled"></button>').html("None"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleUser R" style="margin-right:4px" disabled="disabled"></button>').html("Read"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleUser E" style="margin-right:4px" disabled="disabled"></button>').html("Edit"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleUser C" style="margin-right:4px" disabled="disabled"></button>').html("Create"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleUser D" style="margin-right:4px" disabled="disabled"></button>').html("Delete"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleUser A" style="margin-right:4px" disabled="disabled"></button>').html("Admin"));
	td.append(tdd);

	$("#users").append(td);
	//changeRoleApparence(data["username"], data["role"]);	
}


function appendGroupFirst(data) {
	td = $("<tr></tr>").attr("x-username", data["groupname"]);
	td = td.attr("x-uid", data["_id"]);
	// td.append($("<td></td>").addClass("id").html(data["_id"]));
	td_inside = $("<td></td>").addClass("username");
	td_inside.append($("<span></span>").html(data["groupname"]).addClass("changeUsername"));
	td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "text").css("margin-right", "4px").attr("value", data["groupname"]).addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changeUsernameValid").html("Valid")));
	td.append(td_inside);
	//td.append($("<td></td>").html(data["username"]));
	td_inside = $("<td></td>").addClass("affiliation");
	td_inside.append($("<span></span>").html(data["affiliation"]).addClass("changeAffiliation"));
	td_inside.append($("<div></div>").css("display", "none").addClass("form-inline").append($("<input></input>").attr("type", "text").css("margin-right", "4px").attr("value", data["affiliation"]).addClass("form-control input-sm")).append($("<button></button>").attr("type", "button").addClass("btn btn-primary btn-xs changeAffiliationValid").html("Valid")));
	td.append(td_inside);
	//td.append($("<td></td>").html(data["affiliation"]));
	tdd = $("<td></td>");
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleGroup N" style="margin-right:4px" disabled="disabled"></button>').html("None"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleGroup R" style="margin-right:4px" disabled="disabled"></button>').html("Read"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleGroup E" style="margin-right:4px" disabled="disabled"></button>').html("Edit"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleGroup C" style="margin-right:4px" disabled="disabled"></button>').html("Create"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleGroup D" style="margin-right:4px" disabled="disabled"></button>').html("Delete"));
	tdd.append($('<button type="button" class="btn btn-sm btn-default changeRoleGroup A" style="margin-right:4px" disabled="disabled"></button>').html("Admin"));
	td.append(tdd);

	$("#groups").append(td);
	//changeRoleApparence(data["username"], data["role"]);
}


function changeRoleApparence(name, role) {
	tr = $("tr[x-username=" + name + "]");
	tr.find(".btn-primary.active").removeClass("btn-primary").removeClass("active").addClass("btn-default");

	var buttons = tr.find(".btn-default");

	$(buttons).each(function()
	{
		$(this).removeAttr('disabled');
	});

	for (var i = 0; i < buttons.length; i++) {
		if ($(buttons[i]).html() === role) {
			$(buttons[i]).addClass("btn-primary").addClass("active").removeClass("btn-default");
			$(buttons[i]).removeAttr('disabled');
			$(this).addClass("btn-primary").addClass("active").removeClass("btn-default");
			return;
		}
	}

}


function changeRoleAclUser(event) {
	var data = {};
	data.username = $(event.target).parents("tr").attr("x-username");
	//data.role = $(event.target).html();
	data.userright = rightToInitial($(event.target).html());
	$.ajax({
		url: config.url + "/corpus" + currentUrlMedia + '/acl',
		type: 'PUT',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success: function(data) {
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
			},
			200: function() {
				changeRoleApparence(data.username, $(event.target).html());
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

function changeRoleAclGroup(event) {
	var data = {};
	data.groupname = $(event.target).parents("tr").attr("x-username");
	//data.role = $(event.target).html();
	data.groupright = rightToInitial($(event.target).html());
	$.ajax({
		url: config.url + "/corpus" + currentUrlMedia + '/acl',
		type: 'PUT',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success: function(data) {
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
			},
			200: function() {
				changeRoleApparence(data.groupname, $(event.target).html());
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



function getData(url, type, currentElem)
{
	$.ajax(
			{
				type: 'GET',
				crossDomain: true,
				xhrFields: {
					withCredentials: true
				},
				dataType: "json",
				converters: $.JSON,
				url: config.url + '/corpus' + url,
				success: function(data)
				{
					$.each(data, function()
					{

						if (type === "" && this['_id'])
						{
							$(currentElem).append("<li id='" + this['_id'] + "' ><a title='" + this['name'] + "'><span></span> " + this['name'].substr(0, 30) + "</a></li>");

							makeTree(this['_id'], url, "media");

						}
						else if (type === "media" && this['_id'])
						{

							$(currentElem).append("<li id='" + this['_id'] + "'  ><a title='" + this['name'] + "'><span></span> " + this['name'].substr(0, 30) + "</a></li>");
							$("#" + this['_id']).parent('ul').parent('li').find('> a > span').addClass('glyphicon glyphicon-plus-sign');

							$("#" + this['_id']).hide();

							makeTree(this['_id'], url, "layer");
						}
						else if (type === "layer" && this['_id'])
						{
							$(currentElem).append("<li id='" + this['_id'] + "' ><a title='" + this['history'][0]['name'] + "'><span></span> " + this['history'][0]['name'].substr(0, 30) + "</a></li>");
							$("#" + this['_id']).parent('ul').parent('li').find('> a > span').addClass('glyphicon glyphicon-plus-sign');

							$("#" + this['_id']).hide();
							// makeTree(this['_id'], url, "annotation");
						}
						// else if (type === "annotation" && this['_id'])
						// {
						// 	$(currentElem).append("<li id='" + this['_id'] + "'><a title='" + this['data'] + "'>" + this['data'].substr(0, 30) + "</a></li>");
						// 	$("#" + this['_id']).parent('ul').parent('li').find('> a > span').addClass('glyphicon glyphicon-plus-sign');
						// 	$("#" + this['_id']).hide();

						// 	clickTree(this['_id']);
						// }
					});
				}
			});

}

function makeTree(id, url, typeMedia)
{
	$("#" + id).append("<ul></ul>");
	clickTree(id);
	clickMedia(id, url + '/' + id);
	getData(url + '/' + id + "/" + typeMedia, typeMedia, "#" + id + " > ul");
}

function clickTree(id)
{
	$("#" + id + "> a > span").click(function(e) {
		var children = $(this).parent('a').parent('li').find('> ul > li');
			
		if (children.length !== 0)
		{
			if (children.is(":visible"))
			{
				children.hide('fast');
				$(this).find('> a > span').removeClass('glyphicon glyphicon-minus-sign').addClass('glyphicon glyphicon-plus-sign');
			}
			else
			{
				children.show('fast');
				$(this).find('> a > span').removeClass('glyphicon glyphicon-plus-sign').addClass('glyphicon glyphicon-minus-sign');
			}

		}

		e.stopPropagation();
	});
}

function clickMedia(id, url)
{

	$("#" + id + "> a").click(function(e) {
		var children = $(this).parent('li').find('> ul > li');
		currentUrlMedia = url;
		var listTr = $('tr');
		
		$('a').css("background-color", 'intial');
		$(this).css("background-color", "#5cb85c");
		
		$.ajax(
				{
					type: 'GET',
					crossDomain: true,
					xhrFields: {
						withCredentials: true
					},
					dataType: "json",
					converters: $.JSON,
					url: config.url + '/corpus' + url + '/acl',
					success: function(data)
					{
						listTr.each(function()
						{
							var username = $(this).attr('x-username');

							if (username !== undefined)
							{
								var match = false;
								$(data['users']).each(function()
								{
									if (username === this['login'])
									{
										match = true;
										changeRoleApparence(username, initialToRight(this['right']));
									}

								});
								$(data['groups']).each(function()
								{
									if (username === this['login'])
									{
										match = true;
										changeRoleApparence(username, initialToRight(this['right']));
									}

								});

								if (!match)
								{
									changeRoleApparence(username, 'None');
								}
							}

						});
						

					}
				}


		);
		//loadUsers(url);    



		e.stopPropagation();
	});
}

function initialToRight(str)
{
	if (str === 'N')
		return 'None';
	else if (str === 'R')
		return 'Read';
	else if (str === 'E')
		return 'Edit';
	else if (str === 'C')
		return 'Create';
	else if (str === 'D')
		return 'Delete';
	else if (str === 'A')
		return 'Admin';
	else
		return 'Error';
}

function rightToInitial(str)
{
	if (str === 'None')
		return 'N';
	else if (str === 'Read')
		return 'R';
	else if (str === 'Edit')
		return 'E';
	else if (str === 'Create')
		return 'C';
	else if (str === 'Delete')
		return 'D';
	else if (str === 'Admin')
		return 'A';
	else
		return 'Error';
}


function postACLNone(username)
{
	var data = {};
	data.username = username;

	data.userright = 'N';

	$.ajax({
		url: config.url + "/corpus" + currentUrlMedia + '/acl',
		type: 'POST',
		data: JSON.stringify(data),
		contentType: 'application/json',
		success: function(data) {
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
			},
			200: function() {
				changeRoleApparence(data.username, $(event.target).html());
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

/*function loadAcl() {
 
 $.ajax({
 type: "GET",
 url: config.url + "/user",
 success: function(data) {
 $("#mainContainer").css("display", "block");
 if (data.length == undefined) {
 appendUser(data);
 
 userDatas = [data];
 } else {
 for (var i = 0; i < data.length; i++) {
 appendUser(data[i]);
 
 }
 ;
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
 },
 501: function(data) {
 alert("Opération interdite : " + data.responseText);
 },
 404: function(data) {
 alert("Opération non prévue : " + data.responseText);
 }
 }
 });
 
 }*/

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

$(document).ready(function() {
	loadUsersFirst();
	loadGroupsFirst();
	//loadAcl();
	$("body").on("click", "button.changeRoleUser", changeRoleAclUser);
	$("body").on("click", "button.changeRoleGroup", changeRoleAclGroup);

	$("body").on("click", "button.loginButton", login);
	$("body").on("click", "button.logoutButton", logout);
	$("body").on("keydown", "input[id=loginUsername]", keyDownLogin);
	$("body").on("keydown", "input[id=loginPassword]", keyDownLogin);
	


	$(document).tooltip();
	$(getData("", "", '#result > ul'));
	$('#navTab a:first').tab('show');



});
