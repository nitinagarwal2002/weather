const http=require("http");
const fs =require("fs");
var requests=require("requests");
const homeFile= fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgval)=>{
    let temperature=tempVal.replace("{%tempval%}",orgval.main.temp);
    temperature=temperature.replace("{%tempmin%}",orgval.main.temp_min);
    temperature=temperature.replace("{%tempmax%}",orgval.main.temp_max);
    temperature=temperature.replace("{%location%}",orgval.name);
    temperature=temperature.replace("{%country%}",orgval.sys.country);
    temperature=temperature.replace("{%tempStatus%}",orgval.weather[0].main);

    return temperature;

}
const server = http.createServer((req,res) => {
    if(req.url =="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=chennai&units=metric&appid=1033c2b270c147e379126af4c40db187")
        .on("data",(chunk)=>{
            const objdata=JSON.parse(chunk);
            const arrData=[objdata];
           // console.log(arrData[0].main.temp);
           const realTimeData =arrData.map((val)=>replaceVal(homeFile,val)).join("");
           res.write(realTimeData);
        console.log(realTimeData);
        })
        
        .on("end",(err)=>{
            if(err) return console.log("connection closed",err);
            console.log("end");
        });
    }else{
        res.end("File not found");
    }
});
server.listen(8006,"127.0.0.1");
