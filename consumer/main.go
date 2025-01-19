package main

import (
	"encoding/json"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

type FileMeta struct {
    Name string `json:"name"`
    Size int `json:"size"`
    ContentType string `json:"content-type"`
    Content string `json:"content"`
}

func main() {
    
    conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
    handleError(err)
    defer conn.Close()
    
    ch, err := conn.Channel()
    handleError(err)
    defer ch.Close()

    q, err := ch.QueueDeclare("hello", false, false, false, false, nil)
    handleError(err)

    msgs, err := ch.Consume(
        q.Name,
        "",
        true,
        false,
        false,
        false,
        nil,
    )
    handleError(err)

    var forever chan struct{}

    go func() {
        for d := range msgs {

            var metadata FileMeta

            err := json.Unmarshal(d.Body, &metadata)
            if err != nil {
                fmt.Println(err)
            }

            fmt.Printf("%v \n", metadata.Size)
        }
    }()

    fmt.Println("Waiting for messages")
    <- forever
}

func handleError(err error){
    if err != nil {
        fmt.Printf("%s", err)
    }
}

