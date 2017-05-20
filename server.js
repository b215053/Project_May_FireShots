var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var bodyParser = require('body-parser'); //parsing post request data using JSON
var multer = require('multer'); //for file  uploading system
var session = require('express-session'); //for cookies and session


var config = {
    user: 'postgres',
    database: 'VC_DataCenter',
    host: 'localhost',
    port: '5432',
    password: 'abhilash'
};
var date= new Date();
var strdate = date.toLocaleDateString();
console.log(strdate);
//var global_id_control = 0;
var app = express();
var pool = new Pool(config);
//var pid;
//var photoid;
//var controlwrite=0;
app.use(session({
    secret: 'VCBYFireShots',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));
//following url encoded for form element post data parsing
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('short'));
//for photo upload 5
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads'); //do create a uploads  folder otherwise it will show  error  uploading the file.
    },
    filename: function(req, file, callback) {
        var str = file.originalname;

          console.log(str +' at time of uploading');
        callback(null, str);
    }
});
var upload = multer({ storage: storage }).single('userPhoto');
//end photo upload
app.get('/',function(req,res){
    
   res.sendFile(path.join(__dirname,'html','Login.html')); 
});
app.get('/html/:filename',function(req,res){
   res.sendFile(path.join(__dirname,'html',req.params.filename));
    
});
app.get('/css/:filename',function(req,res){
   res.sendFile(path.join(__dirname,'css',req.params.filename));
    
});
app.get('/script/:filename',function(req,res){
   res.sendFile(path.join(__dirname,'script',req.params.filename));
    
});

