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


## TODO FRONTEND
- [ ] Load all four features into the dashboard
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

## TODO API
- [ ] Set up authentication 
- [ ] Create data seeders
- [ ] Create E2E tests for APIs
- [ ] Add docker images
- [ ] Add in supergraph

## TODO WORKSHOP
- [ ] Get portal concept working
- [ ] Break down steps to build portal in workshop
