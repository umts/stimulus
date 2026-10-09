import {Controller} from '@hotwired/stimulus';

export default class TemplateController extends Controller {
  public static targets = ['source', 'append'];

  declare public readonly sourceTarget: HTMLTemplateElement;
  declare public readonly appendTarget: HTMLElement;

  public append(): void {
    const content = this.sourceTarget.innerHTML.replaceAll("INDEX", Date.now().toString());
    this.appendTarget.insertAdjacentHTML("beforeend", content);
  }
}
