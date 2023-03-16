## BoilerPlate Dash Sankhya

Boilerplate para dashboards Sankhya


## 💻 Pré-requisitos

* Node JS

Recomendado:

* VSCode

## 🚀 Instalando BoilerPlate Sankhya

Para instalar o BoilerPlate Sankhya, siga estas etapas:

* Clone o projeto

* Abra um terminal na pasta raiz do projeto e de o comando `npm i`

* Acesse a pasta `src`, abra um terminal e também de o comando  `npm i`

## Como Utilizar

* Crie um novo dash na tela Construtor de componentes de BI.

  <img src="https://user-images.githubusercontent.com/40127216/223520703-d4c0af9f-be36-42cf-84eb-0fde7975e3c1.png" width=50% height=50%>


* Acesse o arquivo `gulpfile.js` e preencha os seguintes parametros.

  ![image](https://user-images.githubusercontent.com/40127216/216656321-5f80814a-7277-4f52-ad09-ee88700f673f.png)
  
* Desenvolva seu código dentro da pastar `src` 

* Ao terminar abra um terminal na pasta `src` e execute o comando `npm run gulp-up`

* No seu dashboard no sankhya defina `entryPoint.jsp` como seu ponto de entrada

  <img src="https://user-images.githubusercontent.com/40127216/223523201-f9fe1f44-f9ca-48f4-8f19-0e407e8594e8.png" width=35% height=35%>


## Comandos Disponiveis

Pasta raiz:
```
npm run zip      \\Organiza os arquivos da pasta src na pasta build, empacota em um zip e o disponibiliza na pasta dist
npm run gulp     \\Mesmo funcionamento do comando zip 
npm run clear    \\Exclui os arquivos da pasta build e dist
npm run build    \\Executa clear e organiza os arquivos da pasta src
npm run up       \\Envia o zip para o dash configurado no arquivo gulpfile.js
```
