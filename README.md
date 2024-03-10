# Enterprisey Workshop POC

There are four features (challenges, flashcards, notes, users) that will serve as remotes for the host application (dashboard).

To serve a feature, run the corresponding command.

```bash
npm run serve:challenges-feature
npm run serve:flashcards-feature
npm run serve:notes-feature
npm run serve:users-feature
```

The underlying NPM commands for a feature, are as follows.

```json
"serve:users-app": "npx nx serve users --open",
"serve:users-api": "npx nx serve users-api",
"serve:users-json": "json-server server/users.json --routes=server/routes.json --port=3400",
"serve:users-feature": "concurrently \"npm run serve:users-json\" \"npm run serve:users-app\""
```

We are currently serving the data for the feature from `json-server` but you could change the top-level command to use the Nest implementation if you wanted.

To run the dashboard, make sure the feature apps are up and running and then execute this command.

```
npx nx serve dashboard --open 
// or you can run which wraps the command above
npm start
```


## TODO FRONTEND
- [ ] Fix the unit tests for the data features
- [ ] Fix the unit tests for the state features
- [ ] Fix the unit tests for the app features
- [ ] Create a basic Cypress test for each app
- [ ] Integrate Cucumber into Cypress tests
- [ ] Create a functional set of suites for each feature
- [ ] Style the application
- [ ] Animate the application
- [ ] Set up auth workflow
- [ ] Set up deployment
- [ ] Add tooling for performance
- [x] Load all four features into the dashboard

## TODO API
- [ ] Set up authentication 
- [ ] Create E2E tests for APIs
- [ ] Add docker images
- [ ] Add in supergraph
- [x] Create data seeders

## TODO WORKSHOP
- [ ] Get portal concept working
- [ ] Break down steps to build portal in workshop
