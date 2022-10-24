@echo off

if [%1]==[] goto missing

echo Building docker image for version %1
docker build -t krsogaard/wewelo-roi-calculator:%1 .
echo Pushing version %1 to docker hub
docker push krsogaard/wewelo-roi-calculator:%1
echo Tagging version %1 as latest
docker tag krsogaard/wewelo-roi-calculator:%1 krsogaard/wewelo-roi-calculator:latest
echo Pushing version latest to docker hub
docker push krsogaard/wewelo-roi-calculator:latest
goto :eof


:missing
@echo Version argument is missing