# orchis-login-web

[![Build Status](https://jenkins.standard.com:8443/buildStatus/icon?job=ITSD/orchis-login-web/develop&subject=develop)](https://jenkins.standard.com:8443/job/ITSD/job/orchis-login-web/job/develop/)
[![Build Status](https://jenkins.standard.com:8443/buildStatus/icon?job=ITSD/orchis-login-web/release-candidate&subject=release-candidate)](https://jenkins.standard.com:8443/job/ITSD/job/orchis-login-web/job/release-candidate/)

## NPM Install
To install project dependencies, type `npm install`.

If you run into issues with dependencies not being found, ensure that the following line is found in your
npm configuration file, generally `~/.npmrc`:
```
registry=https://nexus.standard.com:8443/nexus/repository/npm-all/
```
if you got a error with the certificate, you have to run:
```shell script
npm config set strict-ssl false -g
```

If you are working in a windows machine, you have to create the npmrc file like:
```shell script
npm i -g npmrc
```

## Development server
For a dev server, run the following commands:

Command             | Purpose
------------------- | -----
`ng serve`          | default behavior (CJS calls will fail)
`npm run start`     | same as above
`npm run start-ssl` | run dev server with CJS integration to b/e (works only on StandardNet)

Navigate to `https://cjs-demo.local.standard.com:4200/`. The app will automatically reload if you change any of the source files.

#### why not `localhost`
You can still use `localhost` when you don't need CJS integration with b/e.
For CJS integration with the OrchIS b/e to work, the hostname must  
match the cookie domain (i.e. standard.com for INT and other environments).
To make it happen, modify your `/etc/hosts` file (or similar for your OS)
to add an alias to your localhost entry.  It should look similar to:

```
127.0.0.1	localhost cjs-demo.local.standard.com
``` 

##### Windows Config:
If you are running a windows development environment the hosts settings can be configured also. Open a text editor as `administrator` and open the directory:

```
C:\Windows\System32\drivers\etc\hosts
```
In the hosts file change the line with `127.0.0.1` IP to the following, or if one exists that you want to keep, you can add another line:
```
127.0.0.1       cjs-demo.local.standard.com
```

#### Using SSL
The second piece to this puzzle is the use of SSL - this is required
by the OrchIS b/e configuration.  So please make sure you use `https`:

```
https://cjs-demo.local.standard.com:4200/
```

`npm run serve-ssl` will start your local server with SSL support.



## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests


Command              | Purpose
-------------------- | --------
`ng test`            | Default angular-cli behavior executing all (enabled) test specs with ChromeHeadless browser in 'watch' mode. It provides immediate feedback loop, however, not appropriate for CI as it runs tests in watch mode.
`npm run test`       | executes all (enabled) test specs with headless Chrome once. This mode is appropriate for test development and CI. 
`npm run test-debug` | same as `ng test` except it runs Chrome browser with window to debug tests.

note: karma is configured to execute Chrome in headless mode, so this
is also appropriate for CI.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Test Code Coverage

To see the test code coverage run command:
```shell script
npm run test-coverage
```

After the tests finish, open the `my-home/coverage/index.html` file in your favorite browser to view the results.


## Troubleshooting `npm install` on Windows

NPM install on windows most likely will fail without the proper dependencies. Before you run any of these commands, make sure you run your terminal as administrator by right-clicking on your terminal icon and selecting `Run as administrator`

NOTE - If you already tried to run `npm install` in your projects directory run:
  `rm -rf node_modules/`
to remove the previous install so that we start from scratch.

If you are having connectivity issues, start by making sure that the proxy settings are set in NPM by executing:
```shell script
npm config set proxy http://proxy.standard.com:8080
npm config set https-proxy http://proxy.standard.com:8080
```

If your npm installation is breaking at `node-sass`, make sure that you have the necessary dependencies for the install build script by running:
```shell script
npm install --global --production windows-build-tools
```

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Documentation for Angular developer environment setup can be found on [confluence](https://standard.atlassian.net/wiki/spaces/PNX/pages/102564008/Angular+Developer+Environment+Setup). 
