# David Kim — Portfolio

My personal portfolio website: software, automation, and estimation systems — plus the freelance work I take on through [HyberTec](https://hybertec.com).

**Live site:** [daviddkim03.github.io](https://daviddkim03.github.io)

## What's on it

- **Work** — selected projects: Takeoff Estimator, Report Generator, and RestBroker
- **About** — experience (Young Corporation, HyberTec, Prime Academy, GTRI, NSF), education, and skills
- **Freelance** — services and how to request a project

## Tech

- [Next.js](https://nextjs.org) (App Router, static export)
- [Once UI](https://once-ui.com) design system
- MDX for project case studies
- Deployed to GitHub Pages via GitHub Actions on every push to `main`

## Development

```bash
npm install
npm run dev
```

Content lives in `src/resources/content.tsx` and `src/app/work/projects/*.mdx`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the static export (`out/`) and publishes it to GitHub Pages.

---

Built on the [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) template by Once UI ([CC BY-NC 4.0](LICENSE)).

## Contact

- Email: [daviddkim03@gmail.com](mailto:daviddkim03@gmail.com)
- LinkedIn: [linkedin.com/in/daviddkim03](https://www.linkedin.com/in/daviddkim03/)
- GitHub: [github.com/daviddkim03](https://github.com/daviddkim03)
