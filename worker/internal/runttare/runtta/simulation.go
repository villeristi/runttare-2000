package runtta

import (
	"context"
	"errors"
	"log"
	"math/rand"
	"sync"
	"time"

	"github.com/villeristi/runttare/internal"
)

type SimulationRuntta struct {
	status    internal.Status
	observers []EventObserver
	mu        sync.Mutex
}

func NewSimulationRuntta() *SimulationRuntta {
	return &SimulationRuntta{}
}

func (s *SimulationRuntta) AddObserver(observer EventObserver) {
	s.mu.Lock()
	defer s.mu.Unlock()

	log.Printf("added observer: %v", observer)
	s.observers = append(s.observers, observer)
}

func (s *SimulationRuntta) NotifyObservers(event string, value int) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, observer := range s.observers {
		observer.OnEvent(event, int(s.status))
	}
}

func (s *SimulationRuntta) Runtta(ctx context.Context) error {
	maxDuration := 4
	minDuration := 2
	randDuration := rand.Intn(maxDuration-minDuration) + minDuration

	log.Println("beginning runtta...")
	s.SetStatus(internal.Busy)

	// Simulate some work.
	time.Sleep(time.Second * time.Duration(randDuration))
	s.Reset()

	select {
	case <-ctx.Done():
		return errors.New("reached timeout")
	default:
		return nil
	}
}

func (s *SimulationRuntta) SetStatus(status internal.Status) error {
	s.status = status
	s.NotifyObservers("status", int(s.status))
	return nil
}

func (s *SimulationRuntta) GetStatus() internal.Status {
	return s.status
}

func (s *SimulationRuntta) Close() {
	log.Println("Closing simulationRuntta")
}

func (s *SimulationRuntta) Reset() {
	log.Println("Resetting")
	s.SetStatus(internal.Idle)
}
