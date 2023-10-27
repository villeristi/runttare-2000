package worker

import (
	"context"
	"log"
	"sync"

	"github.com/villeristi/runttare/internal/connection"
	"github.com/villeristi/runttare/internal/runttare/handler"
)

type RunttaWorker struct {
	conn *connection.Connection
}

func New(con *connection.Connection) *RunttaWorker {
	return &RunttaWorker{
		conn: con,
	}
}

// AddHandler adds a handler to worker
func (w *RunttaWorker) AddHandler(subject string, handler *handler.MessageHandler) error {
	subscription, err := w.conn.Subscribe(subject, handler.MessageHandler(w.conn))

	if err != nil {
		log.Printf("Error subscribing to subject %s: %v", subject, err)
		return err
	}

	log.Printf("subscribed to %s", subscription.Subject)

	return nil
}

// Run starts the aggregator
func (w *RunttaWorker) Run(ctx context.Context) error {
	log.Println("RunttaWorker running...")

	var wg sync.WaitGroup
	wg.Add(1)

	go func() {
		defer wg.Done()
		defer w.conn.Close()

		<-ctx.Done()
	}()

	wg.Wait()

	return nil
}
