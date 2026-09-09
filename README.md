# Skinstric

A React/Vite portrait analysis experience that guides a user from profile setup to camera or gallery analysis and a personalized skincare routine.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Test flow

1. Select `TAKE TEST`.
2. Enter a name and location.
3. Continue through `PROCEED` and `Preview`.
4. Choose camera or gallery.
5. Allow camera access or upload a portrait.
6. Run the analysis.
7. Open `PROCEED TO ANALYSIS` to view the skincare guidance.

Camera testing requires browser permission and a secure context such as localhost or HTTPS.

## API behavior

Portrait analysis is sent through the configured `/skinstric-api/skinstricPhaseTwo` proxy. The response supplies the AI demographic estimates used by the result screen. When the optional Phase One profile service is unavailable, the app saves the name and location locally so the portrait-analysis flow remains testable. Skincare concern guidance is labeled as starter guidance when the API does not return concern data.

## Production check

```bash
npm run build
```
