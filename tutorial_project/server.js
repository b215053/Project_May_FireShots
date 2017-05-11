var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var bodyParser = require('body-parser'); //parsing post request data using JSON
var multer = require('multer'); //for file  uploading system
var config = {
    user: 'postgres',
    database: 'test_db',
    host: 'localhost',
    port: '5432',
    password: 'abhilash'
};
//var global_id_control = 0;
var app = express();
var pool = new Pool(config);
//var pid;
//var photoid;
//var controlwrite=0;
app.use(bodyParser.json());
app.use(morgan('short'));
//for photo upload 
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads'); //do create a uploads  folder otherwise it will show  error  uploading the file.
    },
    filename: function(req, file, callback) {
        var str = file.originalname;

       /* var i = 0;
        var k;
        for (; str[i] != '.'; i++);
        console.log(str.substring(i + 1, str.length));
        var extension = str.substring(i + 1, str.length);
        //pid+extension;
        extension='.'+extension;
        photoid=pid+extension;*/
        console.log(str +' at time of uploading');
        callback(null, str);
    }
});
var upload = multer({ storage: storage }).single('userPhoto');
//end photo upload
app.get('/',function(req,res){
   res.sendFile(__dirname+'/index.html'); 
});
app.get('/dashboard',function(req,res){
   res.sendFile(__dirname+ '/dashboard.html'); 
});
app.get('/displayapt',function(req,res){
   
    pool.query('select * from test_call_history where appointment =1',function(err,result){
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
app.get('/display',function(req,res){
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
               console.log('here ypou '+profile_id);
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


