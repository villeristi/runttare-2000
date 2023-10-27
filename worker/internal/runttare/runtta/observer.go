package runtta

import (
	"fmt"

	"github.com/nats-io/nats.go"
	"github.com/villeristi/runttare/internal"
	"github.com/villeristi/runttare/internal/connection"
)

type RunttaObserver struct {
	conn *connection.Connection
}

func NewObserver(conn *connection.Connection) *RunttaObserver {
	return &RunttaObserver{
		conn: conn,
	}
}

func (c *RunttaObserver) OnEvent(event string, value int) {
	c.conn.PublishMsg(&nats.Msg{
		Subject: internal.TopicStatus,
		Data:    []byte(fmt.Sprintf("%d", value)),
	})
}
