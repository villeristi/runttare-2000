#!/bin/bash

set -ex

# Change to homer directory
cd

# Move runttare.service to system-folder
sudo mv ./service/runttare.service /etc/systemd/system/runttare.service

# Enable systemctl-service for runttare
sudo systemctl enable runttare

# Start portainer as service
sudo systemctl start runttare
