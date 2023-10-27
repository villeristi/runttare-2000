package runtta

import (
	"context"
	"sync"

	"github.com/villeristi/runttare/internal"
	"github.com/villeristi/runttare/internal/config"
)

var instance RuntterInterface
var runtterErr error
var once sync.Once

type RuntterInterface interface {
	Runtta(ctx context.Context) error
	SetStatus(newStatus internal.Status) error
	GetStatus() internal.Status
	AddObserver(observer EventObserver)
	NotifyObservers(event string, value int)
	Reset()
	Close()
}

type EventObserver interface {
	OnEvent(event string, value int)
}

// GetRuntter returns runtter based on configuration as a Singleton
func GetRuntter(conf *config.Config) (RuntterInterface, error) {
	once.Do(func() {
		if conf.Simulate {
			instance = NewSimulationRuntta()
		} else {
			instance, runtterErr = NewGPIORuntta(conf)
		}
	})

	return instance, runtterErr
}
