const urlBase = 'http://poosd26.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let login = "";
const ids = []

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	// Serialize the 'ids' array to a JSON string
    const idsJSON = JSON.stringify(ids);

    document.cookie =
      "firstName=" +
      firstName +
      ",lastName=" +
      lastName +
      ",userId=" +
      userId +
      ",login=" +
      login +
      ";expires=" +
      date.toGMTString();
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


function addContact() {
    
    console.log(userId, firstName, lastName, login);

    let firstname = document.getElementById("contactTextFirst").value;
    let lastname = document.getElementById("contactTextLast").value;
    let phonenumber = document.getElementById("contactTextNumber").value;
    let emailaddress = document.getElementById("contactTextEmail").value;

    if (!validAddContact(firstname, lastname, phonenumber, emailaddress)) {
        console.log("INVALID FIRST NAME, LAST NAME, PHONE, OR EMAIL SUBMITTED");
        return;
    }
    let tmp = {
        firstName: firstname,
        lastName: lastname,
        phone: phonenumber,
        email: emailaddress,
        login: login
    };


    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onerror = function () {
        console.error("Error occurred during the request");
    };

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been added");
                // Clear input fields in form 
                document.getElementById("contactTextFirst").value = "";
                document.getElementById("contactTextLast").value = "";
                document.getElementById("contactTextNumber").value = "";
                document.getElementById("contactTextEmail").value = "";

                // reload contacts table and switch view to show
                loadContacts();

            }
        };
        console.log("JSON Payload:", jsonPayload);
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function loadContacts() {
    let tmp = {
        userId: userId,
        search: ""
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Search.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                    text += "<td>" +
                            "<button type='button' id='edit_button" + i + "' class='editButton' onclick='edit_row(" + i + ")'>" + "<img src='images/editButton.png' class='editContactImage'>"  + "</button>" +
                            "<button type='button' id='save_button" + i + "' value='Save' class='saveButton' onclick='save_row(" + i + ")' style='display: none'>" + "<img src='images/saveButton.png' class='saveContactImage'>" + "</button>" +
                            "<button type='button' onclick='delete_row(" + i + ")' class='delContact'>" + "<img src='images/delButton.png' class='delContactImage'>" + "</button>" + "</td>";

            
                }
                text += "</table>"
                saveCookie();

                document.getElementById("tbody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}


function edit_row(id) {
    document.getElementById("edit_button" + id).style.display = "none";
    document.getElementById("save_button" + id).style.display = "inline-block";

    var firstNameI = document.getElementById("first_Name" + id);
    var lastNameI = document.getElementById("last_Name" + id);
    var email = document.getElementById("email" + id);
    var phone = document.getElementById("phone" + id);

    var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    var editTextStyle = 'display: block; margin: 0 auto; text-align: left; border-radius: 0; width: 150px;'

    firstNameI.innerHTML = `<input type='text' class='editContactsText' id='namef_text${id}' value='${namef_data}' style='${editTextStyle}'>`;
    lastNameI.innerHTML = `<input type='text' class='editContactsText' id='namel_text${id}' value='${namel_data}' style='${editTextStyle}'>`;
    email.innerHTML = `<input type='text' class='editContactsText' id='email_text${id}' value='${email_data}' style='${editTextStyle}'>`;
    phone.innerHTML = `<input type='text' class='editContactsText' id='phone_text${id}' value='${phone_data}' style='${editTextStyle}'>`;

}

function save_row(no) {
    var namef_val = document.getElementById("namef_text" + no).value;
    var namel_val = document.getElementById("namel_text" + no).value;
    var email_val = document.getElementById("email_text" + no).value;
    var phone_val = document.getElementById("phone_text" + no).value;
    var id_val = ids[no]

    document.getElementById("first_Name" + no).innerHTML = namef_val;
    document.getElementById("last_Name" + no).innerHTML = namel_val;
    document.getElementById("email" + no).innerHTML = email_val;
    document.getElementById("phone" + no).innerHTML = phone_val;

    document.getElementById("edit_button" + no).style.display = "inline-block";
    document.getElementById("save_button" + no).style.display = "none";

    let tmp = {
        firstName: namef_val,
        lastName: namel_val,
        phone: phone_val,
        email: email_val,
        login: login,        
        contactId: id_val
    };

    let jsonPayload = JSON.stringify(tmp);
    console.log(jsonPayload);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}


function delete_row(no) {
    var namef_val = document.getElementById("first_Name" + no).innerText;
    var namel_val = document.getElementById("last_Name" + no).innerText;
    var id_val = ids[no]
    console.log(id_val);

    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);
    let check = confirm('Are you sure you want to delete this contact: ' + nameOne + ' ' + nameTwo);
    if (check === true) {
        document.getElementById("row" + no + "").outerHTML = "";
        
        let tmp = {
            login: login,
            contactId: id_val
        };
        
        let jsonPayload = JSON.stringify(tmp);
        console.log(jsonPayload);

        let url = urlBase + '/DeleteContact.' + extension; 
        console.log(url);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };

}

function searchContacts() {
    const content = document.getElementById("mySearchBar");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contacts");
    const tr = table.getElementsByTagName("tr");// Table Row

    for (let i = 0; i < tr.length; i++) {
        const td_fn = tr[i].getElementsByTagName("td")[0];// Table Data: First Name
        const td_ln = tr[i].getElementsByTagName("td")[1];// Table Data: Last Name

        if (td_fn && td_ln) {
            const txtValue_fn = td_fn.textContent || td_fn.innerText;
            const txtValue_ln = td_ln.textContent || td_ln.innerText;
            tr[i].style.display = "none";

            for (selection of selections) {
                if (txtValue_fn.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                if (txtValue_ln.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
            }
        }
    }
}

function validAddContact(firstName, lastName, phone, email) {

    var fNameErr = lNameErr = phoneErr = emailErr = true;

    var contactFirstNameField = document.getElementById('contactFirstNameField');
    var contactLastNameField = document.getElementById('contactLastNameField');
    var contactNumberField = document.getElementById('contactNumberField');
    var contactEmailField = document.getElementById('contactEmailField');

    if (firstName == "") {
        console.log("FIRST NAME IS BLANK");
        contactFirstNameField.style.display = 'block';
    }
    else {
        console.log("first name IS VALID");
        contactFirstNameField.style.display = 'none';
        fNameErr = false;
    }

    if (lastName == "") {
        console.log("LAST NAME IS BLANK");
        contactLastNameField.style.display = 'block';
    }
    else {
        console.log("LAST name IS VALID");
        contactLastNameField.style.display = 'none';
        lNameErr = false;
    }

    if (phone == "") {
        console.log("PHONE IS BLANK");
        contactNumberField.style.display = 'block';
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            console.log("PHONE IS NOT VALID");
            contactNumberField.style.display = 'block';
        }

        else {

            console.log("PHONE IS VALID");
            contactNumberField.style.display = 'none';
            phoneErr = false;
        }
    }

    if (email == "") {
        console.log("EMAIL IS BLANK");
        contactEmailField.style.display = 'block';
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(email) == false) {
            console.log("EMAIL IS NOT VALID");
            contactEmailField.style.display = 'block';
        }

        else {

            console.log("EMAIL IS VALID");
            contactEmailField.style.display = 'none';
            emailErr = false;
        }
    }

    if ((phoneErr || emailErr || fNameErr || lNameErr) == true) {
        return false;

    }


    return true;

}
