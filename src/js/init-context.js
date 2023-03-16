const urlSankhya = window.location.search;
var parametros = new URLSearchParams(urlSankhya);
var contextPage = window.parent.dashboard[parametros.get('nuGdg')];

function openApp(resourceID, params) { contextPage.openApp(resourceID, params); }
function openLevel(leveID, params) { contextPage.openLevel(leveID, params); }