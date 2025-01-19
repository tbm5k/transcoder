package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type FileMetadata struct {
    Name string `json:"name"`
    Size int64 `json:"size"`
    ContentType string `json:"content-type"`
    Data string `json:"data"`
}

func main() {
    conn := connectQueue()
    defer conn.Close()

    vidReg := regexp.MustCompile(`^video/`)
    reqReg := regexp.MustCompile(`^multipart/form-data`)


    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

        if r.Method == http.MethodPost {

            fmt.Println(r.Header.Get("Content-Type"))
            if !reqReg.MatchString(r.Header.Get("Content-Type")) {
                w.WriteHeader(http.StatusBadRequest)
                fmt.Fprintln(w, "Invalid content type")
                return
            }
            
            file, header, err := r.FormFile("file")
            if err != nil {
                fmt.Println(err)
                return
            }
            defer file.Close()

            isVideo := vidReg.MatchString(header.Header.Get("Content-Type"))
            if !isVideo {
                w.WriteHeader(http.StatusBadRequest)
                fmt.Fprintln(w, "Invalid file type")
                return
            }

            buffer := make([]byte, header.Size)

            data := FileMetadata {
                Name: header.Filename,
                Size: header.Size,
                ContentType: header.Header.Get("Content-Type"),
                Data: string(buffer),
            }

            publisher(conn, data)
            fmt.Printf("%s pushed to queue\n", header.Filename)
            msg := fmt.Sprintf("Pushed to queue: %s\n", header.Filename)
            fmt.Fprint(w, msg)
        }
    })

    log.Fatal(http.ListenAndServe(":8080", nil))
}

func connectQueue() *amqp.Connection {
    conn,  err := amqp.Dial("amqp://guest:guest@localhost:5672/")
    if err != nil {
        fmt.Println(err)
    }

    return conn
}

func publisher(conn *amqp.Connection, message FileMetadata) {

    ch, err := conn.Channel()
    if err != nil {
        fmt.Println(err)
    }
    defer ch.Close()
    
    q, err := ch.QueueDeclare("hello", false, false, false, false, nil)
    if err != nil {
        fmt.Println(err)
        return
    }
    
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    
    data, err := json.Marshal(message)
    if err != nil {
        fmt.Println("Error marshalling data")
        return
    }
    err = ch.PublishWithContext(ctx,
        "",
        q.Name,
        false,
        false,
        amqp.Publishing{
            ContentType: "text/plain",
            Body: data,
        },
    )
    if err != nil {
        fmt.Println("Error publishing msg")
        return
    }
    fmt.Printf("Sent: %s", message.Name)
}

