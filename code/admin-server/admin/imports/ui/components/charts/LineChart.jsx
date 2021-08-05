import React from 'react';
import { lightenDarkenColor } from '/imports/ui/utils/utils.jsx';
import { Line } from 'react-chartjs-2';
import { Icon } from 'semantic-ui-react';

export default class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this._getData = this._getData.bind(this);
        this._getChartId = this._getChartId.bind(this);
    }

    _getChartId() {
        const { name } = this.props;
        return `${name}-chart`;
    }

    _getData() {
        const {
            dataLabels,
            data,
            labels,
            color,
            backgroundColor,
            pointBackgroundColor,
            pointBorderWidth,
            loading,
            fakeData,
            spanGaps
        } = this.props;
        const baseColor = color ? color : '#EF4C4C';

        let tempSet = {
            spanGaps: spanGaps || false,
            fill: true,
            lineTension: 0.4,
            borderColor: baseColor,
            backgroundColor: backgroundColor || lightenDarkenColor(baseColor, 40)
        };

        if (loading || fakeData) {
            tempSet.borderColor = tempSet.borderColor + '4D';
            tempSet.backgroundColor = tempSet.backgroundColor + '4D';
        }

        if (pointBackgroundColor) {
            tempSet.pointBackgroundColor = pointBackgroundColor;
        }
        if (pointBorderWidth) {
            tempSet.pointBorderWidth = pointBorderWidth;
        }

        let lineChartData = {
            labels: labels,
            datasets: []
        };

        if (Array.isArray(data) && Array.isArray(data[0])) {
            const dataSetColors = ['#0E4D92', '#EF4C4C'];
            data.forEach((item, index) => {
                let itemSet = {
                    type: 'line',
                    data: item,
                    spanGaps: tempSet.spanGaps,
                    fill: false,
                    lineTension: tempSet.lineTension,
                    borderColor: dataSetColors[index],
                    backgroundColor: dataSetColors[index],
                    label: dataLabels[index]
                };
                lineChartData.datasets.push(itemSet);
            });
        } else {
            tempSet.data = data;
            lineChartData.datasets.push(tempSet);
        }

        return lineChartData;
    }

    render() {
        const {
            yPosition,
            xPosition,
            loading,
            fakeData,
            maxTicksLimit,
            integer,
            multiple
        } = this.props;

        const options = {
            maintainAspectRatio: false,
            scales: {
                yAxes: [
                    {
                        gridLines: { display: false },
                        position: yPosition || 'left'
                    }
                ],
                xAxes: [
                    {
                        gridLines: { display: false },
                        position: xPosition || 'bottom',
                        ticks: {
                            maxTicksLimit: maxTicksLimit
                        }
                    }
                ]
            }
        };

        if (integer) {
            options.scales.yAxes[0].ticks = {
                callback: function(value) {
                    if (value % 1 === 0) {
                        return value;
                    }
                }
            };
        }

        const height = this.props.height ? this.props.height : 200;
        const className = this.props.className || '';
        return (
            <div
                className={className ? `chart ${className}` : 'chart'}
                style={{ position: 'relative', width: '100%', height: height }}
            >
                {loading || fakeData ? (
                    <div
                        style={{
                            textAlign: 'center',
                            width: '100%',
                            position: 'absolute',
                            top: 'calc(50% - 15px)',
                            left: 0
                        }}
                    >
                        {loading ? (
                            <Icon
                                name="circle notched"
                                style={{ color: '#0000004D' }}
                                loading
                                size="large"
                            />
                        ) : (
                            ''
                        )}
                        {fakeData ? (
                            <div style={{ color: '#0000004D', fontSize: '1.5em' }}>No data yet</div>
                        ) : (
                            ''
                        )}
                    </div>
                ) : (
                    ''
                )}
                <Line
                    ref={this._getChartId()}
                    data={this._getData()}
                    legend={multiple ? {} : { display: false }}
                    options={options}
                />
            </div>
        );
    }
}
