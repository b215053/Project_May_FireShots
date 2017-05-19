function loadLoginForm() {

    var register = document.getElementById('registerbtn');
    register.onclick = function() {
        // Create a request object
        var request = new XMLHttpRequest();

        // Capture the response and store it in a variable
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    alert('USER REGISTRATION SUCCESS');
                    register.value = 'Registered!';
                } else {
                    alert('USER CANNOT BE REGISTERED');
                    register.value = 'Register';
                }
            }
        };

        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({ username: username, password: password }));
        register.value = 'Registering';

    };
}

function displayreport() {

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                // loadLoggedInUser(this.responseText);
                console.log(this.responseText);
                console.log(JSON.parse(this.responseText));

                document.getElementById('leads').innerHTML = this.responseText;
            } else {
                alert('error fetching all leads');
            }
        }
    };

    request.open('GET', '/allleadscount', true);
    request.send(null);


    var request1 = new XMLHttpRequest();
    request1.onreadystatechange = function() {
        if (request1.readyState === XMLHttpRequest.DONE) {
            if (request1.status === 200) {
                // loadLoggedInUser(this.responseText);
                document.getElementById('prospects').innerHTML = this.responseText;
            } else {
                alert('error fetching all prospects');
            }
        }
    };

    request1.open('GET', '/allprospectscount', true);
    request1.send(null);


    var request2 = new XMLHttpRequest();
    request2.onreadystatechange = function() {
        if (request2.readyState === XMLHttpRequest.DONE) {
            if (request2.status === 200) {
                // loadLoggedInUser(this.responseText);
                document.getElementById('opportunity').innerHTML = this.responseText;
            } else {
                alert('error fetching all opportunity');
            }
        }
    };

    request2.open('GET', '/allopportunitycount', true);
    request2.send(null);

    var request3 = new XMLHttpRequest();
    request3.onreadystatechange = function() {
        if (request3.readyState === XMLHttpRequest.DONE) {
            if (request3.status === 200) {
                // loadLoggedInUser(this.responseText);
                document.getElementById('membership').innerHTML = JSON.parse(this.responseText);
            } else {
                alert('error fetching all members');
            }
        }
    };

    request3.open('GET', '/allmemberscount', true);
    request3.send(null);

}
loadLoginForm();
displayreport();