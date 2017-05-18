 var pid = document.getElementById('pid').innerHTML;

 function memberdetails() {
     var request = new XMLHttpRequest();
     request.onreadystatechange = function() {
         if (request.readyState === XMLHttpRequest.DONE) {

             if (request.status === 200) {

                 var content = '';
                 var data = JSON.parse(this.responseText);
                 var i = 0;
                 for (; i < 1; i++) {
                     if (data[i].type_call_walkin === 0) {
                         content += `<p> <b>Type: Call</b></p>
                            <p><b>Profile ID: ${pid}</b></p>
                            <p><b>Contact: ${data[i].contact_no}</b></p>
                            <p><b>Last Follow-up Date: ${data[i].contact_date.split('T')[0]}</b></p>
                            <p><b>Interaction Type: ${data[i].interaction_type}</b></p>
                            <p><b>Response Type: ${data[i].call_walkin_response}</b></p>
                            <p><b>Call/Walk-in Details: ${data[i].call_walkin_details}</b></p>`;
                     } else {
                         content += `<p> <b>Type: Walk-in</b></p>
                         <p><b>Profile ID: ${pid}</b></p>
                            <p><b>Contact: ${data[i].contact_no}</b></p>
                            <p><b>Last Follow-up Date: ${data[i].contact_date.split('T')[0]}</b></p>
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

 /*function stage() {
     var st = document.getElementsByName("stage");
     var j = 0;
     for (var i = 0; i < st.length; i++) {
         if (st[i].checked) {
             j++;
             break;
         }
     }
     var s = st[i].value;
     if (j === 0) {
         f = 1;
         alert("Stage Missing");
     }
     j = 0;
     var request = new XMLHttpRequest();
     request.onreadystatechange = function() {
         if (request.readyState === XMLHttpRequest.DONE) {
             // Take some action
             if (request.status === 200) {
                 alert("Submission Successfull");

             } else {
                 var error = this.responseText;
                 alert( /*'Error! Could not submit.Check that Mobile number or  email  id  should  be unique.' error);
             }
             submitbtn.value = 'Success';
         }
     };

     //  var photo = document.getElementById('photo').value;
     request.open('POST', '/somethinngelse', true);
     request.setRequestHeader('Content-Type', 'application/json');
     request.send(JSON.stringify({ stage: s }));
     submitbtn.value = 'Wait...';

 }*/
 var btn = document.getElementById('submitbtn');
 btn.onclick = function() {
     updating();
 }

 function updating() {
     alert('run');

     var c = document.getElementById("calldetail").value;
     var x = document.getElementsByName("itype");
     var y = document.getElementsByName("response");
     var z = document.getElementsByName("rtype");
     var fd = document.getElementsByName("fdate");
     var fm = document.getElementsByName("fmonth");
     var fy = document.getElementsByName("fyear");
     var cd = document.getElementsByName("cdate");
     var cm = document.getElementsByName("cmonth");
     var cy = document.getElementsByName("cyear");
     var ph = document.getElementById("phone").value;
     var typ = document.getElementsByName("type");
     var st = document.getElementsByName("stage");
     var aptset = document.getElementById("apt");

     var i;
     var j = 0;
     var f;
     var apt = 0;
     for (i = 0; i < x.length; i++) {
         if (x[i].checked) {

             j++;
             break;
         }
     }
     var interaction = x[i].value;
     if (j === 0) {
         f = 1;
         alert("Interaction Type Missing");
     }
     j = 0;

     for (i = 0; i < y.length; i++) {
         if (y[i].checked) {

             j++;
             break;
         }

     }
     if (j === 0) {
         f = 1;
         alert("Response Missing");
     }
     var resp = y[i].value;
     if (aptset.checked) {
         apt = 1;
     }


     j = 0;
     for (i = 0; i < z.length; i++) {
         if (z[i].checked) {

             j++;
             break;
         }
     }
     var rt = z[i].value;
     if (j === 0) {
         f = 1;
         alert("Response Type Missing");
     }
     j = 0;

     for (i = 0; i < fd.length; i++) {
         if (fd[i].selected) {
             j++;
             break;
         }

     }
     var d1 = fd[i].value;
     if (j === 0) {
         f = 1;
         alert("Invalid Date");
     }
     j = 0;
     for (i = 0; i < fm.length; i++) {
         if (fm[i].selected) {
             j++;
             break;
         }
     }
     var m1 = fm[i].value;
     if (j === 0) {
         f = 1;
         alert("Invalid Date");
     }
     j = 0;
     for (i = 0; i < fy.length; i++) {
         if (fy[i].selected) {
             j++;
             break;
         }

     }
     var y1 = fy[i].value;
     if (j === 0) {
         f = 1;
         alert("Invalid Date");
     }
     j = 0;
     for (i = 0; i < cd.length; i++) {
         if (cd[i].selected) {

             j++;
             break;
         }
     }
     var d2 = cd[i].value;
     if (j === 0) {
         f = 1;
         alert("Invalid Date");
     }
     j = 0;
     for (i = 0; i < cm.length; i++) {
         if (cm[i].selected) {
             j++;
             break;
         }
     }
     var m2 = cm[i].value;
     if (j === 0) {
         f = 1;
         alert("Invalid Date");
     }
     j = 0;
     for (i = 0; i < cy.length; i++) {
         if (cy[i].selected) {
             j++;
             break;
         }
     }
     var y2 = cy[i].value;
     if (j === 0) {
         f = 1;
         alert("Invalid Date");
     }
     j = 0;

     for (i = 0; i < typ.length; i++) {

         if (typ[i].checked) {
             j++;
             break;
         }
     }
     var t = typ[i].value;
     if (j === 0) {
         f = 1;
         alert("Type Missing");
     }
     j = 0;
     for (i = 0; i < st.length; i++) {
         if (st[i].checked) {
             j++;
             break;
         }
     }
     var s = st[i].value;
     if (j === 0) {
         f = 1;
         alert("Stage Missing");
     }
     var followdate = y1 + "-" + m1 + "-" + d1;
     var contactdate = y2 + "-" + m2 + "-" + d2;

     //You can check from below alert boxes about sending values
     alert(contactdate);
     alert(ph);
     alert(c);
     alert(interaction);
     alert(resp);
     alert(followdate);
     alert(apt);
     alert(t);
     // console.log(contact_date);
     // console.log(interaction);
     // console.log(call_walkin_response);
     if (f !== 1) {
         var request = new XMLHttpRequest();
         request.onreadystatechange = function() {
             if (request.readyState === XMLHttpRequest.DONE) {
                 // Take some action
                 if (request.status === 200) {
                     alert("Submission Successfull");

                 } else {
                     var error = this.responseText;
                     alert( /*'Error! Could not submit.Check that Mobile number or  email  id  should  be unique.'*/ error);
                 }
                 submitbtn.value = 'Success';
             }
         };

         //  var photo = document.getElementById('photo').value;
         request.open('POST', '/updatecallwalk', true);
         request.setRequestHeader('Content-Type', 'application/json');
         request.send(JSON.stringify({ profile_id: pid, contact_date: contactdate, contact_no: ph, call_walkin_details: c, interaction_type: interaction, call_walkin_response: resp, next_followup_date: followdate, appointment: apt, type_call_walkin: t }));
         submitbtn.value = 'Wait...';

     }
 }


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