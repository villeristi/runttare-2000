package connection

import (
	"errors"
	"fmt"
	"log"

	"github.com/nats-io/nats.go"
	"github.com/villeristi/runttare/internal"
	"github.com/villeristi/runttare/internal/config"
)

var (
	ErrNotConnected            = errors.New("connection nil or closed")
	ErrJetstreamNotInitialized = errors.New("jetstream not initialized")
)

type Connection struct {
	nc *nats.Conn
}

func New() *Connection {
	return &Connection{
		nc: nil,
	}
}

func (conn *Connection) checkConnection() error {
	if conn == nil || !conn.nc.IsConnected() {
		return ErrNotConnected
	}

	return nil
}

func (conn *Connection) Connect(config *config.Config) error {
	if conn.nc != nil && (conn.nc.IsConnected()) {
		log.Println("closing existing NATS server connection")
		conn.nc.Close()
	}

	connectionOptions := []nats.Option{
		nats.RetryOnFailedConnect(true),
		nats.MaxReconnects(internal.NatsMaxReconnects),
		nats.ReconnectWait(internal.NatsReconnectWait),
		nats.ConnectHandler(func(nc *nats.Conn) {
			log.Printf("connected to NATS server: %s", nc.ConnectedUrl())
		}),
		nats.ClosedHandler(func(nc *nats.Conn) {
			log.Printf("disconnected from NATS server: %s", nc.ConnectedUrl())
		}),
		nats.DisconnectErrHandler(func(nc *nats.Conn, err error) {
			if err != nil {
				log.Printf("disconnected error: %s", err.Error())
			}
		}),
		nats.ReconnectHandler(func(nc *nats.Conn) {
			log.Printf("Trying to reconnect")
		}),
	}

	var err error
	conn.nc, err = nats.Connect(config.NatsServer, connectionOptions...)

	if err != nil {
		return fmt.Errorf("server connect failed: %w", err)
	}

	return nil
}

func (conn *Connection) Close() {
	if conn.nc == nil {
		log.Println("connection closed")
		return
	}

	if conn.nc.IsConnected() {
		if err := conn.nc.Drain(); err != nil {
			log.Printf("failed to drain NATS connection: %v", err)
		}

		conn.nc.Close()
	}
}

func (conn *Connection) Subscribe(subject string, callbackFun func(msg *nats.Msg)) (*nats.Subscription, error) {
	err := conn.checkConnection()

	if err != nil {
		return nil, err
	}

	sub, err := conn.nc.Subscribe(subject, callbackFun)

	if err != nil {
		return nil, err
	}

	return sub, nil
}

func (conn *Connection) PublishMsg(msg *nats.Msg) error {
	err := conn.checkConnection()
	if err != nil {
		return err
	}

	err = conn.nc.PublishMsg(msg)
	if err != nil {
		log.Printf("Error publishing: %v", err.Error())
		return err
	}

	log.Printf("Published %s to %s", string(msg.Data), msg.Subject)

	return nil
}

func (conn *Connection) RequestMsg(msg *nats.Msg) (*nats.Msg, error) {
	err := conn.checkConnection()
	if err != nil {
		return nil, err
	}

	reply, err := conn.nc.RequestMsg(msg, internal.NatsRequestTimeout)
	if err != nil {
		log.Printf("Error requesting %s: %v", string(msg.Data), err)
		return nil, err
	}

	log.Printf("Published %s to %s, got reply: %s", string(msg.Data), msg.Subject, string(reply.Data))

	return reply, nil
}
