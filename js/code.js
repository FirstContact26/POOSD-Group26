const urlBase = 'http://poosd26.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let login = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	//Checking for valid login
	if(!isLoginValid(login, password)) return;

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "*User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function isLoginValid(loginName, loginPass) {

	//Checking for blank fields
	if (loginName == "") 
		document.getElementById("loginName").style.borderBottom = "1.5px solid red";
	else
		document.getElementById("loginName").style.borderBottom = "1.5px solid gray";

	if (loginPass == "") 
		document.getElementById("loginPassword").style.borderBottom = "1.5px solid red";
	else
		document.getElementById("loginPassword").style.borderBottom = "1.5px solid gray";

	if(loginName == "" || loginPass == "") {
		document.getElementById("loginResult").innerHTML = "*Please fill in the blank fields";
		return false;
	}

	/* Check for valid inputs (unnecessary?)
	let validName = true;
	let validPass = true;

    var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/; //conditionals for username

	//Checking for valid username
    if(regex.test(loginName) == false) {
        document.getElementById("loginName").style.borderBottom = "1.5px solid red";
		validName = false;
    }
	else
		document.getElementById("loginName").style.borderBottom = "1.5px solid gray";

	var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/; //conditionals for password

	//Checking for valid password
	if (regex.test(loginPass) == false) {
		document.getElementById("loginPassword").style.borderBottom = "1.5px solid red";
		validPass = false;
	}
	else
		document.getElementById("loginPassword").style.borderBottom = "1.5px solid gray";

	if(!validName || !validPass) {
		document.getElementById("loginResult").innerHTML = "*Invalid Username/Password";
		return false;
	}
	*/

    return true;

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",login=" + login + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
        else if( tokens[0] == "login" )
		{
			login = tokens[1];
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("contacts-title").innerHTML = "Welcome " + firstName + "!";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function doRegister()
{
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	let newUsername = document.getElementById("regUsername").value;
	let newPassword = document.getElementById("regPassword").value;
	let verPassword = document.getElementById("verPassword").value;
	
	document.getElementById("registerResult").innerHTML = "";

	//Checking for valid sign up
	if(!isRegisterValid(firstName, lastName, newUsername, newPassword, verPassword)) return;

	let tmp = {firstName:firstName,lastName:lastName,login:newUsername,password:newPassword};
	
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			
			if (this.readyState != 4) {
                return;
            }

            if (JSON.parse(xhr.responseText).id == 0) {
                document.getElementById("registerResult").innerHTML = "*User already exists";
                return;
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("registerResult").innerHTML = "*User added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
				doLoginFromRegister(newUsername, newPassword);
            }
			
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
	
}

//Does login immediately after signing up
function doLoginFromRegister(loginR, password)
{
	userId = 0;
	login = loginR;
	
//	var hash = md5( password );

	let tmp = {login:loginR,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("reigsterResult").innerHTML = "*User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function isRegisterValid(fName, lName, username, password, verpass) {

	//Checking for blank fields
	if (fName == "") //First Name
		document.getElementById("firstName").style.borderBottom = "1.5px solid red";
	else
		document.getElementById("firstName").style.borderBottom = "1.5px solid gray";

	if (lName == "") //Last Name
		document.getElementById("lastName").style.borderBottom = "1.5px solid red";
	else
		document.getElementById("lastName").style.borderBottom = "1.5px solid gray";

	if (username == "") //Username
		document.getElementById("regUsername").style.borderBottom = "1.5px solid red";
	else
		document.getElementById("regUsername").style.borderBottom = "1.5px solid gray";

	if (password == "") //Password
		document.getElementById("regPassword").style.borderBottom = "1.5px solid red";
	else
		document.getElementById("regPassword").style.borderBottom = "1.5px solid gray";

	if(fName == "" || lName == "" || username == "" || password == "") {
		document.getElementById("registerResult").innerHTML = "*Please fill in the blank fields";
		return false;
	}
    
	let validName = true;
	let validPass = true;

    var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/; //conditionals for username

	//Checking for valid username
    if(regex.test(username) == false) {
        document.getElementById("regUsername").style.borderBottom = "1.5px solid red";
		validName = false;
    }
	else
		document.getElementById("regUsername").style.borderBottom = "1.5px solid gray";

	var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/; //conditionals for password

	//Checking for valid password
	if (regex.test(password) == false) {
		document.getElementById("regPassword").style.borderBottom = "1.5px solid red";
		validPass = false;
	}
	else
		document.getElementById("regPassword").style.borderBottom = "1.5px solid gray";

	if(!validName || !validPass) {
		document.getElementById("registerResult").innerHTML = "*Invalid Username/Password";
		return false;
	}

	//Checking if passwords match
	if(password != verpass) {
		document.getElementById("registerResult").innerHTML = "*Passwords do not match!";
		document.getElementById("regPassword").style.borderBottom = "1.5px solid red";
		document.getElementById("verPassword").style.borderBottom = "1.5px solid red";
		return false;
	}
	else {
		document.getElementById("regPassword").style.borderBottom = "1.5px solid gray";
		document.getElementById("verPassword").style.borderBottom = "1.5px solid gray";
	}

    return true;
}

//Swaps login to sign up
function swapLogin() {
	document.getElementById("login-inputs").style.display = "none";
	document.getElementById("register-inputs").style.display = "flex";
	document.getElementById("loginTitle").innerHTML = "REGISTER";

}

//Swaps sign up to login
function swapRegister() {
	document.getElementById("register-inputs").style.display = "none";
	document.getElementById("login-inputs").style.display = "flex";
	document.getElementById("loginTitle").innerHTML = "LOGIN";

}

//Displays username requirements when signing up
function showUserRequirements() {
	document.getElementById("usernameRequirements").style.display = "block";
}

//Hides username requirements
function blurUserRequirements() {
	document.getElementById("usernameRequirements").style.display = "none";
}

//Displays password requirements when signing up
function showPassRequirements() {
	document.getElementById("passwordRequirements").style.display = "block";
}

//Hides password requirements
function blurPassRequirements() {
	document.getElementById("passwordRequirements").style.display = "none";
}

function togglePassword() {
	var pass = document.getElementById("loginPassword");
	if (pass.type === "password")
		pass.type = "text";
	else 
		pass.type = "password";
}


