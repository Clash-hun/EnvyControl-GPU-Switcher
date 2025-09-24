const Applet = imports.ui.applet;
const PopupMenu = imports.ui.popupMenu;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;

class EnvyControlApplet extends Applet.IconApplet {
    constructor(metadata, orientation, panel_height, instance_id) {
        super(orientation, panel_height, instance_id);

        this.metadata = metadata;
        this.currentMode = "unknown";
        this.icon_base = this.metadata.path + "/icons/";

        this.set_applet_tooltip("EnvyControl GPU Switcher");

        // Menü
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);

        this.createMenuItems();

        // Első ikon + lekérdezés
        this.updateIcon();
        this.getCurrentModeAsync();

        // Időzített frissítés
        this.timer = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT, 10,
            () => { this.getCurrentModeAsync(); return true; }
        );
    }

    createMenuItems() {
        this.currentModeItem = new PopupMenu.PopupMenuItem("Jelenlegi mód: ...", { reactive: false });
        this.menu.addMenuItem(this.currentModeItem);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        this.intelItem = new PopupMenu.PopupMenuItem("Intel (Integrated)");
        this.intelItem.connect("activate", () => this.switchMode("intel"));
        this.menu.addMenuItem(this.intelItem);

        this.hybridItem = new PopupMenu.PopupMenuItem("Hybrid");
        this.hybridItem.connect("activate", () => this.switchMode("hybrid"));
        this.menu.addMenuItem(this.hybridItem);

        this.nvidiaItem = new PopupMenu.PopupMenuItem("NVIDIA");
        this.nvidiaItem.connect("activate", () => this.switchMode("nvidia"));
        this.menu.addMenuItem(this.nvidiaItem);

        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        let refreshItem = new PopupMenu.PopupMenuItem("Frissítés");
        refreshItem.connect("activate", () => this.getCurrentModeAsync());
        this.menu.addMenuItem(refreshItem);
    }

    getCurrentModeAsync() {
        Util.spawn_async(["envycontrol", "--query"], (stdout) => {
            try {
                let out = (stdout || "").toString().toLowerCase().trim();
                if (out.includes("intel")) this.currentMode = "intel";
                else if (out.includes("hybrid")) this.currentMode = "hybrid";
                else if (out.includes("nvidia")) this.currentMode = "nvidia";
                else this.currentMode = "unknown";
            } catch (e) {
                global.logError("getCurrentModeAsync parse error: " + e);
                this.currentMode = "error";
            }
            this.updateIcon();
            this.updateMenu();
        });
    }

    updateIcon() {
        let name = (this.currentMode === "intel" || this.currentMode === "hybrid" || this.currentMode === "nvidia")
            ? this.currentMode : "icon";
        let path = this.icon_base + name + ".png";
        if (Gio.File.new_for_path(path).query_exists(null))
            this.set_applet_icon_path(path);
        else
            this.set_applet_icon_name("video-display");
    }

    updateMenu() {
        let text = "Jelenlegi mód: ";
        if (this.currentMode === "intel") text += "Intel (Integrated)";
        else if (this.currentMode === "hybrid") text += "Hybrid";
        else if (this.currentMode === "nvidia") text += "NVIDIA";
        else if (this.currentMode === "error") text += "Hiba történt";
        else text += "Ismeretlen";
        this.currentModeItem.label.set_text(text);
    }

    switchMode(mode) {
        this.set_applet_icon_symbolic_name("process-working-symbolic");
        this.set_applet_tooltip(`Switching to ${mode}...`);

        Util.spawn_async(["pkexec", "envycontrol", "-s", mode], () => {
            Util.spawnCommandLine(`notify-send -t 0 "EnvyControl" "GPU mód átállítva: ${mode}\nÚjraindítás szükséges!"`);
            GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 1, () => { this.getCurrentModeAsync(); return false; });
        });
    }

    on_applet_clicked(event) {
        this.menu.toggle();
    }

    on_applet_removed_from_panel() {
        if (this.timer) {
            GLib.source_remove(this.timer);
            this.timer = null;
        }
    }
}

function main(metadata, orientation, panel_height, instance_id) {
    return new EnvyControlApplet(metadata, orientation, panel_height, instance_id);
}

