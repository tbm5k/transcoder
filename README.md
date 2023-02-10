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

## Architecture

### Video resolutions

| Type | Name | Pixel size |
| ---- | ---- | ---------- |
| SD   | 360p | 640 x 360  |
| SD   | 480p | 640 x 480  |
| HD   | 720p | 1280 x 720 |
| FHD  | 1080p| 1920 x 1080|
| QHD  | 1440p| 2560 x 1440|
| UHD  | 4K   | 3840 x 2160|
| FUHD | 8K   | 7680 x 4320|   

> Resolution names e.g 1080p come from the vertical pixel count