/*
	Servico utilizado quando deseja-se utilizar apenas as chamadas
	basicas do front-end com os EJBs
*/
angular
    .module('standalone.serviceproxy', [])
    .constant('ServiceProxyConstants', {
        STATUS: {
            ERROR: 0,
            OK: 1,
            INFO: 2,
            TIMEOUT: 3,
            SERVICE_CANCELED: 4
        }
    })
    .service('ServiceProxy', ['$http', '$q', '$log', 'ServiceProxyConstants',
        function($http, $q, $log, ServiceProxyConstants) {
            
            var DEFAULT_PREVENT_TRANSFORM  = false;

            var self = this;

            var _counter = 0;
            var _applicationName = '';

			var _urlParams = getQueryParams(location.search);

            self.callService = function (serviceName, content, config) {
                var url = getUrlBase() + "/{0}/service.sbr?serviceName={1}&counter={2}&application={3}&outputType=json&preventTransform={4}";
                var defModule = "mge";

                if (serviceName.indexOf("@") > -1) {
                    var s = serviceName.split("@");
                    defModule = s[0];
                    serviceName = s[1];
                }

                _counter = _counter + 1;

                url = url.replace("{0}", defModule);
                url = url.replace("{1}", serviceName);
                url = url.replace("{2}", _counter);
                url = url.replace("{3}", _applicationName);
                url = url.replace("{4}", (config && config.preventTransform) || DEFAULT_PREVENT_TRANSFORM);

                if(_urlParams.mgeSession != null && _urlParams.mgeSession.length > 0){
					 url += "&mgeSession=" + _urlParams.mgeSession;
				}

                var requestContent = {
                    serviceName: serviceName,
                    requestBody: content
                };

                var deffered = $q.defer();

                //Promise de cancelamento de serviço.
                var deferredAbort = $q.defer();

                if (!config) {
                    config = {};
                }

                var httpConfig = {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    },
                    timeout: deferredAbort.promise
                };

                $http.post(url, requestContent, httpConfig)
                .then(function (data, status) {
                        data = data.data;
                        if (!data.hasOwnProperty('status') ||
                             data.status == ServiceProxyConstants.STATUS.ERROR ||
                             data.status == ServiceProxyConstants.STATUS.TIMEOUT) {

                            var statusMessage = data.statusMessage;

                            if (!statusMessage) {
                                statusMessage = 'Erro não identificado.';
                            }

                            logError(statusMessage);

                            deffered.reject(data);
                        } else if (data.status == ServiceProxyConstants.STATUS.SERVICE_CANCELED) {
                            if (data.statusMessage){
                                logDebug(data.statusMessage);
                            }
                        } else {

                            if (data.status == ServiceProxyConstants.STATUS.INFO) {
                                logDebug(data.statusMessage);
                            }

                            deffered.resolve(data);
                        }
                    },
                    function (data, status, headers, config) {
                        //Se o request foi programaticamente abortado, não lançamos erro e nem rejeitamos a promise
                        if (deffered.promise.aborted === true) {
                            return;
                        }

                        data = data.data;

                        var msg = data || config.data.serviceName;

                        logError('Erro ao executar serviço. \n' + msg);

                        deffered.reject(config.data);
                    });

                //Função responsável por abortar o request
                deffered.promise.abort = function () {
                    deffered.promise.aborted = true;
                    deferredAbort.resolve();
                };

                return deffered.promise;
            };

            function logDebug(message) {
                if (message){
                    $log.debug('[ServiceProxy] ' + message);
                }
            }

            function logError(message) {
                if (message){
                    $log.error('[ServiceProxy] ' + message);
                }
            }
            
            function getUrlBase() {
	            return location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
	        }
	        
	        function getQueryParams(qs) {
	            var params = {};
	            var tokens;
	            var re = /[?&]?([^=]+)=([^&]*)/g;
	
	            //Necessário por causa da tela Histórico Padrão que possui resourceID com acento
	            qs = unescape(qs);
	
	            qs = qs.split("+").join(" ");
	
	            while (tokens = re.exec(qs)) {
	                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	            }
	
	            return params;
	        }
    }]);