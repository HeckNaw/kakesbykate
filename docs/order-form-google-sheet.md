# Order form → Google Sheet (+ email copy)

The order form (`src/sections/Order.jsx`) POSTs each submission to a **Google
Apps Script Web App**. That script:

1. Appends a row to a Google Sheet (your order log).
2. Saves any inspiration photos to a Drive folder and links them in the row.
3. Emails the **customer** a copy of their order.
4. Emails **Kate** a notification of the new order.

No paid services required — Apps Script, Sheets, Drive and Gmail are all free.

---

## 1. Create the Sheet

1. Go to <https://sheets.google.com> and create a new spreadsheet, e.g.
   **"Kakes by Kate — Orders"**.
2. Note the tab name (default is `Sheet1`).

## 2. Add the Apps Script

1. In the sheet: **Extensions → Apps Script**.
2. Delete the placeholder and paste the contents of
   [`order-form.gs`](./order-form.gs) (in this folder).
3. At the top of the script, set:
   - `KATE_EMAIL` — where new-order notifications go.
   - `DRIVE_FOLDER_NAME` — Drive folder for uploaded photos (auto-created).
4. **Save**.

## 3. Deploy as a Web App

1. **Deploy → New deployment**.
2. Type: **Web app**.
3. Set **Execute as: Me**, **Who has access: Anyone**.
   (Required so the public site can POST to it. The URL is unguessable.)
4. **Deploy**, authorize the requested permissions (Sheets, Drive, Gmail).
5. Copy the **Web app URL** — it ends in `/exec`.

> Re-deploy (Deploy → Manage deployments → edit → new version) whenever you
> change the script.

## 4. Wire the site to the endpoint

Set the URL as an env var so it isn't hard-coded:

**Locally** — create `.env.local` in the project root:

```
VITE_ORDER_ENDPOINT=https://script.google.com/macros/s/XXXXX/exec
```

**On Vercel** — Project → Settings → Environment Variables → add
`VITE_ORDER_ENDPOINT` with the same value, then redeploy.

Without this var set, the form still works in dev but just logs the payload to
the console instead of sending it.

## 5. Test

Submit a test order from the site. You should see:
- a new row in the Sheet,
- the inspo photo(s) in the Drive folder (linked in the row),
- a copy in the customer's inbox,
- a notification in Kate's inbox.

---

## Payload shape

The site sends JSON (as `text/plain` to avoid a CORS preflight Apps Script
can't answer). Fields:

`name, email, instagram, phone, pickupDate, pickupTime, productType,
cakeSize, cakeDescription, cakeFlavour, cakeFilling, cakeMessage,
cupcakeQuantity, cupcakeDescription, cupcakeFlavour,
macaronQuantity, macaronFlavours, macaronExtras, otherDescription,
photos[], submittedAt`

`photos` is an array of `{ name, type, dataUrl }` (base64 data URLs).
