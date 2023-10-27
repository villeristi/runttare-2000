package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/villeristi/runttare/internal"
	"github.com/villeristi/runttare/internal/config"
	"github.com/villeristi/runttare/internal/connection"
	"github.com/villeristi/runttare/internal/db"
	"github.com/villeristi/runttare/internal/runttare/runtta"
)

type MessageHandler struct {
	runtter runtta.RuntterInterface
	timeout int
	db      db.DBRepository
}

func New(conf *config.Config, runtter runtta.RuntterInterface, db db.DBRepository) *MessageHandler {
	return &MessageHandler{
		runtter: runtter,
		timeout: conf.TimeOut,
		db:      db,
	}
}

func (h *MessageHandler) DoRuntta(msg *nats.Msg, conn *connection.Connection) {
	go func() {
		// Return early if runtter is busy
		if h.runtter.GetStatus() == internal.Busy {
			log.Println("Runtter busy, doing nothing")
			return
		}

		// Create a context that will be canceled after a maximum duration
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*time.Duration(h.timeout))
		defer cancel()

		done := make(chan error)

		go func() {
			err := h.runtter.Runtta(ctx)
			done <- err
		}()

		select {
		case err := <-done:
			if err != nil {
				msg := fmt.Sprintf("Runtta did not complete successfully: %v", err)
				h.Errorcallback(conn, msg)
			} else {
				msg := "Runtta completed successfully!"
				h.SuccessCallback(conn, msg)
			}
		case <-ctx.Done():
			msg := "Runtta operation timed out!"
			h.Errorcallback(conn, msg)
		}
	}()
}

func (h *MessageHandler) Errorcallback(conn *connection.Connection, message string) {
	msgType := "error"
	statusMessage, err := h.formatMessage(message, msgType)
	if err != nil {
		log.Printf("error formatting statusmessage: %v", err)
	}

	// Publish rrror
	conn.PublishMsg(&nats.Msg{
		Subject: internal.TopicStatusMsg,
		Data:    statusMessage,
	})
}

func (h *MessageHandler) SuccessCallback(conn *connection.Connection, message string) {
	count, err := h.db.Increment()
	if err != nil {
		log.Printf("db error: %v", err)
		return
	}

	msgType := "success"
	statusMessage, err := h.formatMessage(message, msgType)
	if err != nil {
		log.Printf("error formatting statusmessage: %v", err)
	}

	// Publish count
	conn.PublishMsg(&nats.Msg{
		Subject: internal.TopicCount,
		Data:    []byte(fmt.Sprintf("%d", count)),
	})

	// Publish StatusMessage
	conn.PublishMsg(&nats.Msg{
		Subject: internal.TopicStatusMsg,
		Data:    statusMessage,
	})
}

func (h *MessageHandler) formatMessage(msg string, msgType string) ([]byte, error) {
	statusMsg := internal.StatusMsg{
		Type: msgType,
		Msg:  msg,
	}

	statusMessage, err := json.Marshal(statusMsg)
	if err != nil {
		return nil, err
	}

	return statusMessage, nil
}

// ReplyCount responds to count-request
func (h *MessageHandler) ReplyCount(msg *nats.Msg, conn *connection.Connection) {
	count, _ := h.db.Count()
	msg.Respond([]byte(fmt.Sprintf("%d", count)))
}

func (r *MessageHandler) MessageHandler(conn *connection.Connection) func(msg *nats.Msg) {
	return func(msg *nats.Msg) {
		var handlers = map[string]func(msg *nats.Msg, conn *connection.Connection){
			// runttare.count.req
			fmt.Sprintf("%s.req", internal.TopicCount): r.ReplyCount,
			internal.TopicRuntta:                       r.DoRuntta,
		}

		handler, ok := handlers[msg.Subject]
		if ok {
			handler(msg, conn)
		}
	}
}
