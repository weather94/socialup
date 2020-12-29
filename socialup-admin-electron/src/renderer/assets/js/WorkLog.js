class WorkLog {
  constructor(type, state, id, tag, text) {
    this.type = type;
    this.state = state;
    this.id = id;
    this.tag = tag;
    this.text = text;
    this.count = 1;
  }
}

export default WorkLog;
