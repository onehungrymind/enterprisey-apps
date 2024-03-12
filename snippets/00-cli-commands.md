
## The App
Create the workspace with a `portal` application.

```bash
npx create-nx-workspace@18.0.8 workshop \
  --appName=portal \
  --preset=angular-monorepo \
  --workspaceType=integrated \
  --bundler=esbuild \
  --e2eTestRunner=cypress \
  --style=scss \
  --ci=skip \
  --ssr=false
```

Create a library to hold the interfaces for the entire root domain and sub-domains.

```
npx nx g @nx/js:lib api-interfaces --directory=libs --unitTestRunner=none --minimal --no-interactive
```

## The Host 


```bash
npx nx g @nx/angular:host dashboard \
  --style=scss \
  --dynamic=true \
  --e2eTestRunner=cypress \
  --projectNameAndRootFormat=derived \
  --ssr=false
```

## Angular Material

Create an Angular Material lib to roll up all of the component modules.

```bash
npx nx g @nx/angular:library material \
  --directory=libs/material \
  --standalone=false \
  --projectNameAndRootFormat=as-provided \
  --prefix=proto \
  --unitTestRunner=none
```

```bash
npm i @angular/material && \
npm i @angular/animations
```

Add Angular Material to the individual Angular applications. 

```bash
npx nx g @angular/material:ng-add --project=dashboard && \
npx nx g @angular/material:ng-add --project=challenges && \
npx nx g @angular/material:ng-add --project=flashcards && \
npx nx g @angular/material:ng-add --project=notes
```

## The Data Layer

Create the feature libraries for remote services.

```
npx nx g @nx/angular:library challenges-data --directory=libs/challenges-data --standalone=false --projectNameAndRootFormat=as-provided && \
npx nx g @nx/angular:library flashcards-data --directory=libs/flashcards-data --standalone=false --projectNameAndRootFormat=as-provided && \
npx nx g @nx/angular:library notes-data --directory=libs/notes-data --standalone=false --projectNameAndRootFormat=as-provided
```

Create the service for each feature.

```
npx nx g @nx/angular:service services/challenges --project=challenges-data && \
npx nx g @nx/angular:service services/flashcards --project=flashcards-data && \
npx nx g @nx/angular:service services/notes --project=notes-data
```

##  The Component Layer

Generate the master-detail view components for the **challenges** feature.

```
npx nx g @schematics/angular:component challenges --project=challenges --style=scss && \
npx nx g @schematics/angular:component challenges/challenges-list --project=challenges --style=scss && \
npx nx g @schematics/angular:component challenges/challenge-details --project=challenges --style=scss
```

Generate the master-detail view components for the **flashcards** feature.

```
npx nx g @schematics/angular:component flashcards --project=flashcards --style=scss && \
npx nx g @schematics/angular:component flashcards/flashcards-list --project=flashcards --style=scss && \
npx nx g @schematics/angular:component flashcards/flashcard-details --project=flashcards --style=scss
```

Generate the master-detail view components for the **notes** feature.

```
npx nx g @schematics/angular:component notes --project=notes --style=scss && \
npx nx g @schematics/angular:component notes/notes-list --project=notes --style=scss && \
npx nx g @schematics/angular:component notes/note-details --project=notes --style=scss
```

## The State Layer

Create the feature libraries to hold state management.

```
npx nx g @nx/angular:library challenges-state --directory=libs/challenges-state --standalone=false --projectNameAndRootFormat=as-provided
npx nx g @nx/angular:library flashcards-state --directory=libs/flashcards-state --standalone=false --projectNameAndRootFormat=as-provided
npx nx g @nx/angular:library notes-state --directory=libs/notes-state --standalone=false --projectNameAndRootFormat=as-provided
```

Generate the NgRx code for the **challenges** feature.

```
npx nx g @nx/angular:ngrx-feature-store --name=challenges \
  --directory=state \
  --parent=libs/challenges-state/src/lib/challenges-state.module.ts \
  --route=apps/challenges/src/app/remote-entry/entry.routes.ts \
  --facade=true
```

Generate the NgRx code for the **flashcards** feature.

