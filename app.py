#!env/bin/python3
# -*- coding: utf-8 -*-

import json
import secrets
import subprocess
from quart import Quart, render_template, request, session
from lib.actions import Actions

app = Quart(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.secret_key = secrets.token_urlsafe(16)

# Auto-assign actions to taps
actions = Actions()
action_library = {func: getattr(actions, func) for func in dir(actions) if not func.startswith("__")}

async def do_action(taps):
    name = session.get(taps)
    if not name:
        print(f"No action assigned to {taps}x Tap.")
        return

    print(f"Running action: {name}")
    action_library[name]()

@app.route("/")
async def index():
    return await render_template("index.html")

@app.route("/action", methods=["POST"])
async def action():
    data = await request.get_json()
    taps = data.get("taps")
    app.add_background_task(do_action, taps)
    return json.dumps({"status": "ok"})

@app.route("/actions")
async def get_actions():
    names = list(action_library.keys())
    return await render_template("actions.html", actions=names)

@app.route("/assign", methods=["POST"])
async def assign():
    # Assign an action to a tap
    data = await request.get_json()
    taps = data.get("taps")
    action = data.get("action")
    session[taps] = action
    print(f"Assigned {action} to {taps}x Tap.")
    return json.dumps({"success": True})