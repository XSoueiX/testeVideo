
const { src, dest, series } = require('gulp');
const axios = require('axios');
var clean   = require('gulp-clean');
var gzip     = require('gulp-zip');
var merge   = require('merge-stream');
var FormData = require('form-data');

const fs = require('fs');
const form = new FormData();

const url = '' //informar URL do servidor sankhya que deseja utilizar

let usuario = '' //Informar usuario para autentificação
let senha = '' //Informar senha para autentificação

let codgdg = ''  // Numero unico do dashboard



function build(){
  var entry = src('src/entryPoint.jsp')
  .pipe(dest('build'));
  var index = src('src/index.html')
  .pipe(dest('build/src'));
  var lib = src('src/libs/**')
  .pipe(dest('build/src/libs'));
  var js = src('src/js/**')
  .pipe(dest('build/src/js'));
  var node = src('src/node_modules/**')
  .pipe(dest('build/src/node_modules'));

  return merge(entry, index, lib, js, node);
};

function zip() {
  return src('build/**')
      .pipe( gzip('archive.zip'))
      .pipe(dest('dist'));
};

function clear() {
  var build = src('build', {read: false , allowEmpty:true})
      .pipe(clean());
  var dist = src('dist', {read: false, allowEmpty:true})
      .pipe(clean());

  return merge(build, dist);
};

async function login(){
try {
  const response = await axios.post(url+'/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json',{
    "serviceName": "MobileLoginSP.login",
    "requestBody": {
        "NOMUSU": {
            "$": usuario
        },
        "INTERNO": {
            "$": senha
        },
        "KEEPCONNECTED": {
            "$": "S"
        }
    }
})
// console.log(response.data.responseBody.jsessionid['$']);

let jsessionid = response.data.responseBody.jsessionid['$']

const stream = fs.createReadStream('dist/archive.zip');

form.append('arquivo',stream);
const formHeaders = form.getHeaders();

const sended = await axios.post(url+'/mge/sessionUpload.mge?sessionkey=Gadget_ZIP&fitem=S&salvar=S&useCache=N',
form,{
  headers: {
      ...form.getHeaders(),
      'Content-Type': 'multipart/form-data',
      "Cookie": `JSESSIONID=${jsessionid}`
  }
})

const update = await axios.get(url+'/mge/service.sbr?serviceName=CRUDServiceProvider.saveRecord&outputType=json&mgeSession='+jsessionid
,{headers: {
  "Cookie": `JSESSIONID=${jsessionid}`
},
data: { 
  "requestBody":{
     "dataSet":{
        "rootEntity":"Gadget",
        "includePresentationFields":"N",
        "dataRow":{
                     "key" : {
                           "NUGDG": {
                     "$": codgdg
                 }
                       },
           "localFields": {
                               "HTML5" : { "$" : "$file.session.key{Gadget_ZIP}"}
             }
        }, "entity":{
           "fieldset":{
              "list":""
           }
        }
     }
  }
}})

console.log(update.data.responseBody.entities)
} catch (error) {
  console.error(error);
}

}


exports.clear = clear;
exports.build = series(clear, build);
exports.zip = series( build , zip);
exports.default = series( build , zip);
exports.login = series( build, zip, login);


