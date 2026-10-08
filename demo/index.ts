import "@fortawesome/fontawesome-free/css/all.min.css";
import { Application } from "@hotwired/stimulus";
import "bootstrap";
import ClipboardController from "../lib/clipboard.ts";
import PopoverController from "../lib/popover.ts";
import TomSelectController from "../lib/tom-select.ts";

const application = Application.start();
application.register("clipboard", ClipboardController);
application.register("popover", PopoverController);
application.register("tom-select", TomSelectController);
