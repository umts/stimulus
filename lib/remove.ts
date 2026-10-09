import { Controller } from "@hotwired/stimulus";

export default class RemoveController extends Controller {
  public remove(): void {
    const parent = this.element.parentElement;
    this.element.remove();
    parent?.dispatchEvent(new CustomEvent('remove:removed', {bubbles: true}));
  }
}
