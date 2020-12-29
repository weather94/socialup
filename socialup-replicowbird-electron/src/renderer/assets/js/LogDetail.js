class LogDetail {
  constructor(type, omit, email, date, date2, time, value, text, flag) {
    this.type = type;
    this.omit = omit;
    this.email = email;
    this.date = date;
    this.date2 = date2;
    this.time = time;
    this.value = value;
    this.text = text;
    this.flag = (flag) ? flag : false;
  }
}

export default LogDetail;
