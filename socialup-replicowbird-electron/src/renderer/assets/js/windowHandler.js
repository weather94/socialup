import electron from 'electron';

const closeWindow = function closeWindow() {
  electron.remote.getCurrentWindow().close();
}

const openBrowser = function openBrowser(link) {
  electron.shell.openExternal(link);
}

export default {
  closeWindow,
  openBrowser,
}
