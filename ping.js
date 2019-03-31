const { spawn } = require("child_process");
const url = "google.com";

const ping = spawn("ping", [url]);

ping.stdout.on("data", handleData);
ping.stderr.on("data", e => console.error(e.toString()));

process.on('SIGINT', ping.kill);

function handleData(data) {
  try {
    // Strings only please
    data = data.toString();
  
    // Check if this is the first line
    if(data.match(/^PING/g)) {
      console.log('Started pinging');
      return;
    }
  
    // Check if these are the ping stats
    if(
      data.match(/^---/g) ||
      data.match(/^\d+ packets transmitted/g) ||
      data.match(/^round trip/g)
    ) return;
  
    data = data.split('\n')[0];
    ms = data.match(/time=(\d+\.\d+) ms/g);
    console.log(parseFloat(ms[0].split('=')[1].split(' ')[0]));
  
    return; 
  } catch(e) {
    return e;
  }
}
