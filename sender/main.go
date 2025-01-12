package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type ReqBody struct {
    URL string `json:"url"`
}

func main() {
    conn := connectQueue()

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

        if r.Method == http.MethodGet {
            fmt.Fprintln(w, "Hello")
        }

        if r.Method == http.MethodPost {
            // post the received message to the message queue
            // var body ReqBody
            // err := json.NewDecoder(r.Body).Decode(&body)
            // handleError(err)

            // fmt.Printf("Add to queue: %s \n", body.URL)

            // messenger(conn, body.URL)

            file, header, err := r.FormFile("file")
            handleError(err)
            defer file.Close()

            fmt.Printf("filename %s \n", header.Filename)
        }
    })

    log.Fatal(http.ListenAndServe(":8080", nil))
}

func connectQueue() *amqp.Connection {
    conn,  err := amqp.Dial("amqp://guest:guest@localhost:5672/")
    handleError(err)
    defer conn.Close()

    return conn
}

func messenger(conn *amqp.Connection, message string) {

    ch, err := conn.Channel()
    handleError(err)
    defer ch.Close()
    
    q, err := ch.QueueDeclare("hello", false, false, false, false, nil)
    handleError(err)
    
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    err = ch.PublishWithContext(ctx,
        "",
        q.Name,
        false,
        false,
        amqp.Publishing{
            ContentType: "text/plain",
            Body: []byte(message),
        },
    )
    handleError(err)
    fmt.Printf("Sent: %s", message)
}

func handleError(err error) {
    if err != nil {
        fmt.Printf("%s", err)
    }
}

