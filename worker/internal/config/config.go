package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/knadh/koanf/providers/env"
	"github.com/knadh/koanf/providers/posflag"
	"github.com/knadh/koanf/v2"
	flag "github.com/spf13/pflag"
)

const (
	// The prefix to use for environment variables.
	envNamespace      = "RUNTTARE_"
	usageText         = "Runttare 2000.\n\nNote! Environment variables prefixed with RUNTTARE_ take precedence over command line flags."
	DefaultNatsServer = "nats://127.0.0.1:4222"
	DefaultPinAck     = 22
	DefaultPinPiston  = 17
	DefaultPinStatus  = 27
	DefaultSimulate   = false
	DefaultTimeOut    = 3
)

// Config is the configuration for Runttare.
type Config struct {
	NatsServer string `koanf:"nats-server"`
	PinPiston  int    `koanf:"pin-status"`
	PinStatus  int    `koanf:"pin-piston"`
	PinAck     int    `koanf:"pin-ack"`
	Simulate   bool   `koanf:"simulate"`
	TimeOut    int    `koanf:"timeout"`
}

// Load loads the configuration from the environment and command line flags.
func Load() (*Config, error) {
	var K = koanf.New(".")
	var config Config

	f := getFlagSet()

	if err := K.Load(posflag.Provider(f, ".", K), nil); err != nil {
		return nil, err
	}

	K.Load(env.Provider(envNamespace, ".", func(s string) string {
		return strings.Replace(strings.ToLower(
			strings.TrimPrefix(s, envNamespace)), "_", "-", -1)
	}), nil)

	K.UnmarshalWithConf("", &config, koanf.UnmarshalConf{FlatPaths: true})

	return &config, nil
}

// getFlagSet returns a flagset with the default configuration.
func getFlagSet() *flag.FlagSet {
	f := flag.NewFlagSet("config", flag.ContinueOnError)
	f.Usage = func() {
		fmt.Println(usageText)
		fmt.Println("options:")
		fmt.Println(f.FlagUsages())
		os.Exit(0)
	}

	f.BoolP("simulate", "s", DefaultSimulate, "Simulate GPIO")
	f.StringP("nats-server", "n", DefaultNatsServer, "The NATS server to connect to")
	f.IntP("pin-piston", "", DefaultPinPiston, "Piston PIN")
	f.IntP("pin-status", "", DefaultPinStatus, "Status PIN")
	f.IntP("pin-ack", "", DefaultPinAck, "Acknowledgment PIN")
	f.IntP("runtta-timeout", "t", DefaultTimeOut, "Timeout for single runtta")

	f.Parse(os.Args[1:])

	return f
}
