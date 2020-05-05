

async function start() { 
    return await Promise.resolve("promise resolved");
 }

start().then((result) => {
    console.log(result)
}).catch((err) => {
    console.error(err);
});

let unused = "";

// class properties, need babel plugin (@babel/plugin-proposal-class-properties)
class Util {
    static id = Date.now();
    
}

console.log('Util Id: ', Util.id);