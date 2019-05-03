const { createIframeClient } = remixPlugin
const devMode = { port: 8080 }
const client = createIframeClient({ devMode });

var compileMsg = "Compiling smart contract, please wait...";

async function do_post(info, cb) {
  const network = await client.call('network', 'detectNetwork')
  var etherscanApi
  if (network) {
    if (network.name === 'main') {
      etherscanApi = `https://api.etherscan.io/api`;
    } else {
      etherscanApi = `https://api-${network.name.toLowerCase()}.etherscan.io/api`;
    }
  } else {
    return alert('no known network to verify against')
  }

  const name = document.getElementById('verifycontractname').value;
  var contractMetadata = info.data.contracts[info.fileName][name]['metadata'] 
  contractMetadata = JSON.parse(contractMetadata)
  var data = {
      apikey: 'CC4YVQGTC45H2IXX6BDUNP54TXJHKVMWY5',                     //A valid API-Key is required        
      module: 'contract',                             //Do not change
      action: 'verifysourcecode',                     //Do not change
      contractaddress: document.getElementById('verifycontractaddress').value, //Contract Address starts with 0x...     
      sourceCode: info.source.sources[info.fileName].content,             //Contract Source Code (Flattened if necessary)
      contractname: name,         //ContractName
      compilerversion: contractMetadata.compiler.version,   // see http://etherscan.io/solcversions for list of support versions
      optimizationUsed: contractMetadata.settings.optimizer.enabled, //0 = Optimization used, 1 = No Optimization
      runs: contractMetadata.settings.optimizer.runs,                                      //set to 200 as default unless otherwise         
      constructorArguements: document.getElementById('verifycontractarguments').value,   //if applicable
  };
  try{
    console.log(data)
    const response =  await fetch(etherscanApi,{ method: 'POST', headers: { "Content-Type": "application/json; charset=utf-8"},body: data});
    console.log(response);
    cb(response);
  }
  catch (error) {
    console.log(error);
  }
}


async function do_get(data, cb) {

  try{
    const response =  await (await fetch(etherscanApi,{ method: 'POST', headers: { "Content-Type": "application/json; charset=utf-8"},body: data})).json();

    cb(response);

  }
  catch (error) {
    console.log(error);
  }
 
}

function handleCompileSuccess(result) {
  if(result === null){
     document.querySelector('div#results').innerHTML = `No compile results found for this contract, please make sure <br> the contract compiles correctly.`;
     return;
  }
  document.querySelector('div#results').innerHTML = `Verifying contract. Please wait...`;
  // fetch results
  do_post(result, function(res) {
        document.querySelector('div#results').innerHTML = res.body;    
  });
   

}

let latestCompilationResult = null
window.onload = function () {

  client.onload(() => {
    console.log('loaded')
  })

  console.log("LOADED CONTRACT VERIFICATION PLUGIN");
  client.on('solidity', 'compilationFinished', function (fileName, source, languageVersion, data) {
    latestCompilationResult = { fileName, source, languageVersion, data }
    console.log("GOT A COMPILE RESULT: ");
    console.log(result);
  });

  client.on('udapp', 'sendTransaction', function (transaction) {
    console.log("GOT A TRANSACTION ");
    console.log(transaction);
  });



  document.querySelector('button#verifycontract').addEventListener('click', async function () {
    var div = document.querySelector('div#results');
    div.innerHTML = compileMsg;
    console.log(latestCompilationResult);
    if(latestCompilationResult) {
      if(document.querySelector('input[id="verifycontractaddress"]').value.trim() !== "") {
        handleCompileSuccess(latestCompilationResult);
      }
      else {
        alert("Please enter a valid contract address");
      }
    }
    else{
      alert('no compilation result available')
    }
  });

}
 