```
npx nx g @nx/angular:ngrx-feature-store --name=flashcards \
  --directory=state \
  --parent=libs/flashcards-state/src/lib/flashcards-state.module.ts \
  --route=apps/flashcards/src/app/remote-entry/entry.routes.ts \
  --facade=true
```

Generate the NgRx code for the **notes** feature.

```
npx nx g @nx/angular:ngrx-feature-store --name=notes \
  --directory=state \
  --parent=libs/notes-state/src/lib/notes-state.module.ts \
  --route=apps/notes/src/app/remote-entry/entry.routes.ts \
  --facade=true
```

Generate the NgRx code for the **features** feature.

```
npx nx g @nx/angular:ngrx-feature-store --name=features \
  --directory=state \
  --parent=libs/features-state/src/lib/features-state.module.ts \
  --route=apps/portal/src/app/remote-entry/entry.routes.ts \
  --facade=true
```

### Misc 

```
npx nx g @nx/angular:setup-tailwind dashboard
npx nx g @nx/angular:setup-tailwind challenges
npx nx g @nx/angular:setup-tailwind flashcards
npx nx g @nx/angular:setup-tailwind notes
```

### Vertical Development

All of the commands for the **users** feature.

```
npx nx g @nx/angular:remote users --host=dashboard \
  --style=scss \
  --e2eTestRunner=cypress \
  --projectNameAndRootFormat=derived
npx nx g @nx/angular:library users-data 
  --directory=libs/users-data \
  --standalone=false \
  --projectNameAndRootFormat=as-provided && \
npx nx g @nx/angular:service services/users --project=users-data && \
npx nx g @schematics/angular:component unpx nx g @nx/angular:library users-data 
  --directory=libs/users-data \
  --standalone=false \
  --projectNameAndRootFormat=as-provided && \
npx nx g @nx/angular:service services/users --project=users-data && \
npx nx g @schematics/angular:component users --project=users --style=scss && \
npx nx g @schematics/angular:component users/users-list --project=users --style=scss && \
npx nx g @schematics/angular:component users/user-details --project=users --style=scss && \
npx nx g @nx/angular:library users-state \
  --directory=libs/users-state \
  --standalone=false \
  --projectNameAndRootFormat=as-provided && \
npx nx g @nx/angular:ngrx-feature-store --name=users \
  --directory=state \
  --parent=libs/users-state/src/lib/users-state.module.ts \
  --route=apps/users/src/app/remote-entry/entry.routes.ts \
  --facade=true && \
npx nx g @nx/angular:setup-tailwind userssers --project=users --style=scss && \
npx nx g @schematics/angular:component users/users-list --project=users --style=scss && \
npx nx g @schematics/angular:component users/user-details --project=users --style=scss && \
npx nx g @nx/angular:library users-state \
  --directory=libs/users-state \
  --standalone=false \
  --projectNameAndRootFormat=as-provided && \
npx nx g @nx/angular:ngrx-feature-store --name=users \
  --directory=state \
  --parent=libs/users-state/src/lib/users-state.module.ts \
  --route=apps/users/src/app/remote-entry/entry.routes.ts \
  --facade=true && \
npx nx g @nx/angular:setup-tailwind users && \  
```

```
npm i @angular/material && \
npx nx g @angular/material:ng-add --project=users
```

## Angular CLI Quasi Equivalent Commands

```
npm install -g @angular/cli
ng n workshop --create-application=false --prefix=proto

ng g application portal --interactive=false -p=proto --routing=true --style=scss
ng serve
ng g application dashboard --interactive=false -p=proto --routing=true --style=scss
ng serve dashboard

ng g lib user-data --project-root=libs/user-data --standalone=false
ng g lib user-state --project-root=libs/user-state --standalone=false
ng g lib material --project-root=libs/material --standalone=false

ng add @angular/material --project=dashboard
ng add @angular/material --project=portal

ng g lib api-interfaces --project-root=libs/api-interfaces --standalone=false

npm install @ngrx/{store,effects,entity,store-devtools} --save
ng add @ngrx/schematics@latest

ng g lib users-data --project-root=libs/users-data --standalone=false
ng g lib users-state --project-root=libs/users-state --standalone=false

ng g f user --project=users-state -m users-state.module.ts -a true

ng g c users --project=dashboard
ng g c users/users-list --project=dashboard
ng g c users/user-details --project=dashboard
```