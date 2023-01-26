# Transcoder

A service that converts a video into different resolutions allowing clients facilitate **adaptive bitrate streaming**.

> The service is still under development

## Installation

* Nodejs 16+
* Docker
* Yarn

## Running

Get docker daemon is up and running
1. ```docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.11-management```
2. ```yarn```
3. ```yarn consumer:dev```
4. ```yarn publisher:dev xyz```

> You can replace the xyz with text you'd like and also run multiple consumers *(step 3)*