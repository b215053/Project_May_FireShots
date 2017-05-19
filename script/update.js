 function memberdetails() {
     var pid = document.getElementById('pid').innerHTML;
     var request = new XMLHttpRequest();
     request.onreadystatechange = function() {
         if (request.readyState === XMLHttpRequest.DONE) {

             if (request.status === 200) {

                 var content = '';
                 var data = JSON.parse(this.responseText);
                 var i = 0;
                 for (; i < 1; i++) {
                     if (data[i].type_call_walkin === 1) {
                         content += `<p> <b>Type: Call</b></p>
                            <p><b>Contact: ${data[i].contact_no}</b></p>
                            <p><b>Last Follow-up Date: ${data[i].contact_date}</b></p>
                            <p><b>Interaction Type: ${data[i].interaction_type}</b></p>
                            <p><b>Response Type: ${data[i].call_walkin_response}</b></p>
                            <p><b>Call/Walk-in Details: ${data[i].call_walkin_details}</b></p>`;
                     } else {
                         content += `<p> <b>Type: Walk-in</b></p>
                            <p><b>Contact: ${data[i].contact_no}</b></p>
                            <p><b>Last Follow-up Date: ${data[i].contact_date}</b></p>
                            <p><b>Interaction Type: ${data[i].interaction_type}</b></p>
                            <p><b>Response Type: ${data[i].call_walkin_response}</b></p>
                            <p><b>Call/Walk-in Details: ${data[i].call_walkin_details}</b></p>`;
                     }


                 }

                 document.getElementById('olddetails').innerHTML = content;
             } else if (request.status === 403) {
                 alert('something went wrong on the server');
             } else if (request.status === 500) {
                 alert('Something went wrong on the server');

             } else {

                 alert('Something went wrong');

             }
         }
     };
     request.open('GET', `/getlatest/${pid}`, true);
     request.send(null);


 }
 memberdetails();


 function loadLoggedInUser(username) {

     document.getElementById("logout").innerHTML = `<p>Hi,${username}</p><a href='/logout'>Logout</a>`;

 }

 function loadLogin() {
     // Check if the user is already logged in
     var request = new XMLHttpRequest();
     request.onreadystatechange = function() {
         if (request.readyState === XMLHttpRequest.DONE) {
             if (request.status === 200) {
                 loadLoggedInUser(this.responseText);

             }

         }
     };

     request.open('GET', '/check-login', true);
     request.send(null);
 }
 loadLogin();