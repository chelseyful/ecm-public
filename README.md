# Extra Credit Machine
This repository contains a sanitized version of the Extra Credit Machine web service and Angular SPA used in [professor Chelsey Ingersoll](https://www.linkedin.com/in/chelsey-ingersoll-93aa9290/)'s courses. The app generates, stores and manages the lifecycle of extra credit codes. These codes are given to students during class and are redeemed for points on that students final grade.

The claim process uses a 'Posting ID' that is assigned to each student. This ID is not related to personally identifiable information associated with a student, and is instead an independently random identifier. In days of old, when a professor would post grades on their office door, the posting ID allowed them to do so without using a student's name or university ID number.

Please pardon the spaghetti code. This project was designed to suit a need for remote courses during COVID-19 and was not designed to be maintained long-term. This repository has been made public in the hopes that it will be useful to someone trying to accomplish something similar.

# Technical Overview
The Extra Credit Machine (ECM) is comprised of two components. An AWS stack (./service) and an Angular single page application (./web).

The two components work together using a simple REST API to perform CRUD operations on an underlying database. There is no endpoint for aggregate reporting. That is done via an external tool not provided in this repository.

## AWS Stack
The AWS stack component uses the [Serverless Framework](https://www.serverless.com/) to manage the development lifecycle of this AWS stack. The stack is comprised of the following key components;

- __API Gateway__  
  Used to proxy API requests from the web application to the underlying Lambda functions. Uses JWT to authenticate calls to API endpoints that have access to generate new codes.
- __DynamoDB__  
  Database used to store codes and track state transitions of generated codes. Was chosen for simplicity and minimizing costs. The data being stored is highly structured, and would be well suited for other databases (MariaDB?)
- __AWS Secrets Manager__  
  Generates and securely stores the shared secret for signing JWT payloads. These signed JWT payloads are issued to callers that authenticate to the app using a valid username password combination. They are subsequently passed with each API call that requires authentication.
- __Lambda__  
  Servers are so 1999. Why pay for a Linux VM that runs 24/7 when all you need is to fulfill a bunch of requests during certain times of day? Lambda does all the heavy lifting in the service component. The authorizer, CRUD handlers and housekeeping functions are all served from Lambda functions.

## Angular web app
The user-facing side of the application is built as an Angular SPA (Single Page Application). Angular was chosen because of my love of TypeScript and the Angular Material library made it easy to spin-up a decent UI with little effort.

This is not a great example of a well-formed Angular app. Some of the components were bodged together and I did not have a clear design when development started.

# Dedication
To Debbie, Brittney and Andrew. Your support over the last few years has been life saving. 👩‍💻❤

# License
GPL v3
