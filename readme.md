# API Project

## Installation

This project is a Node.js application built using Babel. To use this project, your computer needs:

- [Node.js](https://nodejs.org/en/) (v10.15 or greater)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/)
- [Elastic Beanstalk CLI](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)

A couple of very helpful tools to install needed libraries are
- [NVM](https://github.com/creationix/nvm) is great tool to install/manage Node versions on your machine.
- [Homebrew](https://brew.sh/) is the best package manager tool for MacOS.

### Installing Modules

Then open the folder in your command line, and install the needed dependencies:

```bash
npm install
```

## Code layout
The code layout is pretty straight forward. All the src is under `src` and that includes the Javascript files. Main entrypoint is app.js with controllers, routes, and models in their own directory. The `lib` directory has a ton of helpers, and the `service` directory initializes things like the db connect, web server and eventually background services.

## Running development server
To run babel dev server, here are the steps

- Run your MongoDB in the background via the command:
```bash
mongod
```
- Run command below to start the project in development mode. Your development site will be running on `http://localhost:3000/`.
```bash
npm start
```
You can test to make sure running ok with the url `http://localhost:3000/health`. You should see the letters `ok`.

## Deployments
Deploys to QA and Prod are on the AWS Elastic Beanstalk service. To run a deploy, you'll need to have the Elastic Beanstalk CLI installed. It very easily installed via Homebrew (`brew install aws-elasticbeanstalk`).

- To deploy to QA, run:
```bash
eb use NODE-API-QA
eb deploy
```

- To deploy to Production, run:
```bash
eb use NODE-API-PROD
eb deploy
```
