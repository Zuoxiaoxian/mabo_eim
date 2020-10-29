let rtm3a = {
    create_second_chart(data) {
        var dom = document.getElementById("second_chart");
        var myChart = echarts.init(dom);
        option = null;
        // var xAxis = data.xAxis.map(f => ({
        //     value: f,
        //     textStyle: {
        //         display: 'inline - block'
        //     }
        // }));
        option = {
            title: {
                show: false
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [],
                top: "3%",
                textStyle: {
                    color: '#fff',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: data.xAxis,
                axisLabel: {
                    show: true,
                    color: 'white',
                    interval: 0, //强制显示所有x轴标签
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: true,
                    color: 'white',
                }
            },
            series: [{
                name: '',
                type: 'line',

                stack: '总量',
                data: data.seriesData,
                // 显示数值
                itemStyle: { normal: { label: { show: true } } }
            }]
        };
        // {
        //   name:'项目起始时间',
        //   type:'line',

        //   stack: '总量',
        //   data:[120, 132, 101, 134, 90, 230, 210],
        //   // 显示数值
        //   itemStyle : { normal: {label : {show: true}}}
        // },
        window.addEventListener('resize', function() {
            myChart.resize();
        })

        if (option && typeof option === "object") {
            myChart.setOption(option);
            myChart.resize();
        }
    },

    create_third_chart(data, myChart) {

        option = {
            title: {
                text: '目前进度',
                subtext: '10%',
                x: 'center',
                y: 'center',
                itemGap: 10,
                textStyle: {
                    color: '#B7E1FF',
                    fontWeight: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 12
                },
                subtextStyle: {
                    color: '#B7E1FF',
                    fontWeight: 'bolder',
                    fontSize: 12,
                    fontFamily: '微软雅黑'
                }
            },
            series: [{
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: [32, 37],
                    x: '0%',
                    tooltip: { show: false },
                    data: [{
                            name: '达成率',
                            value: 79,
                            itemStyle: { color: 'rgba(0,153,255,0.8)' },
                            hoverAnimation: false,
                            label: {
                                show: false,
                                position: 'center',
                                textStyle: {
                                    fontFamily: '微软雅黑',
                                    fontWeight: 'bolder',
                                    color: '#B7E1FF',
                                    fontSize: 24
                                }
                            },
                            labelLine: {
                                show: false
                            }
                        },
                        {
                            name: '79%',
                            value: 21,
                            itemStyle: { color: 'rgba(0,153,255,0.1)' },
                            hoverAnimation: false,
                            label: {
                                show: false,
                                position: 'center',
                                padding: 20,
                                textStyle: {
                                    fontFamily: '微软雅黑',
                                    fontSize: 24,
                                    color: '#B7E1FF'
                                }
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    ]
                },
                {
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: [42, 47],
                    x: '0%',
                    hoverAnimation: false,
                    data: [{
                        value: 100,
                        itemStyle: { color: 'rgba(0,153,255,0.3)' },
                        label: { show: false },
                        labelLine: { show: false }
                    }]
                },
                {
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: [16, 17],
                    x: '0%',
                    hoverAnimation: false,
                    data: [{
                        value: 100,
                        itemStyle: { color: 'rgba(0,153,255,0.3)' },
                        label: { show: false },
                        labelLine: { show: false }
                    }]
                }
            ]
        }
        window.addEventListener('resize', function() {
            myChart.resize();
        })
        myChart.setOption(option)
        myChart.resize();
    },

    create_third_chart_line(data, id) {
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#F35331', '#2499F8', '#3DF098', '#33B734'];
        //订单完成情况螺旋图
        var yearPlanData = [];
        var yearOrderData = [];
        var differenceData = [];
        var visibityData = [];
        var xAxisData = [];

        for (var i = 0; i < 12; i++) {
            yearPlanData.push(Math.round(Math.random() * 900) + 100);
            yearOrderData.push(Math.round(Math.random() * yearPlanData[i]));
            differenceData.push(yearPlanData[i] - yearOrderData[i]);
            visibityData.push(yearOrderData[i]);
            xAxisData.push((i + 1).toString() + "月");
        }

        option = {
            title: { show: false },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    return params[0].name + '<br/>' +
                        params[0].seriesName + ' : ' + params[0].value + '<br/>' +
                        params[1].seriesName + ' : ' + params[1].value + '<br/>' +
                        '完成率：' +
                        (params[0].value > 0 ? (params[1].value / params[0].value * 100).toFixed(2) + '%' : '-') +
                        '<br/>'
                },
                textStyle: {
                    color: '#FFF',
                    fontSize: 12
                }
            },
            toolbox: { show: false },
            // legend: {
            //     top: 'top',
            //     textStyle: {
            //         color: '#B7E2FF',
            //         fontSize: 12,
            //         fontFamily: '微软雅黑'
            //     },
            //     data: ['计划生产', '已接订单']
            // },
            xAxis: {
                data: xAxisData,
                axisLabel: {
                    textStyle: {
                        color: '#B7E1FF',
                        fontSize: 12
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#09F'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#09F'
                    }
                }
            },
            yAxis: {
                inverse: false,
                splitArea: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    textStyle: {
                        color: '#B7E1FF',
                        fontSize: 12,
                        fontFamily: 'Arial',
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#09F'
                    }
                }
            },
            grid: {
                top: 30,
                bottom: 20,
                // left: 100,
                width: '100%',
            },
            series: [{
                    name: '计划生产',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 10,
                    showAllSymbol: true,
                    color: color[1],
                    data: yearPlanData
                },
                {
                    name: '已接订单',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 10,
                    showAllSymbol: true,
                    color: '#F90',
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                width: 2
                            }
                        }
                    },
                    data: yearOrderData
                },
                {
                    name: '不可见',
                    type: 'bar',
                    stack: '1',
                    barWidth: 1,
                    itemStyle: {
                        normal: {
                            color: 'rgba(0,0,0,0)'
                        },
                        emphasis: {
                            color: 'rgba(0,0,0,0)'
                        }
                    },
                    data: visibityData
                },
                {
                    name: '变化',
                    type: 'bar',
                    stack: '1',
                    barWidth: 1,
                    color: '#B7E1FF',
                    data: differenceData
                }
            ]
        }
        window.addEventListener('resize', function() {
            myChart.resize();
        });

        myChart.setOption(option);
        myChart.resize();
    },
}

module.exports = rtm3a;