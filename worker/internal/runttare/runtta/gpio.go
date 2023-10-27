package runtta

import (
	"context"
	"errors"
	"log"
	"sync"

	"github.com/stianeikeland/go-rpio/v4"
	"github.com/villeristi/runttare/internal"
	"github.com/villeristi/runttare/internal/config"
)

type GPIORuntta struct {
	mu        sync.Mutex
	observers []EventObserver
	pinAck    rpio.Pin
	pinPiston rpio.Pin
	pinStatus rpio.Pin
	status    internal.Status
}

func NewGPIORuntta(conf *config.Config) (*GPIORuntta, error) {
	err := rpio.Open()
	if err != nil {
		return nil, err
	}

	pinPiston := rpio.Pin(conf.PinPiston)
	pinStatus := rpio.Pin(conf.PinStatus)
	pinAck := rpio.Pin(conf.PinAck)

	pinPiston.Output()
	pinStatus.Output()

	pinAck.Input()
	pinAck.PullUp()
	pinAck.Detect(rpio.RiseEdge)

	return &GPIORuntta{
		pinPiston: pinPiston,
		pinStatus: pinStatus,
		pinAck:    pinAck,
	}, nil
}

func (gc *GPIORuntta) Runtta(ctx context.Context) error {
	log.Println("beginning runtta...")
	gc.SetStatus(internal.Busy)

	gc.pinPiston.High()
	gc.pinStatus.High()

	if gc.pinAck.EdgeDetected() {
		// ack happened, reset =>
		gc.Reset()
	}

	select {
	case <-ctx.Done():
		gc.SetStatus(internal.Idle)
		gc.Reset()
		return errors.New("reached timeout")
	default:
	}

	return nil
}

func (gc *GPIORuntta) SetStatus(status internal.Status) error {
	gc.status = status
	gc.NotifyObservers("status", int(gc.status))
	return nil
}

func (gc *GPIORuntta) GetStatus() internal.Status {
	return gc.status
}

func (gc *GPIORuntta) AddObserver(observer EventObserver) {
	gc.mu.Lock()
	defer gc.mu.Unlock()

	log.Printf("added observer: %v", observer)
	gc.observers = append(gc.observers, observer)
}

func (gc *GPIORuntta) NotifyObservers(event string, value int) {
	gc.mu.Lock()
	defer gc.mu.Unlock()
	for _, observer := range gc.observers {
		observer.OnEvent(event, int(gc.status))
	}
}

func (gc *GPIORuntta) Close() {
	rpio.Close()
}

func (gc *GPIORuntta) Reset() {
	log.Println("Resetting Runtta")
	gc.pinPiston.Low()
	gc.pinStatus.Low()
	gc.SetStatus(internal.Idle)
}
