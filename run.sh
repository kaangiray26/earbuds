#!/bin/sh
# Check if virtual environment exists
if [ ! -d "env" ]; then
    # Create virtual environment
    python3 -m venv env
    env/bin/python3 -m pip install --upgrade pip
    env/bin/python3 -m pip install -r requirements.txt
fi

# Start hypercorn servers
env/bin/python3 -m hypercorn app:app --bind '127.0.0.1:4000'