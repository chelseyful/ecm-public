# Extra Credit Machine
This repository contains a sanitized version of the Extra Credit Machine web service and Angular SPA used in [professor Chelsey Ingersoll](https://www.linkedin.com/in/chelsey-ingersoll-93aa9290/)'s courses.

Please pardon the spaghetti code. This project was designed to suit a need for remote courses during COVID-19 and was not designed to be maintained long-term. This repository has been made public in the hopes that it will be useful to someone trying to accomplish something similar.

# Project Description
The Extra Credit Machine (ECM) is comprised of two components. An AWS stack (service directory) and an Angular single page application (web directory).

The two components work together using a simple REST API to perform CRUD operations on an underlying database.

## AWS Stack
The AWS stack component uses the [Serverless Framework](https://www.serverless.com/) to manage the development lifecycle of an AWS stack. The stack is comprised of the following key components;

- __API Gateway__  
  Used to proxy API requests from the web application to the underlying Lambda functions. Uses JWT to authenticate calls to API endpoints that have access to generate new codes.
- __DynamoDB__  
  Database used to store codes and track state transitions of generated codes. Was chosen for simplicity and minimizing costs. The data being stored is highly structured, and would be well suited for other databases (MariaDB?)
- __AWS Secrets Manager__  
  Generates and securely stores the shared secret for signing JWT payloads.
- __Lambda__  
  Servers are so 1999. Why pay for a Linux VM that runs 24/7 when all you need is to fulfill a bunch of requests during certain times of day? Lambda does all the heavy lifting in the service component. The authorizer, CRUD handlers and housekeeping functions are all served from Lambda functions.

## Angular web app
The user-facing side of the application is built as an Angular SPA (Single Page Application). Angular was chosen because of my love of TypeScript and the Angular Material library made it easy to spin-up a decent UI with little effort.

This is not a great example of a well-formed Angular app. Some of the components were bodged together and I did not have a clear design when development started.

# Dedication
To Debbie, Brittney and Andrew. Your support over the last few years has been life changing. ❤

# License
GPL v3
