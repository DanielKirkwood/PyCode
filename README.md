
<br />
<div align="center">
  
  <h3 align="center">PyCode</h3>

  <p align="center">
    A Python coding challenge web application
    <br />
    <p align="center">
      <img alt="GitHub deployments" src="https://img.shields.io/github/deployments/DanielKirkwood/pycode/production?label=Vercel&logo=Vercel&logoColor=White">
      <img alt="CircleCI Status" src="https://circleci.com/gh/DanielKirkwood/pycode/tree/main.svg?style=svg">
      <img alt="CodeCov Coverage" src="https://codecov.io/gh/DanielKirkwood/pycode/branch/main/graph/badge.svg?token=0FAIP096ED">
    </p>
    <a href="https://www.pycode.codes"><strong>Go to app »</strong></a>
    <br />
    <br />
    <a href="https://github.com/DanielKirkwood/pycode">Explore Docs</a>
    ·
    <a href="https://github.com/DanielKirkwood/pycode/issues">Report Bug</a>
    ·
    <a href="https://github.com/DanielKirkwood/pycode/issues">Request Feature</a>
  </p>
</div>

## PyCode

PyCode is a web application that allows users to complete Python coding challenges. Authenticated users can even create their own challenges. To help users improve their Python programming skills, not only can you test your code against a set of test cases, but can also receive feedback on your code from static code analysis.
This project was developed by [Daniel Kirkwood](https://github.com/DanielKirkwood) for his level 4 final project at the University of Glasgow.

You can find PyCode at [pycode.codes](https://www.pycode.codes)

## Running Locally

To run PyCode locally on your machine:

1. Clone this repository
2. Install yarn:
~~~
npm install -g yarn
~~~
3. Install the dependencies with:
~~~
yarn
~~~
4. Run project in development mode:
~~~
yarn dev
~~~

## Environment Variables

PyCode requires specific environment variables to be set in order to function correctly. You can store these variables in a `.env.local` file at the root of the project. The environemt variables that PyCode requires are:

| MONGODB_URI          	| A MongoDB URI string which allows PyCode to connect to your deployment. Setup a MongoDB database [here](https://www.mongodb.com)                                	|
|----------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| MONGODB_DB           	| The name of the database on your deployment that PyCode will use to store data                                                                                  	|
| PISTON_API           	| The [Piston API](https://github.com/engineer-man/piston) is used as the code execution engine for PyCode                                                        	|
| PISTON_TOKEN         	| Optional - The piston API is rate-limited by default. If you reach out to the owner you can get an unlimited token which does not limit your number of requests 	|
| GITHUB_ID            	| Used for logging in to PyCode via GitHub. You must create an OAuth app on GitHub to get this unique UID                                                         	|
| GITHUB_SECRET        	| Secret which pairs with GITHUB_ID                                                                                                                               	|
| GOOGLE_CLIENT_ID     	| Used for loggin in to PyCode via Google                                                                                                                         	|
| GOOGLE_CLIENT_SECRET 	| Secret which pairs with Google_Client_ID                                                                                                                        	|
| NEXTAUTH_URL         	| Used by NextAuth, this is the canonical URL of your site e.g. http://localhost:3000                                                                             	|
| SECRET               	| Secret used to encrypt NextAuth JWT                                                                                                                             	|
| LINTER_API_URL       	| URL of the linter API which runs PyLint against user code. I use my own Heroku app: https://pycode-linter.herokuapp.com/lint                                    	|
| NEXT_PUBLIC_API_HOST 	| This should be the same as NEXTAUTH_URL                                                                                                                         	|
| NODE_ENV             	| Set to development if you want extra debugging whilst running locally                                                                                           	|
| CYPRESS_RECORD_KEY   	| Your cypress record key which tells circleCI where to send the cypress recordings to                                                                            	|


