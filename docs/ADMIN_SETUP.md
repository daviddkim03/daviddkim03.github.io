# Admin

`/admin` edits the site's profile, home intro, work experience, education, skills, and résumé.
It commits `src/content/site.json` (or the résumé PDF) to `main` through the GitHub API, and the
deploy workflow publishes the change. There is no database or server.

## Sign in

1. Create a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new).
2. Repository access: only `daviddkim03/daviddkim03.github.io`.
3. Permissions: **Contents** read and write. Set a short expiry.
4. Open `/admin` and paste the token. It is kept in the tab's session storage and is forgotten when
   the tab closes.

Anyone can open the page, but nothing can be changed without a token that can write to the repo.

Projects are MDX files in `src/app/work/projects`.
