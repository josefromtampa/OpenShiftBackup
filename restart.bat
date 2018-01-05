
echo restarting %1

if %1 == prod (

echo restarting production
rhc app-restart api --namespace ibhs
) else (

echo restarting test
rhc app-restart test --namespace ibhs
)