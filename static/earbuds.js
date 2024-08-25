document.addEventListener("DOMContentLoaded", async () => {
    window.earbuds = new Listener();
    console.log("Earbuds loaded.");
});

class Listener {
    constructor() {
        // Set player
        this.player = document.querySelector("audio");

        // Set state
        this.active = false;

        // Taps to assign
        this.taps_to_assign = 0;

        // Event listeners for mediaSession
        navigator.mediaSession.playbackState = "none";
        navigator.mediaSession.setActionHandler("play", async () => {
            this.tap("1");
        });
        navigator.mediaSession.setActionHandler("pause", async () => {
            this.tap("1");
        });
        navigator.mediaSession.setActionHandler("nexttrack", async () => {
            this.tap("2");
        });
        navigator.mediaSession.setActionHandler("previoustrack", async () => {
            this.tap("3");
        });
    }

    async toggle() {
        this.active = !this.active;
        if (this.active) {
            this.start();
            return;
        }
        this.stop();
    }

    async stop() {
        this.player.pause();
        navigator.mediaSession.playbackState = "paused";
        console.log("Stopped playing.");
        update_ref("active", false);
    }

    async start() {
        this.player.play();
        // Update media session
        navigator.mediaSession.metadata = new MediaMetadata({
            title: "Earbuds",
            artist: "kaangiray26",
            artwork: [
                {
                    src: "/static/512.png",
                    sizes: "512x512",
                    type: "image/png",
                },
            ],
        });
        navigator.mediaSession.playbackState = "playing";
        // Mute the player
        setTimeout(() => {
            this.player.volume = 0;
        }, 500);
        console.log("Started playing.");
        update_ref("active", true);
    }

    async tap(amount) {
        console.log(`Tapped ${amount} times.`);
        const response = await fetch("/action", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taps: amount,
            }),
        }).then((res) => res.json());
    }

    async open_menu(taps) {
        // Save taps
        this.taps_to_assign = taps;

        // Get dialog with action list
        const actions = await fetch("/actions").then((res) => res.text());

        // Show dialog
        const dialog = document.querySelector("#dialog");
        dialog.innerHTML = actions;
        dialog.showModal();
    }

    async assign_action() {
        // Get selected action
        let action = document.querySelector("li[checked] span");
        if (!action) return;

        // Assign action
        await fetch("/assign", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taps: this.taps_to_assign,
                action: action.innerText,
            }),
        }).then((res) => res.json());

        // Change tap image src
        document.querySelector(`img[taps="${this.taps_to_assign}"]`).src =
            `/static/tapped.svg`;
        document.querySelector("dialog").close();
    }
}

function update_ref(key, val) {
    // Find element with attribute ref="key"
    let el = document.querySelector(`[ref="${key}"]`);
    el.innerText = val;
}

async function select_item(el) {
    // Uncheck element
    if (el.getAttribute("checked")) {
        el.removeAttribute("checked");
        return;
    }

    // Uncheck all elements
    [...document.querySelectorAll("li")].map((el) =>
        el.removeAttribute("checked"),
    );

    // Check element
    el.setAttribute("checked", "true");
}
