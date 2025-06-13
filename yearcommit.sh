#!/bin/bash

# Config
GIT_AUTHOR_NAME="Mahendra Gohil"
GIT_COMMITTER_NAME="Mahendra Gohil"
GIT_AUTHOR_EMAIL="mpgohilse@gmail.com"
GIT_COMMITTER_EMAIL="mpgohilse@gmail.com"

touch .contrib.txt

for i in {0..364}
do
  # Get date i days ago in required format
  day=$(date -v -${i}d "+%Y-%m-%d")

  for j in {0..2}
  do
    # Use different times for each commit (ensures uniqueness)
    hour=$((10 + j))
    timestamp="${day}T${hour}:00:00 +0530"

    echo "$timestamp commit $j" >> .contrib.txt
    git add .contrib.txt

    GIT_AUTHOR_DATE="$timestamp" \
    GIT_COMMITTER_DATE="$timestamp" \
    git commit -m "daily commit on $day - $j"
  done
done

# Push all commits
git push origin main
