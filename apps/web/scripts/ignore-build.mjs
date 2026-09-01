import { execSync } from 'node:child_process'

function sh(cmd, cwd) {
	return execSync(cmd, { cwd, encoding: 'utf8' }).trim()
}

let gitRoot
try {
	gitRoot = sh('git rev-parse --show-toplevel')
} catch {
	process.exit(1)
}

const prev = process.env.VERCEL_GIT_PREVIOUS_SHA
const head = process.env.VERCEL_GIT_COMMIT_SHA || 'HEAD'

if (!prev) {
	process.exit(1)
}

let files
try {
	files = sh(`git diff --name-only ${prev} ${head}`, gitRoot)
		.split('\n')
		.filter(Boolean)
} catch {
	process.exit(1)
}

if (files.length === 0) {
	process.exit(1)
}

const onlyStudio = files.every((f) => f.startsWith('apps/studio/'))
process.exit(onlyStudio ? 0 : 1)
