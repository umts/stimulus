import "bootstrap";
import { Application } from "@hotwired/stimulus";
import HelloController from "../lib/hello-controller.ts";

const application = Application.start();
application.register("hello", HelloController);
