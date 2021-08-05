import React, { Component } from "react";
import { lightenDarkenColor } from "/imports/ui/utils/utils.jsx";
import { Doughnut } from 'react-chartjs-2';

const style = {
  pieSize: {
    padding: '20px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  percentStyle: {
    color: '#FF5444',
    position: 'absolute',
    right: '50%',
    top: '50%',
    transform: 'translate(50%,-50%)',
    fontSize: 24,
    textAlign: 'center',
  },
};

export default class PieChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { percentage } = this.props;
    const complete = 100 - percentage;
    const data = {
      datasets: [{
        data: complete > 0 ? [percentage, complete] : [percentage],
        labels: complete > 0 ? ['milestonePercent', 'milestone'] : ['milestonePercent'],
        fill: true,
        backgroundColor: complete > 0 ? ['#FF444D', '#ececec'] : ['#FF444D'],
        borderColor: complete > 0 ? ['#FF444D', '#ececec'] : ['#FF444D'],
        borderWidth: 2
      }]
    };
    return (
      <div style={style.pieSize}>
        <Doughnut
          data={data}
          width={130}
          height={130}
          options={{
            tooltips: {
              enabled: false
            },
            maintainAspectRatio: false,
            circumference: 2 * Math.PI,
            rotation: -0.5 * Math.PI,
            cutoutPercentage: 95
          }}
        />
        <div style={style.percentStyle}>{Math.round(percentage)}%</div>
      </div>
    );
  }
}
