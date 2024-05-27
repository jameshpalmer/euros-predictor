# Euro Predict

Euro Predict is a Svelte-based web application for predicting the scores of Euro 2024 football matches. It allows users to input their score predictions for upcoming matches.

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

You will need to connect to a database with the correct schema, and set up environment variables as described in the `.env.example` file.

After installing dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
