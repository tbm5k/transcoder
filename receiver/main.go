package main

import (
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

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
            fmt.Printf("%s \n", d.Body)
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

