const express=require('express')
const app=express()
const port=3000
const fs=require('fs')

cnt=1

app.get('/',function(req,res){
	console.log(`got here, you are ${cnt++}`)
	res.send(`You are not supposed to be here`)
})

app.get('/update',function(req,res){
	v=req.query
	console.log(`api_key=${v.api_key},field1=${v.field1}`)
	res.send(`api_key=${v.api_key}, field1=${v.field1}`)

	api_key=v.api_key
	field1=v.field1
	datetime=new Date();

	fs.appendFile(`data.txt`, `${datetime}: ${api_key} ${field1}\n`, (err) => {
		if(err) throw err;
		console.log(`got value key=${api_key} value=${field1}`)
	});

})


app.get('/dump', function(req,res){
	fs.readFile(`data.txt`,'utf8', function(err,data){
		if(err) throw err
		console.log(data)

		cnt=req.query.count   // dump query count
		arr=data.split('\n')  // split data.txt line by line
		str=""
		if(arr.length-cnt>1) start=arr.length-1-cnt
		else start=0

		for(i=0+start;i<arr.length-1 ;i++){
			parse=arr[i].split(' ')
			csv=""

			// parsing 'Month' info from data.txt
			if(parse[1]=='Jan') month="01"
			else if(parse[1]=='Feb') month="02"
			else if(parse[1]=='Mar') month="03"
			else if(parse[1]=='Apr') month="04"
			else if(parse[1]=='May') month="05"
			else if(parse[1]=='Jun') month="06"
			else if(parse[1]=='Jul') month="07"
			else if(parse[1]=='Aug') month="08"
			else if(parse[1]=='Sep') month="09"
			else if(parse[1]=='Oct') month="10"
			else if(parse[1]=='Nov') month="11"
			else if(parse[1]=='Dec') month="12"

			// complete datetime info
			date=parse[3]+month+parse[2]
			// parsing 'Time' info from data.txt
			timeparse=parse[4].split(':')
			hour=timeparse[0]*1
			hour+=9
			if(hour>=24) hour -= 24
			hour += ""
			if(hour.length==1) hour="0"+hour

			time=hour+':'+timeparse[1]+':'+timeparse[2]	
			
			// complete csv format string to display on website
			csv=date+','+time+','+parse[7]+','+parse[8]
			
			if(i==0+start)
				str=csv
			else str=str+"<br>"+csv;
			
		}

		res.type('text/html')
		res.send(str)
	})
})

app.listen(port,()=> console.log(`Example app listening on port ${port}!`))






