import React, { useEffect, useRef, useState } from 'react'
import Plot from 'react-plotly.js'
import { Box } from '@chakra-ui/react'
import * as Plotly from 'plotly.js-dist-min'
import { useColorModeValue } from '../../components/ui/color-mode'
import { data } from 'react-router-dom'

interface TimeSeriesChartProps {
  xData: number[] | string[]
  yData: number[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  animationDuration?: number // duration in milliseconds
  lineColor?: string
  hoverTemplate?: string
  height?: string | number
}
type PlotlyFigure = {
  data: Plotly.Data[]
  layout: Partial<Plotly.Layout>
  frames?: Plotly.Frame[] | null
  config?: Partial<Plotly.Config>
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  xData: x,
  yData: y,
  title = 'Time Series Chart',
  xAxisLabel = 'Time',
  yAxisLabel = 'Value',
  animationDuration = 500,
  hoverTemplate = '<b>X:</b> %{x}<br><b>Y:</b> %{y}<extra></extra>',
  lineColor,
  height = '600px',
}) => {
  const textColor = useColorModeValue('#1A202C', '#E2E8F0')
  const gridColor = useColorModeValue('#CBD5E0', '#4A5568')
  const defaultLineColor = useColorModeValue(
    'rgba(234, 104, 104, 0.9)',
    'rgba(234, 104, 104, 0.9)',
  )
  const tooltipBgColor = useColorModeValue(
    'rgba(255, 255, 255, 0.9)',
    'rgba(26, 32, 44, 0.9)',
  )
  const tooltipBorderColor = useColorModeValue('#CBD5E0', '#4A5568')
  const bgColor = 'transparent'

  const finalLineColor = lineColor || defaultLineColor

  const customData = x.map((i, j) => [new Date(i).toLocaleTimeString(), y[j]])

  const getPlotData = (
    xVals: number[] | string[],
    yVals: number[],
  ): Plotly.Data[] => {
    return [
      {
        x: xVals,
        y: yVals,
        type: 'scatter',
        mode: 'lines',
        line: {
          color: finalLineColor,
          shape: 'spline',
          smoothing: 0.5,
        },
        hoverlabel: {
          bgcolor: tooltipBgColor,
          bordercolor: tooltipBorderColor,
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            color: textColor,
          },
        },
        customdata: customData,
        hovertemplate: hoverTemplate,
      },
    ]
  }

  const [figure, setFigure] = useState<PlotlyFigure>({
    data: getPlotData(x, y),
    layout: {
      title: {
        text: title,
        font: { color: textColor },
      },
      font: {
        color: textColor,
        size: 16,
      },
      autosize: true,
      paper_bgcolor: bgColor,
      plot_bgcolor: bgColor,
      xaxis: {
        title: {
          text: xAxisLabel,
          standoff: 5,
        },
        automargin: true,
        showgrid: false,
        showline: false,
        gridwidth: 0.4,
        gridcolor: gridColor,
      },
      yaxis: {
        title: {
          text: yAxisLabel,
          standoff: 5,
        },
        automargin: true,
        showgrid: true,
        showline: false,
        gridwidth: 0.4,
        gridcolor: gridColor,
      },
      margin: { l: 60, r: 30, t: 35, b: 60 },
      transition: {
        easing: 'cubic-in-out',
        duration: animationDuration,
      },
    },
    // frames: [],
    config: {
      responsive: true,
      displaylogo: false,
      displayModeBar: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'chart_export',
      },
    },
  })

  useEffect(() => {
    const xVals = x
    const yVals = y

    if (xVals.length > 0) {
      const newLayout: Partial<Plotly.Layout> = {
        ...figure.layout,
        xaxis: {
          ...figure.layout.xaxis,
          range: [xVals[0], xVals[xVals.length - 1]], // update range to fit data
        },
      }

      setFigure((prevFigure) => ({
        ...prevFigure,
        data: getPlotData(xVals, yVals),
        layout: newLayout,
      }))
    }
  }, [x, y])

  return (
    <Box w='100%' h='100%'>
      <Plot
        data={figure.data}
        layout={figure.layout}
        frames={figure.frames || []}
        config={figure.config}
        useResizeHandler={true}
        style={{ width: '100%', height: height }}
      />
    </Box>
  )
}

export default TimeSeriesChart
