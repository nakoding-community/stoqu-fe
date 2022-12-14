#!/bin/sh
npm run build
git add .
git commit -m 'Build & Deploy'
git pull origin
git push origin 