function changediv(user_name) {
    var changedivtemp = `<h1> Hi ` + user_name + ` </h1><br><h1><a href="/logout"> Logout</a></h1>`;
    document.getElementById('loginwindow').innerHTML = changedivtemp;

}

function loadLogin() {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
                changediv(this.responseText);
            }
        }
    };

    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadLoggedInUser(username) {
    var user_name = username;

    alert(`Login Successful`);
}

function loadLoginForm() {



    // Submit username/password to login
    var submit = document.getElementById('loginbtn');
    submit.onclick = function() {
        // Create a request object
        var request = new XMLHttpRequest();

        // Capture the response and store it in a variable
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    submit.value = 'Sucess';
                } else if (request.status === 403) {
                    submit.value = 'Invalid credentials';
                } else if (request.status === 500) {
                    alert('Something went wrong on the server');
                    submit.value = 'Login';
                } else {
                    alert('Something went wrong on the server');
                    submit.value = 'Login';
                }
                loadLogin();
            }
            // Not done yet
        };

        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({ username: username, password: password }));
        submit.value = 'Logging in';

    };
}
loadLoginForm();