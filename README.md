# Welfares.site — Clickable Mockup

Static, multi-page mockup of the three portals in the delivery plan. It uses the same visual system as the
Vue app and the design files in `current-design/`. No build step or server is needed.

## Open

Open `index.html` in a browser. This page is the public site and includes a **Screen index** listing every screen.

Opening files directly with `file://` works in most browsers. If a browser blocks it, serve the folder with any static server, for example `npx serve .`.

## Sign-in and the login gate

- Portal pages (`admin-*`, `org-*`, `member-*`) check for a demo session. Without one, you are sent to `signin.html`.
- On `signin.html`, use one of the **Demo access** buttons, or enter any email and password and pick a portal.
- The session is kept in `sessionStorage` for the current tab. Use **Sign out** in the sidebar to clear it.
- A session only opens its own portal. Visiting another portal's page sends you back to sign-in.

This is a design mockup. Any credentials are accepted and no data is stored or sent.

## What works

- Sidebar navigation between every screen in each portal
- Modal forms (`Add member`, `Record payment`, `New loan`, and others). Submitting shows a confirmation and closes the modal
- Toast confirmations on actions and exports
- Table search boxes
- Approve and reject buttons remove the row from the list
- Toggle switches
- Mobile sidebar menu

## Files

- `index.html`, `register.html`, `signin.html` — public site and sign-in
- `admin-*.html` — Benevivo super-admin console (9 screens)
- `org-*.html` — organisation administrator portal (15 screens)
- `member-*.html` — member self-service portal (7 screens)
- `assets/mockup.css` — base styles (copied from `welfares-web/src/style.css`)
- `assets/mockup-extras.css` — modals, charts, cards, sign-in layout
- `assets/mockup.js` — login gate, modals, toasts, filters, row actions
