# Jobly Backend

A full stack web application called Jobly, which can be used to explore and "apply" for jobs online. This application is a demonstrative project, so the jobs will not real and the project will not be launched.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Documentation](#api-documentation)
4. [Database Schema](#database-schema)


## Installation

Use the following code to download application

```bash
# Clone the repository
git clone https://github.com/CalebMacLean/jobly.git

# Install dependencies
npm install
```

## Usage

This is the Express backend for Jobly, version 2.

```bash
To run this:

    node server.js
    
To run the tests:

    jest -i
```

## API Documentation

# User Routes

- POST /users
    - Requires admin status to create users.
- POST /users/:username/jobs/:id
    - Requires admin or correct user status to apply a user to a job.
    - Route Parameters:
        - username: valid username
        - id: valid job id
- GET /users
    - Requires admin status to see list of all users.
- GET /users/:username
    - Requires admin or correct user status to get user data.
    - Route Parameters:
        - username: valid username.
- PATCH /users/:username
    - Requires admin or correct user status to modify user's data.
    - Route Parameters: 
        - username: valid username.
- DELETE /users/:username
    - Requires admin or correct user status to delete a user.
    - Route Parameters:
        - username: valid username.

# Company Routes

- POST /companies
    - Requires admin status to create a new company.
- GET /companies
    - Requires any status to see all companies.
- GET /companies/:handle
    - Requires any status to see company inforomation.
    - Route Parameters:
        - handle: valid handle for a company.
- Patch /companies/:handle
    - Requires admin status to modify company data.
    - Route Parameters:
        - handle: valid handle for a company.
- Delete /companies/:handle
    - Requires admin status to delete a company.
    - Route Parameters:
        - handle: valid handle for a company.

# Job Routes

- POST /jobs
    - Requires admin status to create a job.
- GET /jobs
    - Requires any status to view list of jobs.
    - Accepts query strings for:
        - title: position name
        - minSalary: minimum salary must be integer.
        - hasEquity: boolean value.
- GET /jobs/:id
    - Requires admin status to see specific job information.
    - Route Parameters:
        - id: valid id for an existing job.
- PATCH /jobs/:id
    - Requires admin status to modify a job's data.
    - Route Parameters:
        - id: valid id for an existing job.
- DELETE /jobs/:id
    - Requires admin status to delete a job.
    - Route Parameters:
        - id: valid id for an existing job.

## Database Schema

# companies Table
- handle:
    - Primary Key
    - String
    - Limited to 25 characters
- name:
    - String
    - Unique
    - Not Nullable
- num_employees:
    - Integer
    - Must be greater than zero
- description:
    - String
    - Not Nullable
- logo_url:
    - String

# users Table
- username:
    - Primary Key
    - String
    - Limited to 25 characters
- password:
    - String
    - Not Nullable
- first_name:
    - String
    - Not Nullable
- last_name:
    - String
    - Not Nullable
- email:
    - String
    - Not Nullable
    - Must contain an @ character
- is_admin:
    - Boolean
    - Not Nullable
    - Default: FALSE

# jobs Table
- id:
    - Primary Key
    - Auto-incrementing
- title:
    - String
    - Not Nullable
- salary:
    - Integer
    - Must be greater than or equal to 0
- equity:
    - Integer
    - Must be grater less than or equal to 1.0
- company_handle:
    - Foreign Key
    - References: companies table

# applications Table
- username:
    - Foreign Key
    - References: users table
    - String
- job_id:
    - Foreign Key
    - References: jobs table
    - Integer
- (username, job_id):
    - Primary Key
