# How it works?

This repository implements a NodeJS API server to communicate with Trello and a web app made with Svelte,
the communication from the front-end to the Trello API is only allowed through the back-end API.

> The main architecture and tooling is built on top of [homegrown](https://grown.jamming.dev/) utilities of my own.

<details>
<summary>Requirements</summary>

### View 1

- [x] This view must be used to login:
  - [x] Implement any authorization method, the result of the login must return the Trello Token and Key necessary to do requests to Trello's API.

### View 2

- [x] Immediately after login:
  - [x] There must be a dropdown to select the workspace (Organization)
  - [x] Once the workspace is selected, a second dropdown must be enabled to select the board (Boards assigned to the selected workspace)
  - [x] Once a board is selected, a grouped list must be created in the bottom with the list of cards
     - [x] The cards must be grouped by stage
     - [x] If the card contains activities, the activities must be listed (Must be clear to which card the activity belongs)
     - [x] The user must be able to Create/Update cards.
        - [x] To create or update a card, the user must be able to at least fill the following information:
           - [x] Title
           - [x] Description
           - [x] Due Date
           - [x] Assign to multiple members
              - [x] The UI must show the display name of the members not the ID's

### Notification

- [x] If the user deletes a card, send an email notification (Don't include your email credentials in your project).
    - [x] Send the email to any email you want.
    - [x] Implement this step in the back end thru an API call.
    - [x] In the email body add:
        - [x] Type of Object deleted
        - [x] Name / Description of the deleted object
        - [x] User who deleted the object.

</details>

<details>
<summary>Relevant sources</summary>

### Server side

- `server.js` &mdash; Our NodeJS application
- `static.json` &mdash; Settings for the web-server on Heroku
- `Procfile` &mdash; Custom `web:` process for running Nginx + NodeJS

- `api/` &mdash; Here we setup our API `handlers.js` and `routes.js`
  - `controllers/` &mdash; Use `provider.js` files to inject dependencies
  - `mailings/` &mdash; Pug templates and LESS stylesheets for the mailings

> E-mail sent by the application can be accesed through the [/email](https://jamstack-nodejs-trello-client.herokuapp.com/email) endpoint.

### Client side

- `app/` &mdash; Web app sources, i.e. the `main.js` is the entry-point
  - `components/` &mdash; Svelte components on the wild!
  - `resources/` &mdash; Files found in `sprites/` are used as `<SvgIcon />`
  - `shared/` &mdash; Utility functions and shared state

> I prefer to work with [Svelte](https://svelte.dev/) over React or Vue. It's easy to grasp and helps you [get stuff done quickly!](https://svelte.dev/examples#hello-world)

</details>

<details>
<summary>Deployment how-to</summary>

## Heroku

The following buildpacks are required:

- [heroku/nodejs](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [heroku-community/static](https://github.com/heroku/heroku-buildpack-static)

> Deployments are done by running `git push heroku main`

### Environment

The following variables are required on the server, e.g.

```
MAILDEV=YES
TRELLO_API_KEY=XXX
```

> Either `export`'ed, on a `.env` file or added through `heroku config:add`

### Development

Execute `make` in your terminal, it'll setup the dependencies and start the services.

> [Maildev](https://github.com/maildev/maildev) should be enabled by default since it's just for demo purposes, otherwise you must [configure it](https://github.com/tacoss/mailor).

</details>
