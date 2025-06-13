#!/bin/bash

start_date=$(date -v-365d +%Y-%m-%d)

messages=(
  "update readme: added dark mode screenshot"
  "update readme: added schema design of aggregation"
  "update readme: changed feature description"
  "update readme: changed ENV description"
)

for i in {0..4}; do
  commit_date=$(date -v+${i}d -j -f "%Y-%m-%d" "$start_date" +%Y-%m-%d)

  echo "Committing for date: $commit_date"

  for j in {0..2}; do
    msg_index=$(((i * 3 + j) % ${#messages[@]}))
    commit_msg="${messages[$msg_index]}"

    echo "<!-- schema update $commit_date $j -->" >> README.md

    git add README.md

    hour="12"
    minute="0$j"
    timestamp="${commit_date}T${hour}:0$j:00"

    GIT_AUTHOR_DATE="$timestamp" GIT_COMMITTER_DATE="$timestamp" git commit -m "$commit_msg"
  done
done

git push origin main
