@echo off

rem Enable delayed variable expansion
setlocal enabledelayedexpansion

rem Initialize the command string
set "command=java -jar .\jasmin.jar"

rem Loop through each .j file in the folder and add it to the command
for %%I in (.\output\*.j) do (
    set "command=!command! .\output\%%~nxI"
)

rem Add the output directory option to the command
set "command=!command! -d .\output"

rem Execute the command
!command!

rem Execute java Demo
java -cp .\output Demo

rem End local variable expansion
endlocal
