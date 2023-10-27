package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/villeristi/runttare/internal"
	"github.com/villeristi/runttare/internal/config"
	"github.com/villeristi/runttare/internal/connection"
	"github.com/villeristi/runttare/internal/db"
	"github.com/villeristi/runttare/internal/runttare/handler"
	"github.com/villeristi/runttare/internal/runttare/runtta"
	"github.com/villeristi/runttare/internal/runttare/worker"
)

var (
	SubscriptionTopic = fmt.Sprintf("%s.>", internal.BaseTopic)
	DBName            = "runtta.db"
)

func initializeLogging() {
	log.SetFlags(log.Ldate | log.Ltime | log.LUTC | log.Lmicroseconds | log.Lshortfile)
	log.SetPrefix(fmt.Sprintf("%s ", internal.LogPrefix))
	log.SetOutput(os.Stdout)
}

func initializeNATS(conf *config.Config) (*connection.Connection, error) {
	conn := connection.New()
	if err := conn.Connect(conf); err != nil {
		log.Fatalf("error creating connection: %v", err)
		return nil, err
	}

	return conn, nil
}

func initializeWorker(conn *connection.Connection, conf *config.Config, runtter runtta.RuntterInterface) (*worker.RunttaWorker, error) {
	worker := worker.New(conn)
	db, err := db.NewSQLiteDB(DBName)
	if err != nil {
		return nil, err
	}

	handler := handler.New(conf, runtter, db)

	err = worker.AddHandler(SubscriptionTopic, handler)
	if err != nil {
		return nil, err
	}

	return worker, nil
}

func main() {
	initializeLogging()
	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGTERM, syscall.SIGINT)
	defer cancel()

	configration, err := config.Load()
	if err != nil {
		log.Fatalf("error loading configs: %v", err)
	}

	conn, err := initializeNATS(configration)
	if err != nil {
		log.Fatalf("error initializing nats: %v", err)
	}

	runtter, err := runtta.GetRuntter(configration)
	if err != nil {
		log.Fatalf("failed to instantiate runtter: %v", err)
	}

	defer runtter.Close()

	obs := runtta.NewObserver(conn)
	runtter.AddObserver(obs)

	wrkr, err := initializeWorker(conn, configration, runtter)
	if err != nil {
		log.Fatalf("error initializing Worker: %v", err)
	}

	if err := wrkr.Run(ctx); err != nil {
		log.Fatal(err)
	}
}
