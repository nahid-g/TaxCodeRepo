# TaxCode
## Clone this repository.

## Run following command to install node-modules and dependecies
$ cd ~/fabric-samples/fabrcar/javascript  <br />
$ npm install

## Run following command to deploy chaincode

$ cd ~/fabric-samples/fabrcar/ <br />
$ ./startFabric.sh javascript 

## After deployment run following node files
$ cd ./javascript/ <br />
$ node enrollAdmin.js <br />
$ node registerUser.js

## Now, if you can run server by using following command
$ npm run dev
## You have to create admin and user separately to use both side of TaxCode webapp.
