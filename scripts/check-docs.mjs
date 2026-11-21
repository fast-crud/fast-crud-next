import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { matchesGlob, posix, relative, sep } from 'node:path'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'

const root = fileURLToPath(new URL('../', import.meta.url))
const docs = fileURLToPath(new URL('../docs/zh/', import.meta.url))
const { values } = parseArgs({ options: { base: { type: 'string' } } })
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' })
const base = values.base === undefined
  ? 'HEAD'
  : git('merge-base', '--', 'HEAD', values.base).trim()
const changed = [
  ...git('diff', '--name-only', '--no-renames', '-z', base, '--').split('\0'),
  ...git('ls-files', '--others', '--exclude-standard', '-z').split('\0'),
].filter(Boolean)

const pages = new Set(readdirSync(docs, { recursive: true, withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
  .map(entry => posix.join(relative(docs, entry.parentPath).split(sep).join('/'), entry.name)))
const mapping = JSON.parse(readFileSync(new URL('../docs/doc-impact.json', import.meta.url), 'utf8'))
const errors = []
for (const path of ['index.md', 'agent-index.md', ...Object.values(mapping).flat()]) {
  if (!pages.has(path)) errors.push(`缺少中文文档页面：${path}`)
}

const markdown = await createMarkdownRenderer(docs)
for (const page of pages) {
  const source = readFileSync(new URL(page, new URL('../docs/zh/', import.meta.url)), 'utf8')
  for (const token of markdown.parse(source, {})) {
    for (const child of token.children ?? []) {
      const href = child.type === 'link_open' && child.attrGet('href')
      if (!href || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) continue

      const path = decodeURIComponent(href.split(/[?#]/, 1)[0])
      const target = posix.normalize(posix.join(posix.dirname(page), path))
      if (path.startsWith('/') || !pages.has(target)) {
        errors.push(`${page}：${href} 必须指向中文目录中的相对 Markdown 链接`)
      }
    }
  }
}

const affected = new Set()
for (const [source, targets] of Object.entries(mapping)) {
  const pattern = source.endsWith('/') ? source + '**' : source
  if (changed.some(path => matchesGlob(path, pattern))) {
    for (const target of targets) affected.add(target)
  }
}

if (affected.size) {
  console.log('请核对以下章节是否受本次改动影响：')
  for (const page of [...affected].sort()) console.log(`  docs/zh/${page}`)
} else {
  console.log('本次差异没有命中文档映射。')
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`已检查 ${pages.size} 篇中文 Markdown 的页面入口和相对链接。`)
}
