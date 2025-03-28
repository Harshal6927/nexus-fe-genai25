## Nexus FE - GenAI Genesis

Add the backend server URL to the `src/lib/constants.ts` file.

```ts
export const API_URL = 'your-backend-server-url'
```

Create a `firebase.ts` file in the `src/utils` folder and add the following config with your Firebase project credentials.

```ts
export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
}
```

Install the dependencies:

```bash
npm i --legacy-peer-deps
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
