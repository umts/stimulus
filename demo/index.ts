import "bootstrap";
import { Application } from "@hotwired/stimulus";
import TomSelect from "../lib/tom-select.ts";

const application = Application.start();
application.register("tom-select", TomSelect);
