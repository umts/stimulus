import "bootstrap";
import { Application } from "@hotwired/stimulus";
import PopoverController from "../lib/popover.ts";
import TomSelectController from "../lib/tom-select.ts";

const application = Application.start();
application.register("popover", PopoverController);
application.register("tom-select", TomSelectController);
