// One-command publish to GitHub Pages: builds every app and force-pushes dist/ to the gh-pages branch.
//   npm run deploy
// (Pages is set to serve the gh-pages branch. If you later enable the workflow in deploy/pages.yml, switch
//  Settings -> Pages -> Source to "GitHub Actions" and this script is no longer needed.)
import { execFileSync, execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(ROOT, 'dist')
const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts })

const remote = execSync('git remote get-url origin', { cwd: ROOT }).toString().trim()
const repoName = remote.replace(/\.git$/, '').split('/').pop()
const base = process.env.BASE ?? `/${repoName}`

for (const d of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (d.isDirectory() && fs.existsSync(path.join(ROOT, d.name, 'package-lock.json'))) {
    run('npm ci --no-audit --no-fund', { cwd: path.join(ROOT, d.name) })
  }
}
execFileSync(process.execPath, ['build.mjs'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, BASE: base } })

const git = (args) => execSync(`git ${args}`, { cwd: DIST, stdio: 'inherit' })
fs.rmSync(path.join(DIST, '.git'), { recursive: true, force: true })
git('init -q -b gh-pages')
git('add -A')
git('-c user.name="mochanlabs-dev" -c user.email="299086282+mochanlabs-dev@users.noreply.github.com" commit -q -m "Deploy docs"')
git(`push -q -f "${remote}" gh-pages`)
console.log(`\nPublished. It is live in about a minute at https://${remote.split('github.com/')[1].split('/')[0]}.github.io/${repoName}/`)
