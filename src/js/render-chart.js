var Render = {

    /**
     * Função que cria a exibição do Gráfico
     * @param {String} container Selector de onde será exibido o Gráfico
     * @param {String} titulo Titulo do gráfico
     * @param {Array.<{name:String, y:Number, drilldown:String}>} data Array com os dados de exibição do gráfico inicial
     * @returns 
     */
    doChart: function (container, titulo, data) {
        // debugger;
        let cores = ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1", "#3a34eb"];

        return new Highcharts.Chart({
            chart: {
                type: 'pie',
                renderTo: container,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                borderRadius: 5,
                borderWidth: 2,
                // animation: true,
                borderColor: 'black'
            },
            title: {
                text: '<b>'+titulo+'</b>',
                style: {
                    fontWeight: 'bold',
                    // fontSize: $('h2').height() + 'px'
                }
            },
            legend: {
                enabled: true,
                align: "center",
                verticalAlign: "bottom",
                layout: "horizontal",
                borderRadius: 5,
                borderWidth: 2,
                borderColor: 'black',
                itemStyle: {
                    fontSize: '1.25em'
                }
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: ': <b>{point.y:.2f}</b>',
                valueSuffix: ' t'
            },
            plotOptions: {
                pie: {
                    showInLegend: true,
                    allowPointSelect: true,
                    // cursor: 'pointer',
                    colors: cores,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y:.2f} ',
                        style: {
                            fontSize: '1.25em'
                        }
                    }
                }
            },
            series: [{
                name: 'Principal',
                // colorByPoint: true,
                data: data
            }]
            ,lang: {
                drillUpText: '◁ {series.name}'
            },
        });

    }
}