## How to run the apps:
Inside the root directory, run:

 *Angular app*
   > `npm run start:web`

 *Nest app*
   > `npm run start:api`


## How to write the commit message
When you make a commit, the message should be on this format:
- git commit -m "[TASK-NO] YOUR-MESSAGE"

ex: 
> git commit -m "[REF-Dashboard-1] Add routing to the angular app"


## Below we have the info about using Nx
This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/getting-started/intro)

[Mental model is a good starting point for those who like to understand things theoretically first.](https://nx.dev/concepts/mental-model)

[Interactive Tutorial](https://nx.dev/getting-started/angular-tutorial)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@referer-me/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Backend

### Basic route example

In our users/users.controller.ts file we can find GET routes and one of it call the function findAll(). This function call the method findAll() of users service from users/users.service.ts file. Here this method is searching through our database and return all users but without their password. 

In order for any route to work you need a module file as users/users.module.ts where we import the classes MongooseModule in imports array, UserController in controllers array and UserService in providers array.

Then we have to import our UserModule class to app.module.ts in imports array.

### Post route example

In our registration/registration.controller.ts file we will find a POST route which call the function signup(). This function take as argument and CreateUserDto (Data Transfer Object) defined in users/dto/create-user.dto.ts file. Before signup() function is called a middleware is called first. We can find in our middleware folder verifySignup.middleware.ts file where the req.body is validated by verifySignupService (which is defined in services/verifySignupService). The methods name are quite clear and explain what they are doing.

Once the req.body pass the middleware it goes for signup() function where the body is sent as argument to create method of usersService. In order to have access to it you need to ad it in the providers array of registration.module.ts file. Here the password is hashed with the help of bcrypt, then the user is stored in the database and is returned back (without the password).

### Database

In order to connect the database (in our case mongoDB) we need first to install mongoose (npm i --save mongoose @nestjs/mongoose). After installation we go to our app.module.ts file and import MongooseModule from @nestjs/mongoose and add it in imports array as MongooseModule.forRoot(). Inside we put a string with url database.

Next we need to define a Schema. We go in our users/schemas folder where we created user.schema.ts file. Here you will find the syntax you need to define a schema and inside @Schema decorator we export the User class which contain our document model. You will find next in users.service.ts file the syntax for injecting the model in constructor and then we can use it in order to take action in our database with mongoose methods (more info here https://mongoosejs.com/).

In order for the users service to be able to use the model we need to import in users.module.ts file in imports array the MongooseModel as: MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]).

### .env file

In api folder create an .env file (make sure that your .gitignore file ignores .env before creating the file) and store the data you need to be protected by .env. In order to access that data with process.env.key for example you need first to install ConfigModule with the command npm i --save @nestjs/config and then import ConfigModule class to app.module.ts array as ConfigModule.forRoot().

### API list (so far):

#### POST http://localhost:3333/api/registration 
Payload:
{
  - firstName: string;
  - lastName: string;
  - password: string;
  - email: string;
  - website: string;
  - role: string // if not provided then user will be the default;
  - isActivated: boolean;
  
}

Returns part of IUser:

 - _id: string;
 - firstName: string;
 - lastName: string;
 - email: string;
 - website: string;
 - role: string;

#### POST http://localhost:3333/api/auth/login
Payload:

 - username: email,
 - password: password,

Returns tokens:

 - accessToken: string;
 - refreshToken: string;
 
It also create or update a refreshToken in database.
 
#### GET Protected Route by AccessToken (require accessToken) http://localhost:3333/api/auth/logut 

Returns message: string and remove the refreshToken from database.

#### GET Protected Route by RefreshToken (require refreshToken) http://localhost:3333/api/auth/refresh 

Returns tokens:

 - accessToken: string;
 - refreshToken: string;
 
#### Post http://localhost:3333/api/auth/reset-token-password

Payload:

 - email: string;
 
Returns message: string and send email with reset password link. Also create a resetPasswordToken in database.

#### GET Protected Route by ResetToken http://localhost:3333/api/auth/reset-token-password

Returns message: string if there is a valid token

#### POST Protected Route by ResetToken http://localhost:3333/api/auth/reset-password

Payload:

 - password: string
 
 Returns message: string. It will update password in user database and remove the resetPasswordToken from database.
 
#### GET Protected Route by AccessToken http://localhost:3333/api/profile

Returns:

  - _id?: string;
  - firstName: string;
  - lastName: string;
  - email: string;
  - website?: string;
  - role?: string;

#### PATCH Protected Route by AccessToken http://localhost:3333/api/profile

Payload: User data you want to change (except password, it will throw Forbidden Error)

Returns message: string and change the user in database.

#### DELETE Protected Route by AccessToken http://localhost:3333/api/profile

Returns message: string and delete the user from database.

#### GET http://localhost:3333/api/project-details/:projectId/:itemId/:tabType 

Param tabType can be dashboard, data-costs or documents

Returns the project details for the chosen itemId with the selected projectId from collections dashboard, data-costs or documents

If there is no document on that specific projectId with that specific itemId a document will be created

On data-costs tabType we can use query params as such:

 - pageIndex: string; // equal 0 if not provided
 - pageSize: string; // equal 10 if not provided
 - sortBy?: string; // the key we want to sort by when we use sortDirection
 - searchValue?: string; // the value we search by.
   - if the value is string it will search in the keys which are string to find any match
   - if the value is number it will search in the keys which are numbers to find the exact number
 - sortDirection?: string; // can be asc or desc

#### POST http://localhost:3333/api/project-details/:tabType/add

Param tabType can be dashboard, data-costs or documents.

Payload (provisory, it will change): 

 - dashboard:
   - projectId: string;
   - itemId: string;
   - data: {
      - progress: number;
      - details: [
        {
          - labels: string[];
          - dataset: number[];
          - title: string;
        }
      ]
   }
 - data-costs:
   - projectId: string;
   - itemId: string;
   - data: {
     - position: number;
     - name: string;
     - weight: number;
     - symbol: string;
     - unitCost: number;
     - unitMeasure: string;
     - currency: string;
   }
 - documents:
   - projectId: string;
   - itemId: string;
   - data: {
     - name: string;
     - fileType: string;
     - src: string;
   }

#### POST http://localhost:3333/api/project-details/data-costs-data/:id/add

Adds an item inside the data array of the data-costs document. 

Params :
 - id: data-costs document _id

Query params :
 - pageIndex it will always be 0
 - pageSize = the provided value || 10
 - other query params will be ignored

Payload:
 - position: number;
 - name: string;
 - weight: number;
 - symbol: string;
 - unitCost: number;
 - unitMeasure: string;
 - currency: string; 

The id will be created on backend.

Returns the updated data-costs document.

#### PATCH http://localhost:3333/api/project-details/data-costs-data/:id/:dataItemId/edit

Edit (replace) an item inside the data array of the data-costs document. 

Params: 
 - id: data-costs document _id
 - dataItemId: the id of the item we want to edit from the data array

Query params: all will work 

Payload:
 - position: number;
 - name: string;
 - weight: number;
 - symbol: string;
 - unitCost: number;
 - unitMeasure: string;
 - currency: string; 

Returns the updated data-costs document.

#### DELETE http://localhost:3333/api/project-details/data-costs-data/:id/:dataItemId/delete

Deletes an item inside the data array of of the data-costs document. 

Params: 
 - id: data-costs document _id
 - dataItemId: the id of the item we want to edit from the data array

Query params: all will work 

Returns the updated data-costs document.

#### GET http://localhost:3333/api/project

Returns all project of the logged in user

#### POST http://localhost:3333/api/project/add

Add a project for the logged in user

Payload {
  - name: string;
  - city: string;
  - area: string
}

returns {
  - _id?: string;
  - name: string;
  - city: string;
  - area: string;
  - roles: IProjectRoles {
    - admin: string;
    - editor: string[];
    - viewer: string[];
  }
  - __v?: number;
  - createdAt?: Date;
  - updatedAt?: Date;
}

#### PATCH http://localhost:3333/api/project/:id

Modify the the project

#### DELETE http://localhost:3333/api/project/:id

Delete the project

#### POST http://localhost:3333/api/project-details/documents/:fullDocumentId/upload

Upload files in files folder from referer-me\apps\api\src and add item(s) to data array of Documents document as below:

 - id: string;
 - userId: string;
 - name: string;
 - mimeType: string;
 - path: string;

 The fieldName when adding the files must be files.

 Maximum 10 files at onces, only pdf and maxSize is 4mb 

#### GET http://localhost:3333/api/project-details/documents/:fullDocumentId/:dataItemId/find

Returns the file as blob. 

#### GET http://localhost:333/api/project-invite/:projectId/:roleType/:email/add-role-if-user-exists

If the user exists it will add the selected role to the project.

#### POST http://localhost:333/api/project-invite/send-invitation

Send the invite email to the selected email. If user does not exists then a temporary user will be created.

Payload {
  - email: string;
  - project: IProject;
  - roleType?: string;
}

#### GET http://localhost:333/api/project-invite/:userId/:projectId/check-invitation-and-user

Check if the invite token is valid and returns the invite token and the user: the existing one or the temporary one.

#### GET http://localhost:333/api/project-invite/:userId/find-temp-user

Get the temporary user.

#### DELETE http://localhost:333/api/project-invite/:userId/delete-temp-user

Delete the temporary user.

#### GET http://localhost:333/api/project-invite/:projectId/:roleType/:userId/add-role-to-project

Add the userId to the selected role of the selected project.

#### GET http://localhost:333/api/auth/login/by-email

Login by email, but it requires a valid invite token.

#### GET  http://localhost:333/api/project-invite/:userId/destroy-invite-token

Destroys the invitation token. The case where this is used is when an user does not exists and the non temporary user is created.

#### for development 

##### GET http://localhost:3333/api/tokens 

Returns a list with all tokens

##### GET http://localhost:3333/api/users

Return a list with all users

##### GET http://localhost:3333/api/users/:id

Return an user with the param id

#### GET http://localhost:3333/api/project-details/:tabType/find

Param tabType can be: dashboard, data-costs or documents

Return the data from dashboard, data-costs or documents collections

#### GET http://localhost:3333/api/project/find-all

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.






## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
