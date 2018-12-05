
# Contract Verification Plugin
The contract-verification-plugin integrates remix with the ability to verify contracts deployed from the remix-ide, with etherscan. The sooner a solidity developer learns of a smart contract deployment issue, the sooner they can understand it and make a correct fix.
The remix plugin API is based from https://github.com/yann300/remix-plugin


## Usage

* Use http://remix-alpha.ethereum.org/
* Go to Settings, Under plugins fill out this info:
```
{
    "title": "Contract Verification Plugin",
    "url": "http://remix-contract-verification.surge.sh"
}
```
* Click the Load button and you should see `Contract Verification Plugin` button appear
* Click the `Contract Verification Plugin` button to load the plugin into a small window
* Now click on the button you would like to perform the analysis


## Disclaimer
By using this plugin, you acknowledge that the compilation results from your contract will be sent over basic HTTP to a 3rd party server for analysis. And that the developers of the this plugin ARE NOT LIABLE to any LOSS, INJURY, HACKING , DATA LOSS, FINANCIAL LOSS, TIME LOSS and DATA CORRUPTION that may occur from your use of our plugin. You also acknowledge that this plugin is provided on an as-is basis and all functionality works as documented above.