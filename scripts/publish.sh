#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
repo_name="${1:-jlpt-n5-lab}"
[[ "$repo_name" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]] || { echo 'Nome repository non valido.' >&2; exit 1; }
command -v gh >/dev/null || { echo 'Installa GitHub CLI: https://cli.github.com/' >&2; exit 1; }
owner="$(gh api user --jq .login)"
repo="$owner/$repo_name"
[[ "$(git branch --show-current)" == main ]] || { echo 'Usare il branch main.' >&2; exit 1; }
[[ -z "$(git status --porcelain)" ]] || { echo 'Salvare tutte le modifiche con un commit prima di pubblicare.' >&2; exit 1; }
git rev-parse --verify HEAD >/dev/null
if git remote get-url origin >/dev/null 2>&1; then
 remote_url="$(git remote get-url origin)"
 [[ "$remote_url" == "https://github.com/$repo.git" || "$remote_url" == "https://github.com/$repo" || "$remote_url" == "git@github.com:$repo.git" ]] || { echo 'Il remoto origin non corrisponde alla destinazione.' >&2; exit 1; }
fi
if gh repo view "$repo" --json nameWithOwner >/dev/null 2>&1; then
 visibility="$(gh api "repos/$repo" --jq .private)"
 [[ "$visibility" == false ]] || { echo 'La repository esistente deve essere pubblica.' >&2; exit 1; }
 branches="$(gh api "repos/$repo/branches" --jq length)"
 if [[ "$branches" != 0 ]]; then
  remote_sha="$(gh api "repos/$repo/commits/main" --jq .sha)"
  [[ "$remote_sha" == "$(git rev-parse HEAD)" ]] || { echo 'La repository contiene già codice diverso: interruzione senza modifiche.' >&2; exit 1; }
 fi
else
 gh repo create "$repo" --public --description 'Laboratorio in italiano per preparare il JLPT N5: flashcard, grammatica, quiz e simulazioni ufficiali.'
fi
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$repo.git"
gh auth setup-git
git push -u origin main
if ! gh api "repos/$repo/pages" >/dev/null 2>&1; then
 gh api --method POST "repos/$repo/pages" -f 'source[branch]=main' -f 'source[path]=/' >/dev/null
fi
gh api "repos/$repo/pages" --jq '{url: .html_url, status: .status, source: .source}'
echo 'Pages configurato. Il deploy può richiedere alcuni minuti; verifica lo stato nella scheda Actions.'
