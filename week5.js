/*
 * 2019/10/09 Sehyun Hwang
 * sehyunny6@gmail.com
 * 
 * 1) insert data : http://localhost:8080/log?device=00&unit=00&type=T
 * 2) show data : http://localhost:8080/dump?count=10
 * 3) show graph : htpp://localhost:8080/graph?count=20
 */

var express = require('express');
var app = express();
fs=require('fs');

mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'me',
    password: 'mypassword',
    database: 'mydb'
})
connection.connect();

/* 1. insert DB through query */
function insert_sensor(device, unit, type, value, seq, ip) {
  obj = {};
  obj.seq = seq;
  obj.device = device;
  obj.unit = unit;
  obj.type = type;
  obj.value = value;
  obj.ip = ip.replace(/^.*:/, '')

  var query = connection.query('insert into sensors set ?', obj, function(err, rows, cols) {
    if (err) throw err;
    console.log("database insertion ok= %j", obj);
  });
}

app.get('/', function(req, res) {
  res.end('Nice to meet you');
});

app.get('/log', function(req, res) {
  r = req.query;
  console.log("GET %j", r);

  insert_sensor(r.device, r.unit, r.type, r.value, r.seq, req.connection.remoteAddress);
  res.end('OK:' + JSON.stringify(req.query));
});

/* 2. send data to client from DB */
app.get("/dump", function(req, res) {
  console.log("param=" + req.query);
  cnt=req.query.count;
  console.log("count=",cnt);

  if(cnt==undefined) cnt=256;

  var qstr = 'select * from sensors ';
  connection.query(qstr, function(err, rows, cols) {
    if (err) {
      throw err;
      res.send('query error: '+ qstr);
      return;
    }
	if(rows.length<cnt) cnt=rows.length;
    console.log("Got "+ cnt +" records");
    html = ""
    for (var i=rows.length-cnt; i< rows.length; i++) {
       html += JSON.stringify(rows[i])+"<br>";
    }
    res.send(html);
  });

});

/* 3. draw meaningful graph */
app.get('/graph', function (req, res) {
    console.log('got app.get(graph)');
    var html = fs.readFile('./graph.html', function (err, html) {
    html = " "+ html
    console.log('read file');
	cnt=req.query.count;

	if(cnt==undefined) cnt=256;

	console.log("count="+cnt);

    var qstr = 'select * from sensors ';
    connection.query(qstr, function(err, rows, cols) {
      if (err) throw err;
	  
	  if(rows.length<cnt) cnt=rows.length;

      var data = "";
      var comma = ""
      for (var i=rows.length-cnt; i< rows.length; i++) {
         r = rows[i];
         data += comma + "[new Date(2019,08-1,"+ r.id +",00,38),"+ r.value +"]";
         comma = ",";
      }
      var header = "data.addColumn('date', 'Date/Time');"
      header += "data.addColumn('number', 'Temp');"
      html = html.replace("<%HEADER%>", header);
      html = html.replace("<%DATA%>", data);

      res.writeHeader(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  });
})

// using port 8080
var server = app.listen(8080, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('listening at http://%s:%s', host, port)
});
