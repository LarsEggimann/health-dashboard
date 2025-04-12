import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import * as Plotly from "plotly.js";

interface TimeSeriesChartProps {
  xData: () => number[] | string[];
  yData: () => number[];
  animationDuration?: number; // Duration in milliseconds
}
type PlotlyFigure = {
  data: Plotly.Data[];
  layout: Partial<Plotly.Layout>;
  frames?: Plotly.Frame[];
  config?: Partial<Plotly.Config>;
};


const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ 
  xData, 
  yData, 
  animationDuration = 500 
}) => {

  const getPlotData = (xVals: number[] | string[], yVals: number[]): Plotly.Data[] => {
    return [{
      x: xVals,
      y: yVals,
      type: 'scatter',
      mode: 'lines',
      line:{
        shape: 'spline',
        smoothing: 0.8,
      }
    }]
  }

  const [figure, setFigure] = useState<PlotlyFigure>(
    {
      data: getPlotData(xData(), yData()),
      layout: {
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        transition: {
          easing: 'cubic-in-out',
          duration: animationDuration,
        }
      },
      frames: [],
      config: {}
    }
  );

  const updateDisabledRef = React.useRef(false);

  useEffect(() => {
    const xVals = xData();
    const yVals = yData();
  
    console.log('updateDisabled:', updateDisabledRef.current);
    if (xVals.length > 0 && !updateDisabledRef.current) {
      const newLayout: Partial<Plotly.Layout> = {
        ...figure.layout,
        xaxis: {
          ...figure.layout.xaxis,
          range: [xVals[0], xVals[xVals.length - 1]], // update range to fit data
        },
      };
  
      setFigure((prev) => ({
        ...prev,
        data: getPlotData(xVals, yVals),
        layout: newLayout,
      }));
    }
  }, [xData, yData]);
  

  return (
    <Plot
      data={figure.data}
      layout={figure.layout}
      frames={figure.frames}
      config={figure.config}      
      useResizeHandler={true}
      style={{ width: '100%', height: '100%' }}
      onInitialized={(fig) => setFigure(fig)}
      // onUpdate={(fig) => setFigure(fig)}
      onClick={() => updateDisabledRef.current = true}
      onDoubleClick={() => updateDisabledRef.current = false}
      onError={(err) => console.error(err)}
    />
  );
};

export default TimeSeriesChart;