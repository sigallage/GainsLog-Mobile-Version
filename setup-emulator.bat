@echo off
echo Setting up Android emulator port forwarding...
echo.

REM Kill any existing port forwarding
adb forward --remove-all

REM Set up port forwarding from emulator to host
adb forward tcp:8080 tcp:8080

echo Port forwarding set up: emulator:8080 -> host:8080
echo.
echo Now the Android emulator can access your backend at:
echo http://localhost:8080 (from within the emulator)
echo.
echo Press any key to continue...
pause
