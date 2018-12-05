var extension = new window.RemixExtension();
var compileMsg = "Compiling smart contract, please wait...";

async function do_post(data, cb) {
  var etherscanApi = "https://api.etherscan.io/api";
  var contractData = data[0];
  var data = {
      apikey: '2GTVV7HHTK8CCG2NFK5NRXYPY6DKINJH48',                     //A valid API-Key is required        
      module: 'contract',                             //Do not change
      action: 'verifysourcecode',                     //Do not change
      contractaddress: $('#contractaddress').val(),   //Contract Address starts with 0x...     
      sourceCode: contractData.sources[contractData.sources.target].content,             //Contract Source Code (Flattened if necessary)
      contractname: contractData.sources.target.split("/").pop(),         //ContractName
      compilerversion: $('#compilerversion').val(),   // see http://etherscan.io/solcversions for list of support versions
      optimizationUsed: $('#optimizationUsed').val(), //0 = Optimization used, 1 = No Optimization
      runs: 200,                                      //set to 200 as default unless otherwise         
      constructorArguements: $('#constructorArguements').val(),   //if applicable
  };
  try{
    const response =  await fetch(analysisServerUrl,{ method: 'POST', headers: { "Content-Type": "application/json; charset=utf-8"},body: JSON.stringify(data)});
    console.log(response);
    cb(response);

  }
  catch (error) {
    console.log(error);
  }
 
}


async function do_get(data, cb) {

  try{
    const response =  await (await fetch(analysisServerUrl,{ method: 'POST', headers: { "Content-Type": "application/json; charset=utf-8"},body: JSON.stringify(data)})).json();

    cb(response);

  }
  catch (error) {
    console.log(error);
  }
 
}

function handleCompileSuccess(result) {
  if(result[0] === null){
     document.querySelector('div#results').innerHTML = `No compile results found for this contract, please make sure <br> the contract compiles correctly.`;
     return;
  }
  document.querySelector('div#results').innerHTML = `Verifying contract. Please wait...`;
  // fetch results
  do_post(result, function(res) {

        document.querySelector('div#results').innerHTML = res['output'];
    
  });
   

}

function handleCompileFailure(error) {
  document.querySelector('div#results').innerHTML = error;
}



window.onload = function () {
  console.log("LOADED CONTRACT VERIFICATION PLUGIN");
  extension.listen('compiler', 'compilationFinished', function (result) {
    console.log("GOT A COMPILE RESULT: ");
    console.log(result);
  });

  extension.listen('txlistener', 'newTransaction', function (transaction) {
    console.log("GOT A TRANSACTION ");
    console.log(transaction);
  });



  document.querySelector('input#verify-contract').addEventListener('click', function () {
    var div = document.querySelector('div#results');
    div.innerHTML = compileMsg;
    extension.call('compiler', 'getCompilationResult', [], function (error, result ) {
      console.log(result);
        if(result) {
          if(document.querySelector('input[id="verify-contract-address"]').value.trim() !== "") {
            handleCompileSuccess(result);
          }
          else {
            handleCompileFailure("Please enter a valid contract address");
          }
         // 
        }
        else{
          handleCompileFailure(error);
        }

    });
  });

}