app.post('/check-phone',function(req,res){
   var mob_no= req.body.user_in;
    console.log('mobile no'+mob_no);
    pool.query('select * from user_status where mobile_no = $1',[mob_no],function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
        else
            { //console.log(result.rows.length);
                res.send(JSON.stringify(result.rows.length));
            }
    });
});
app.post('/updatestage',function(req,res){
   var mob_no = req.body.phone_no;
    var stagetemp= req.body.member_pack;
        var stage= parseInt(stagetemp);
    pool.query('update user_status set stage=$1 where mobile_no = $2',[stage,mob_no],function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
        else
            {
                res.send('Query successful !');
            }
    });
});
app.get('/filter-query/:gender/:criteria/:value',function(req,res){
   
    var gender= req.params.gender;
    var criteria = req.params.criteria;
    var value= req.params.value;
   console.log(gender.toUpperCase());
    console.log(criteria.toUpperCase());
    console.log(value.toUpperCase());
    if(criteria.toUpperCase()==='CASTE')
        {
    pool.query('select * from user_details where upper(gender)=upper($1) and upper(caste)=upper($2)',[gender,value],function(err,result){
    
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
        }
    if(criteria.toUpperCase()==='RELIGION')
        {
    pool.query('select * from user_details where upper(gender)=upper($1) and upper(religion)=upper($2)',[gender,value],function(err,result){
    
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
        }
    if(criteria.toUpperCase()==='MARITAL-STATUS')
        {
    pool.query('select * from user_details where upper(gender)=upper($1) and upper(marital_status)=upper($2)',[gender,value],function(err,result){
    
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
        }
    if(criteria.toUpperCase()==='MOTHER-TONGUE')
        {
    pool.query('select * from user_details where upper(gender)=upper($1) and upper(mother_tongue)=upper($2)',[gender,value],function(err,result){
    
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
        }
    if(criteria.toUpperCase()==='AGE')
        {
    pool.query('select * from user_details where upper(gender)=upper($1) and age<=($2)',[gender,value],function(err,result){
    
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
        }
    if(criteria.toUpperCase()==='LOCATION')
        {
    pool.query('select * from user_details where upper(gender)=upper($1) and upper(city)=upper($2)',[gender,value],function(err,result){
    
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
        }
    if(criteria.toUpperCase()==='EDUCATION')
        {
    pool.query('select * from user_details where upper(gender)=upper($1) and upper(education)=upper($2)',[gender,value],function(err,result){
    
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                console.log('here');
                res.send(JSON.stringify(result.rows));
            }
    });
        }






});
app.get('/viewallprospects',function(req,res){
   pool.query('select * from user_status where stage >=1',function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
       else
           {
               res.send(JSON.stringify(result.rows));
           }
   }) ;
});
//login_logout_section
app.post('/create-user', function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    pool.query('INSERT INTO emp_details (username, password) VALUES ($1, $2)', [username, password], function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            res.send('User successfully created: ' + username);
        }
    });
});

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    pool.query('SELECT * FROM emp_details WHERE username = $1', [username], function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            if (result.rows.length === 0) {
                res.status(403).send('username/password is invalid');
            } else {
                // Match the password
                var dbString = result.rows[0].password;
                
                if (password === dbString) {

                    // Set the session
                    req.session.auth = { username: result.rows[0].username}; //set_cookie
                   

                    res.send('Correct credentials');

                } else {
                    res.status(403).send('username/password is invalid');
                }
            }
        }
    });
});
app.post('/quickadd',function(req,res){
   var pid= req.body.pid;
    var mob_no=req.body.mob_no;
    var email= req.body.email;
    var person_of_c = req.body.person_of_c;
    var relation = req.body.relation;
    var address= req.body.address;
    var city = req.body.city;
    var gender=req.body.gender;
    var username = req.session.auth.username;
    var stage=0;
    
    pool.query('insert into user_details (profile_id,person_of_contact,mobile_no,email,address,relation_with_candidate,city,gender) values($1,$2,$3,$4,$5,$6,$7,$8)',[pid,person_of_c,mob_no,email,address,relation,city,gender],function(err,result){
       if(err)
           {
               res.status(500).send(err.toString()+'<br><h3>Kindly Go Back on your browser and take required measures</h3>');
           }
        else
            {
                
                pool.query('insert into user_status values ($1,$2,$3,$4,$5)',[pid,person_of_c,mob_no,username,stage],function(err,result){
                   if(err)
                       {
                           res.status(500).send(err.toString()+'<br><h3>Kindly Go Back on your browser and take required measures</h3>')
                       }
                    else
                        {
                            var htmltemplate = ` <h3> Profile Successfully Added </h3><br><a href="/html/dashboard.html">Click to go on Dashboard !</a>`;
                res.send(htmltemplate);
                        }
                });
                
            }
    });
    
});
app.get('/user_details/:id',function(req,res){
   var pid= req.params.id;
    
    pool.query('select * from user_details where profile_id=$1',[pid],function(err,result){
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
});
app.get('/callhistory/:id',function(req,res){
   var pid= req.params.id;
    
    pool.query('select * from call_walkin_history where profile_id=$1',[pid],function(err,result){
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
});
app.get('/displayapt',function(req,res){
   
   pool.query('select * from call_walkin_history',function(err,result){
      if(err)
          {
              res.status(500).send(err.toString());
              
          }
       else
           {   
               var d= result.rows[0].contact_date.toDateString();
               console.log(d);
               res.send(JSON.stringify(result.rows));
           }
   });
    
});
//testapi
app.get('/checkpopup',function(req,res){
   pool.query('select * from emp_details', function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
       else
           {
               res.send(JSON.stringify(result.rows));
           }
   }) ;
});
app.post('/checkupdate',function(req,res){
    var profile_id=req.body.profile_id;
   var type =  req.body.type;
    var mob_no=req.body.mob_no;
    var contact_date = req.body.cdate;
    var call_details = req.body.call_details;
    var itype= req.body.itype;
    var call_resp= req.body.response;
    var apt= req.body.apt;
    var next_date= req.body.fdate;
    var stage= req.body.stage;
    
  /*  console.log('pid'+profile_id);
    console.log('type'+type);
    console.log(mob_no);
    console.log(contact_date);
    console.log(call_details);
    console.log(itype);
    console.log(call_resp);
    console.log(apt);
    console.log(next_date);
    console.log(stage);
    res.end();*/
    pool.query('insert into call_walkin_history values($1,$2,$3,$4,$5,$6,$7,$8,$9)',[profile_id,contact_date,mob_no,call_details,itype,call_resp,next_date,apt,type],function(err,result){
       if(err)
           {
               res.staus(500).send(err.toString());
           }
        else
            {  
                if(stage==='3'||stage==='4')
                {
                   res.redirect('/html/dashboard.html');
                    
                }
             else
                 {
                pool.query('update user_status set stage=$1 where profile_id=$2',[stage,profile_id],function(err,result){
                   if(err)
                       {
                           res.staus(500).send(err.toString());
                       }
                    else
                        {
                            res.redirect('/html/dashboard.html');
                        }
                });
                 }
            }
    });
});
app.get('/cwupdate/:id',function(req,res){
   
    var pid= req.params.id;
    
    var htmltemplate=`<!DOCTYPE html>
<style>

</style>
<html>

<head>
    <title>
        Call/Walkin Update
    </title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>

<body>
    <div class="container">
        <div class="col-sm-12" style="text-align:right">
            <img src="/uploads/logol.jpg" style="float:left;height:60px;width:300px;margin-left:-60px" />

            <div id="logout">
                <br>

            </div>
        </div>
    </div>
    <nav class="navbar navbar-inverse">
        <div class="container-fluid">

            <ul class="nav navbar-nav">
                <li><a href="/html/dashboard.html">Dashboard</a></li>
                <li><a href="/html/leads.html">Leads</a></li>
                <li><a href="/html/enquiry2.html">Create New Enquiry</a></li>
                <li><a href="/html/prospect.html">Prospects</a></li>
                <li><a href="/html/payment.html">Payment</a></li>
                <li><a href="/html/query.html">Payment</a></li>

            </ul>

        </div>

    </nav>
    <div class="container">
        <h4 style="text-decoration:underline;text-align:center"><b>Previous History for Profile ID:<span id="pid">${pid}</span> </b></h4>
        <div class="col-sm-12" id="olddetails">
        </div>
    </div>
    <div class="container" style="background-color:azure">
        <h4 style="text-decoration:underline;text-align:center"><b>Call/Walk-in Update</b></h4>
        <div class="col-sm-12" id="calldetails">

            <form class="form-horizontal" action="/checkupdate" method="POST">
                <div class="form-group">
                    <label class="col-sm-2" for="profile_id">Profile ID:</label>
                    <div class="col-sm-offset -2 col-sm-10">

                        <label><input type="text" name="profile_id" value="${pid}"></label>


                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2" for="type">Type:</label>
                    <div class="col-sm-offset -2 col-sm-10">

                        <label><input type="checkbox" name="type" value="0"> Call</label>
                        <label><input type="checkbox" name="type" value="1"> Walk-in</label>

                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2" for="mobile">Phone:</label>

                    <div class="col-sm-10" id="myphone">
                        <input type="mobile" class="form-control" id="phone" name="mob_no" placeholder="Enter Contact No.">
                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2" for="contacteddate">Contacted On:</label>
                    <div class="col-sm-10" id="contact">
                        <input type="text" class="form-control" placeholder="Format (YYYY-MM-DD)" name="cdate" </input>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-sm-2" for="calldetail">Call Details:</label>
                    <div class="col-sm-10">
                        <textarea class="form-control" rows="5" name="call_details" placeholder="Enter Call Details"></textarea>
                    </div>
                </div>

                <div class="form-group">
                    <label class="col-sm-2" for="interaction">Interaction Type:</label>
                    <div class="col-sm-offset -2 col-sm-10">

                        <label><input type="checkbox" name="itype" value="outbound"> Outbound</label>
                        <label><input type="checkbox" name="itype" value="inbound"> Inbound</label>
                        <label><input type="checkbox" name="itype" value="walkin"> Walk-in</label>
                    </div>
                </div>


                <div class="form-group">
                    <label class="col-sm-2" for="callresponse">Call Response:</label>
                    <div class="col-sm-offset -2 col-sm-10">

                        <label><input type="checkbox" name="response" value="ptp" > PTP</label>
                        <label><input type="checkbox" name="response" value="nrpc"> NRPC</label>
                        <label><input type="checkbox" name="response" value="callback"> CallBack</label>
                        <label><input type="checkbox" name="response" value="not interested"> Not Interested</label>

                    </div>
                </div>
                <div class="form-group">
                    <label class="col-sm-2" for="appointment">Appointment :</label>
                    <div class="col-sm-offset -2 col-sm-10">

                        <label><input type="checkbox" name="apt" value="0" > No Appointment</label>

                        <label><input type="checkbox" name="apt" value="1"> Schedule Appointment</label>
                    </div>
                </div>



                <div class="form-group">
                    <label class="col-sm-2" for="stage">Stage:</label>
                    <div class="col-sm-offset -2 col-sm-10">

                        <label><input type="checkbox" name="stage" value="0"> Lead</label>
                        <label><input type="checkbox" name="stage" value="1"> Prospect</label>
                        <label><input type="checkbox" name="stage" value="2"> Opportunity</label>
                        <label><input type="checkbox" name="stage" value="3"> Already Member</label>
                        <label><input type="checkbox" name="stage" value="4"> Retain Stage </label>

                    </div>
                </div>


                <div class="form-group">
                    <label class="col-sm-2" for="followupdate">Next Follow Up Date:</label>
                    <div class="col-sm-10" id="followup">

                        <input type="text" class="form-control" placeholder="Format (YYYY-MM-DD)" name="fdate" </input>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-5 col-sm-12">
                        <button type="submit" class="btn btn-default">Submit</button>
                    </div>

                </div>

            </form>

        </div>
    </div>
<script type='text/javascript' src='/script/update.js'></script>   


</body>

</html>` ;
    res.send(htmltemplate);
});
app.get('/allleadscount',function(req,res){
   pool.query('select * from user_status where stage=0',function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
       else
           {
               res.send(JSON.stringify(result.rows.length));
           }
   }) ;
});
app.get('/allprospectscount',function(req,res){
   pool.query('select * from user_status where stage=1',function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
       else
           {
               res.send(JSON.stringify(result.rows.length));
           }
   }) ;
});
app.get('/allopportunitycount',function(req,res){
   pool.query('select * from user_status where stage=2',function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
       else
           {
               res.send(JSON.stringify(result.rows.length));
           }
   }) ;
});
app.get('/allmemberscount',function(req,res){
   pool.query('select * from user_status where stage>=3',function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
       else
           {
               res.send(JSON.stringify(result.rows.length));
           }
   }) ;
});


app.get('/getlatest',function(req,res){
   pool.query('select * from call_walkin_history ',function(err,result){
       if(err)
           {
               res.send('error');
           }
       else
           {   
               //result.rows[0].contact_date=result.rows[0].contact_date+1;
               console.log(result.rows[0].contact_date);
               res.send(result.rows);
           }
   }) ;
});

app.get('/check-login', function(req, res) {
    if (req.session && req.session.auth && req.session.auth.username) {
        // Load the user object
        pool.query('SELECT * FROM emp_details WHERE username= $1', [req.session.auth.username], function(err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                res.send(result.rows[0].username);
            }
        });
    } else {
        res.status(400).send('You are not logged in');
    }
});
app.get('/getlatest/:id',function(req,res){
  // var username = req.session.auth.username;
   // var username='testuser';
    console.log('welcome');
    pool.query('select * from call_walkin_history where profile_id=$1 order by contact_date desc',[req.params.id],function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
});
app.get('/viewprospects',function(req,res){
   var username = req.session.auth.username;
    pool.query('select * from user_status where stage >=1 and emp_username= $1',[username],function(err,result){
       
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
    
    
});
app.get('/viewleads',function(req,res){
   var username = req.session.auth.username;
    pool.query('select * from user_status where stage =0 and emp_username= $1',[username],function(err,result){
       
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
    
    
});
app.get('/viewallleads',function(req,res){
   
    pool.query('select * from user_status where stage =0',function(err,result){
       
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows));
            }
    });
    
    
});
app.get('/leadscount',function(req,res){
   var username = req.session.auth.username;
   // var username = 'testuser';
    pool.query('select * from user_status where emp_username = $1 and stage =0',[username],function(err,result){
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows.length));
            }
    });
});
app.get('/prospectscount',function(req,res){
   var username = req.session.auth.username;
   //var username = 'testuser';
    pool.query('select * from user_status where emp_username = $1 and stage >0',[username],function(err,result){
        if(err)
            {
                res.status(500).send(err.toString());
            }
        else
            {
                res.send(JSON.stringify(result.rows.length));
            }
    });
});


