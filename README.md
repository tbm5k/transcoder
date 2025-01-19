## Video Transcoder

AWS Elastic Transcoder is advertised as **cost effective** but in essence it isn't... 

### Usage
1. ```docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management```

#### Publishing
1. ```cd publisher```
1. ```go run main.go```

#### Consuming
1. ```cd consumer```
1. ```go run main.go```
