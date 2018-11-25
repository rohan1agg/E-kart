Read difference between dependencies, peerDependencies, devDependencies in package.json
dont commit node_modules folder to your github, to prevent it from getting committed to github use .gitignore file
read difference between yarn and npm

we are using nodemon to automatically restart the server when we change any file
we are using babel to transpile ES6 code to ES5 code, since nodejs doesnt support all ES6 features as of now, read more about babel

the following command means: "nodemon -w src --exec \"babel-node src\""
run nodemon on "src" folder i.e. it will watch src folder for any file changes if anything changes run "babel-node src" and restart the server with src/index.js file - read about nodemon.json file
"babel-node src" means run babel to transpile es6 to es5 code on src folder - read about .babelrc file 


"prestart" script in package.json is automatically executed when you run yarn start


to start this server use yarn start or yarn start:debug (see whats the difference between the both)