app.get('/logout', function(req, res) {
    delete req.session.auth;
    res.send('<http><head><meta http-equiv="Refresh" content="1; /"><h1>Logged Out</h1></head>');
});

app.get('/displayapt',function(req,res){
   var d= new Date.now();
    console.log(d.toString());
    pool.query('select * from call_walkin_history where appointment =1',function(err,result){
                    if(err)
                    {
                        res.status(500).send(err.toString());
                        
                    }
                    else
                        {  //controlwrite=0;
                            res.send(JSON.stringify(result.rows));
                        }
    });
});
app.post('/api/photo/:id', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        else
            {   if(req.file)
                {
               console.log(req.file.originalname);
                console.log(req.file.filename);
                //console.log(req.file.userPhoto.name);
                //console.log(req.files.extension);
                //console.log(req.files.encoding);
                pool.query('update test set dp=$1 where profile_id=$2',[req.file.filename,req.params.id],function(err,result){
                if(err)
                    {
                        res.status(500).send(err.toString());
                        
                    }
                    else
                        {  //controlwrite=0;
                            res.redirect('/redirect');
                        }
                
                
            });
                }
             else
                 {
                     var htmltemplate = ` <h1> You are uploading a empty file ! </h1><br><a href="/redirect">To Skip </a> <br>
                                                <a href='/upload_photo_form/${req.params.id}'>Click to upload it again </a>`;
                     res.send(htmltemplate);
                 }
            }
    });
});


