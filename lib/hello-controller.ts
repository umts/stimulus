import { Controller } from "@hotwired/stimulus";

export default class HelloController extends Controller {
  public connect(): void {
    this.element.textContent = "Hello World!";
  }
}
