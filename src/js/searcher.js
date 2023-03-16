angular.module("moduloTeste", ['standalone.serviceproxy']).service("customUtils", ['$q', 'ServiceProxy',
    function ($q, ServiceProxy) {
        var self = this;

        self.loadFromQuery = loadFromQuery;
        self.loadFromQuery_old = loadFromQuery_2;
        self.doRequest = doRequest;
        self.doRequest_old = doRequest_old;

        var VALUES_PER_CLAUSE = 1000;


        /**
        * Faz a pesquisa no banco e identifica cada solicitação
        * @param {String} select       Select da Requisição
        * @param {String} from         From da Requisição
        * @param {String} where        Where da Requisição
        * @param {Boolean} fullLine    Se true retorna todas as linhas da pesquisa, se false somente a primeira
        * @param {String} ID           Identificador da pesquisa
        * @return {Promise}            Promessa da Pesquisa
        */
        function doRequest_old(select, from, where, fullLine, ID) {
            let deferred = $q.defer();

            let p = loadFromQuery_old(select, from, where, fullLine);
            p.then(function (response) {
                deferred.resolve({ id: ID, response: response });
            }, function (erro) {
                deferred.reject(erro);
            })

            return deferred.promise;
        }

        /**
        * Faz a pesquisa no banco e identifica cada solicitação
        * @param {String} select       Select da Requisição
        * @param {String} from         From da Requisição
        * @param {String} where        Where da Requisição
        * @param {Boolean} fullLine    Se true retorna todas as linhas da pesquisa, se false somente a primeira
        * @param {String} ID           Identificador da pesquisa
        * @return {Promise}            Promessa da Pesquisa
        */
        function doRequest(select, from, where, fullLine, ID) {
            let deferred = $q.defer();

            let p = loadFromQuery(select, from, where, fullLine);
            p.then(function (response) {
                deferred.resolve({ id: ID, response: response });
            }, function (erro) {
                deferred.reject(erro);
            })

            return deferred.promise;
        }

        function loadFromQuery(columnsName, tableName, whereOrderGroup, fullLine) {
            var deferred = $q.defer();

            columnsName = toArray(columnsName);

            var queryBuff = newBuffer();
            queryBuff.append(' SELECT ');

            var cont = columnsName.length;
            columnsName.forEach(columnName => {
                queryBuff.append(columnName);

                cont--;

                if (cont > 0) {
                    queryBuff.append(', ');
                }
            });

            queryBuff.append(' FROM ');
            queryBuff.append(tableName);

            if (whereOrderGroup != null) {
                queryBuff.append(' WHERE ');
                queryBuff.append(whereOrderGroup);
            }


            var params = {
                sql: queryBuff.toString()
            }

            ServiceProxy
                .callService('mge@DbExplorerSP.executeQuery', params)
                .then(function (response) {
                    var rows = [];

                    toArray(getProperty(response,
                        'responseBody')).forEach(function (colunas) {

                            var names = toArray(colunas.fieldsMetadata);
                            var dados = toArray(colunas.rows);

                            for (let i = 0; i < dados.length; i++) {
                                var data = {};
                                const element = dados[i];

                                names.forEach((name) => {
                                    data[name.name] = element[name.order - 1];
                                });

                                rows.push(data);

                                if (!fullLine) {
                                    return;
                                }
                            }
                        });

                    if (response.responseBody.queryExecResult !== undefined) {
                        //console.log('%c ' + JSON.stringify(response.responseBody.queryExecResult), 'background: #ff0000;');
                        rows.push(response.responseBody.queryExecResult);
                    }

                    deferred.resolve(fullLine ? rows : rows.pop());
                }, function (erro) {
                    var statusMessage = erro.statusMessage;

                    if (!statusMessage) {
                        statusMessage = 'Erro não identificado.';
                    }

                    deferred.reject([{ ERRO: statusMessage }]);
                });

            return deferred.promise;
        }


        function loadFromQuery_2(columnsName, tableName, whereOrderGroup, fullLine) {
            var deferred = $q.defer();
            columnsName = toArray(columnsName);
            var queryBuff = newBuffer();
            queryBuff.append(' SELECT ');
            var cont = columnsName.length;
            columnsName.forEach(function (columnName) {
                queryBuff.append(columnName);
                cont--;
                if (cont > 0) {
                    queryBuff.append(', ');
                }
            });
            queryBuff.append(' FROM ');
            queryBuff.append(tableName);
            if (whereOrderGroup != null) {
                queryBuff.append(' WHERE ');
                queryBuff.append(whereOrderGroup);
            }
            var params = {
                querydata: {
                    query: queryBuff.toString()
                }
            };
            ServiceProxy.callService('mge@ExecQuerySP.execQuery', params).then(function (response) {
                var rows = [];
                toArray(getProperty(response, 'responseBody.entity.line')).forEach(function (colunas) {
                    var data = {};
                    toArray(colunas.column).forEach(function (col) {
                        data[col.name] = col.value;
                    });
                    rows.push(data);
                    if (!fullLine) {
                        return;
                    }
                });
                if (response.responseBody.hasOwnProperty('queryExecResul')) {
                    if (response.responseBody.queryExecResult.hasOwnProperty('ERRO')) {
                        deferred.reject(response.responseBody.queryExecResult);
                        return;
                    }
                }
                deferred.resolve(fullLine ? rows : rows.pop());
            }, function (erro) {
                var statusMessage = erro.statusMessage;

                if (!statusMessage) {
                    statusMessage = 'Erro não identificado.';
                }

                deferred.resolve([{ ERRO: statusMessage }]);
            });
            return deferred.promise;
        }

        function toArray(arr) {
            if (angular.isUndefined(arr)) {
                return [];
            } else if (angular.isArray(arr)) {
                return arr;
            } else if (angular.isString(arr)) {
                return arr.split(',');
            } else {
                return [arr];
            }
        }

        function newBuffer() {
            var value = [];
            return {
                append: function (data) {
                    value.push(data);
                    return this;
                },
                toString: function () {
                    return value.join('');
                },
                length: function () {
                    return value.join('').length;
                },
                clear: function () {
                    value = [];
                    return this;
                }
            };
        };

        function getProperty(obj, path, testFlatPaths, pathSeparator) {
            if (angular.isDefined(obj) && obj != null) {
                var pathArr = path.split(pathSeparator || '.');

                if (pathArr.length > 1) {
                    var currObj = obj;

                    for (var i = 0, len = pathArr.length; i < len; i++) {
                        var currPath = pathArr[i];

                        if ((i + 1) == len) {
                            return currObj[currPath];
                        } else {
                            if (angular.isDefined(currObj[currPath])) {
                                currObj = currObj[currPath];
                            } else if (testFlatPaths) {
                                var flatPath = angular.copy(pathArr).splice(i, pathArr.length).join('.');

                                if (currObj.hasOwnProperty(flatPath)) {
                                    return currObj[flatPath];
                                } else {
                                    return undefined;
                                }
                            } else {
                                return undefined;
                            }

                            if (angular.isUndefined(currObj)) {
                                return undefined;
                            }
                        }
                    }
                } else {
                    return obj[path];
                }
            }

            return undefined;
        }


    }]);