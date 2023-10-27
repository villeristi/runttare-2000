package internal

import (
	"fmt"
	"time"
)

const (
	LogPrefix          = "[runttare] "
	NatsMaxReconnects  = -1
	NatsReconnectWait  = 5 * time.Second
	NatsRequestTimeout = 5 * time.Second
	BaseTopic          = "runttare"
)

const (
	Idle = iota
	Busy
)

var (
	TopicCount     = fmt.Sprintf("%s.status.count", BaseTopic)
	TopicRuntta    = fmt.Sprintf("%s.runtta", BaseTopic)
	TopicStatus    = fmt.Sprintf("%s.status.status", BaseTopic)
	TopicStatusMsg = fmt.Sprintf("%s.status.status.msg", BaseTopic)
)

type StatusMsg struct {
	Type string `json:"type"`
	Msg  string `json:"message"`
}

type Status int

func (s Status) String() string {
	switch s {
	case Idle:
		return "Idle"
	case Busy:
		return "Busy"
	default:
		return "Unknown"
	}
}
