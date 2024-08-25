#!/bin/sh
# Start hypercorn with debug mode enabled
env/bin/python3 -m hypercorn app:app --bind '127.0.0.1:4000' --reload --debug