# David Kim — Portfolio

My personal portfolio website: software, automation, and estimation systems — plus the freelance work I take on through [HyberTec](https://hybertec.com).

**Live site:** [daviddkim03.github.io](https://daviddkim03.github.io)

## What's on it

- **Work** — selected projects: Takeoff Estimator, Report Generator, and RestBroker
- **About** — experience (Young Corporation, HyberTec, Prime Academy, GTRI, NSF), education, and skills
- **Freelance** — services and how to request a project

## Tech

- [Next.js](https://nextjs.org) (App Router, static export)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) with the [Neutral](https://ui.shadcn.com/colors) theme
- [react-icons](https://react-icons.github.io/react-icons/) (Lucide set)
- MDX for project case studies
- Deployed to GitHub Pages via GitHub Actions on every push to `main`

## Development

```bash
npm install
npm run dev      # local dev server
npm run lint     # Biome lint + format check
npm run build    # static export to out/
npm start        # serve the static export
```

Content lives in `src/lib/content.ts` (profile, home, about, résumé), `src/resources/content.tsx` (page titles and social links), and `src/app/work/projects/*.mdx` (case studies).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the static export (`out/`) and publishes it to GitHub Pages.

---

Originally built on the [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) template by Once UI ([CC BY-NC 4.0](LICENSE)).

## Contact

- Email: [daviddkim03@gmail.com](mailto:daviddkim03@gmail.com)
- LinkedIn: [linkedin.com/in/daviddkim03](https://www.linkedin.com/in/daviddkim03/)
- GitHub: [github.com/daviddkim03](https://github.com/daviddkim03)