app.get('/uploads/:photoid',function(req,res){
    
    if(req.params.photoid==='blank')
        res.send(' You have not uploaded the photograph');
    else
   res.sendFile(path.join(__dirname,'uploads',req.params.photoid)); 
});
app.get('/upload_photo_form/:id',function(req,res){
    var id=req.params.id;
   var htmltemplate= `<div style="text-align=center">
          <span id="profileId">${id}</span>
          <form id        =  "uploadForm"
     enctype   =  "multipart/form-data"
     action    =  "/api/photo/${id}"
     method    =  "post"
>
<input type="file" name="userPhoto" />
<input type="submit" value="Upload Image" name="submit">
</form>
<br><span><a href='/redirect'>Skip</a></span></div>`;
    res.send(htmltemplate);
    
});
app.get('/redirect',function(req,res){
   var htmltemplate= `<div style="text-align:center">
                        <h2> Done !</h2><br>
                          <a href='/'>Click to return to main menu !</a></div>`;
    res.send(htmltemplate);
});
/*app.get('/display',function(req,res){
    pool.query('SELECT * FROM test',function(err,result){
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(JSON.stringify(result.rows));    
           }
       }); 
});
/*app.get('/pid_write/:pid',function(req,res){  //no need of global pid writing
   
    pid= req.params.pid;
    console.log(pid);
    res.end('done!');
});*/ 
app.get('/autoid',function(req,res){
    
   pool.query('select * from auto_id where entry=1',function(err,result){
       if(err)
           {
               res.status(500).send(err.toString());
           }
       else
           {  //controlwrite=1;
                 var profile_id = result.rows[0].id;
               console.log('here you '+profile_id);
               var integer_id=0;
            for(var i=2;i<profile_id.length;i++)
                {
                    var k= parseInt(profile_id[i]);
                    integer_id=integer_id*10+k;
                }
            integer_id+=1;
            profile_id=integer_id.toString();
            if(profile_id.length===5)
                profile_id='0'+profile_id;
            else
                if(profile_id.length===4)
                profile_id='00'+profile_id;
            else
                if(profile_id.length===3)
                profile_id='000'+profile_id;
            else
                if(profile_id.length===2)
                profile_id='0000'+profile_id;
            else
                profile_id='00000'+profile_id;
               console.log('change process');
               console.log('changed id'+profile_id);
               
            pool.query('update auto_id set id=$1 where entry=1',[profile_id],function(err,result){
                if(err)
                    {
                        res.status(500).send(err.toString());
                        
                    }
                    else
                        {
                            console.log('updated id');
                            
                        }
                  //  controlwrite=0;
                
            });
               
               res.send(JSON.stringify(result.rows));
               
           }
   }) ;
});
app.post('/create',function(req,res){
    
   var profile_id= req.body.profile_id;
    console.log(profile_id);
    var name= req.body.name;
    var phone= req.body.phone;
    var photo='blank';
   // while(controlwrite===1);
   // controlwrite=1;
    pool.query('insert into test (profile_id,name,mobile,dp) values ($1,$2,$3,$4)',[profile_id,name,phone,photo],function(err, result) {
        if (err) {
            res.status(500).send(err.toString());
        } else {
            
            console.log('data inserted !');
            
            res.send('done');
        }
    });
    
    
    
});
var port = 8086; // Use 8080 for local development because you might already have apache running on 80
app.listen(8086, function () {
  console.log(`test app listening on port ${port}!`);
});


