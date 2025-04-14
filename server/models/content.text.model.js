import Stack from "./stack.model.js";

class ContentContext {
  constructor(text) {
    this.latest = text;
    this.archive = new Stack();
  }

  #_update_Content = (message, newlatest) => {
    if (message.latest) {
      message.archive.push(message.latest);
    }
    message.latest = newlatest;
  };

  setLatest(newlatest) {
    this.#_update_Content(this, newlatest);
  }

  asArray() {
    return [...this.archive.toArray(), this.latest];
  }
}

export default ContentContext;
