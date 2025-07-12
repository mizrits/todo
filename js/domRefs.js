export const assistBox = document.getElementById('assistBox');
export const taskInput = document.getElementById('taskInput');
export const addButton = document.getElementById('addButton');
export const tagSelectButton = document.getElementById('tagSelectButton');
export const tagDialog = document.getElementById('tagDialog');
export const taskList = document.getElementById('taskList');
export const archivedList = document.getElementById('archivedList');
export const archivedToggle = document.getElementById('archivedToggle');
export const archivedSectionWrapper = document.getElementById('archivedSectionWrapper');
export const chips = document.querySelectorAll('md-assist-chip');
export const sortSelect = document.getElementById('sortSelect');
export const configDialog = document.getElementById('configDialog');
export const configOpenButton = document.getElementById('configOpenButton');
export const configResetButton = document.getElementById('configResetButton');
export const configSaveButton = document.getElementById('configSaveButton');
export const configInput = document.getElementById('configInput');

export let scriptURL = localStorage.getItem('gasScriptURL') || null;

export function setScriptURL(url) {
  scriptURL = url;
  localStorage.setItem('gasScriptURL', url);
}  

export function getScriptURL() {
  return scriptURL;
}
