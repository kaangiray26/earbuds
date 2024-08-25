import subprocess

class Actions:
    def screenshot(self):
        subprocess.run(["gnome-screenshot", "-w", "-f", "/tmp/earbuds.png"])

    def open_whatsapp(self):
        subprocess.run(["xdg-open", "https://web.whatsapp.com/"])

    def next_workspace(self):
        # Combination: Ctrl+Alt+Right
        subprocess.run(["xdotool", "key", "ctrl+alt+Right"])

    def previous_workspace(self):
        # Combination: Ctrl+Alt+Left
        subprocess.run(["xdotool", "key", "ctrl+alt+Left"])

    def close_window(self):
        # Combination: Alt+F4
        subprocess.run(["xdotool", "key", "ctrl+w"])