# Admin

`/admin` edits the site's profile, home intro, work experience, education, skills, and résumé.
Sign in with the admin password. Saves go live immediately, without a deploy.

- Firebase project: `dkim-portfolio-8689bc` (free plan). Documents: `site/content`, `site/resume`.
- The password belongs to the `admin@daviddkim03.github.io` account. Change it in the Firebase
  console under Authentication. It is never stored in this repo.
- `firestore.rules` lets anyone read and only that account write. Deploy it with
  `firebase deploy --only firestore:rules`.
- Pages are built from `src/content/site.json` and then updated in the browser with the saved
  content. Page titles and search previews keep the built-in values until that file is changed.
- Projects are MDX files in `src/app/work/projects`.
