import { Application, type ControllerConstructor } from "@hotwired/stimulus";
import {type Locator, page} from "vitest/browser";

let application: Application | null = null;
let root: HTMLElement | null = null;

export function start(): void {
  application = Application.start();
}

export function register(name: string, controller: ControllerConstructor): void {
  application?.register(name, controller);
}

export function render(html: string): Locator {
  root = document.createElement("div");
  root.innerHTML = html;
  document.body.append(root);
  return page.elementLocator(root);
}

export function stop(): void {
  application?.stop();
  application = null;
  root?.remove();
  root = null;
}
