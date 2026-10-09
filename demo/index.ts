import "@fortawesome/fontawesome-free/css/all.min.css";
import { Application } from "@hotwired/stimulus";
import "bootstrap";
import ClipboardController from "../lib/clipboard.ts";
import PopoverController from "../lib/popover.ts";
import TemplateController from "../lib/template.ts";
import TomSelectController from "../lib/tom-select.ts";

const application = Application.start();
application.register("clipboard", ClipboardController);
application.register("popover", PopoverController);
application.register("template", TemplateController);
application.register("tom-select", TomSelectController);
