echo
echo committing updates for %1
git add .
git commit -m "%1 deploy"

echo 
echo deploying to %1
git push %1