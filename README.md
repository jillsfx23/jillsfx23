# JILLS EFFECTS — portfolio website

Next.js 14 (App Router) + Supabase. Public portfolio for clients, plus a private admin
dashboard where you upload work that appears in the right category straight away.

```
app/
  page.jsx                     home — hero, MY WORKS, ABOUT ME, LET'S WORK TOGETHER
  works/[category]/page.jsx    graphic-design | 3d-design | videos
  admin/login/page.jsx         admin sign in
  admin/page.jsx               admin dashboard (upload / edit / delete)
components/                    Nav, Gallery + lightbox, AdminDashboard, Reveal, Footer
lib/                           site details, categories, Supabase client
supabase/schema.sql            run this once in Supabase
```

---

## 1. Install

You need Node.js 18.17 or newer. From inside this folder:

```bash
npm install
```

## 2. Create the Supabase project

1. Go to https://supabase.com, sign in, **New project**. Pick a region close to India
   (Mumbai / Singapore). Save the database password somewhere safe.
2. Open **SQL Editor → New query**, paste everything from `supabase/schema.sql`, press **Run**.
   That creates the `projects` table, the security rules, and the public `portfolio`
   storage bucket.
3. Open **Authentication → Users → Add user → Create new user**. Use your email and a
   strong password, and tick **Auto Confirm User**. This is your admin login — the only
   account that can upload.
4. Open **Authentication → Providers → Email** and turn **Enable sign ups** OFF, so nobody
   else can create an account.

## 3. Add your keys

In Supabase go to **Project Settings → API** and copy the **Project URL** and the
**anon public** key. Then in this folder create a file named `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

(There is a copy-ready template at `.env.local.example`.)

The anon key is safe to expose — the SQL policies are what protect your data. Never put
the `service_role` key in this project.

## 4. Run it

```bash
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## Using the admin dashboard

Sign in at `/admin`, then fill in the form:

| Field | Notes |
|---|---|
| Project title | Shown on the card and in the lightbox |
| Category | Graphic Design, 3D Design or Videos — decides where it appears |
| Description | One or two lines |
| Software used | e.g. `After Effects, Nuke` |
| Image | The picture shown in the grid |
| Video | MP4. Uploading one turns the card into a video card with a play button |
| Video thumbnail | The still shown before the video plays |

Press **Publish project**. It is live on the matching category page immediately — no code
changes, no redeploy.

Below the form every project is listed with **Edit**, **Publish / Unpublish** and
**Delete**. Editing lets you change the title, description, software or category, and
replace any file. Leave a file input empty to keep the current file.

**Unpublish** hides a project from clients while keeping it in your dashboard.

Clients never see any of this. The dashboard lives on `/admin`, there is no link to it
anywhere on the public site, and `/admin` is excluded from search engines.

---

## Changing your details

Everything personal lives in `lib/site.js` — brand, name, role, Instagram, email, skills.

WhatsApp and phone are left empty on purpose. Fill them in and the rows appear in the
contact section automatically:

```js
whatsapp: "https://wa.me/91XXXXXXXXXX",
phone: "+91 XXXXX XXXXX",
```

Leave them as `""` and nothing is shown.

Category names live in `lib/categories.js`.

### Your logo and profile image

Three files in `public/` carry your branding:

| File | Where it appears |
|---|---|
| `logo-wordmark.png` | The big title in the hero, and the logo in the nav bar |
| `profile.jpg` | The round portrait in the About section, plus link previews |
| `icon.png` | Browser tab icon (favicon) |

`logo-wordmark.png` was made from your Illustrator file with the black
background keyed out to transparency, so it sits on the dark page with no black
box around it. To swap any of them, replace the file and keep the same name.

### The cinematic background

The purple canyon behind the site is generated in CSS, so it works out of the box. To use
your own still instead, save it as `public/hero-bg.jpg` — it is blended over the gradient
automatically. Delete the file and the generated version comes back. A dark, wide image
(1920×1080 or larger) works best.

### Category card artwork

The three cards under MY WORKS use the newest published project in each category as their
artwork. Upload one Graphic Design, one 3D Design and one Video project and the cards fill
themselves in — landscape images look best there.

---

## Deploying (Vercel — free)

1. Put this folder on GitHub as a new repository.
2. Go to https://vercel.com → **Add New → Project** → import that repository.
3. Under **Environment Variables** add the same two values from `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   Optionally add `NEXT_PUBLIC_SITE_URL` set to your live domain, for the sitemap.
4. **Deploy**.

Your site is live, and `/admin` works exactly the same way on the live URL. Uploads go to
Supabase storage, so they survive every redeploy.

---

## Notes on media

- Supabase's free tier gives 1 GB of storage and 5 GB of egress per month. Big showreels
  eat that quickly — export MP4s at 1080p with a reasonable bitrate, or host long videos
  on YouTube/Vimeo and upload a short teaser here.
- Images are lazy-loaded; video only loads its metadata until a client presses play.
- Upload square-ish or portrait images for the masonry grid to look its best; the layout
  keeps whatever aspect ratio you give it.

## Troubleshooting

**"Supabase is not connected"** — `.env.local` is missing or the dev server was not
restarted after creating it.

**"new row violates row-level security policy"** — you are not signed in, or the SQL from
`supabase/schema.sql` has not been run.

**Upload fails with "Bucket not found"** — re-run step 2; the bucket must be named
`portfolio`.

**Login says "Invalid login credentials"** — create the user under Authentication → Users
with **Auto Confirm User** ticked.
