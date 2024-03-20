import { setRemoteDefinitions } from '@nx/angular/mf';

const FEATURES_API_URI = 'http://localhost:3000/api/features';

fetch(FEATURES_API_URI)
  .then((res) => res.json())
  .then((res) =>
    res.reduce((acc: any, r: any) => {
      acc[r.slug] = r.remote_uri;
      return acc;
    }, {})
  )
  .then((definitions: any) => setRemoteDefinitions(definitions))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));
