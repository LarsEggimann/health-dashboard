import React, { useEffect, useRef, useState } from 'react'
import Plot from 'react-plotly.js'
import { Box } from '@chakra-ui/react'
import * as Plotly from 'plotly.js-dist-min'
import { useColorModeValue } from '../../components/ui/color-mode'

interface TimeSeriesChartProps {
  xData: () => number[] | string[]
  yData: () => number[]
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
  animationDuration = 300,
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

  const customData = x().map((i, j) => [
    new Date(i).toLocaleTimeString(),
    y()[j],
  ])

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
          smoothing: 0.8,
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
    data: getPlotData(x(), y()),
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
    frames: [],
    config: {
      responsive: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'chart_export',
      },
    },
  })

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    // const initialLength = x().length;

    // Fixed axes
    const xRange = [x()[0], x()[x().length - 1]]
    const yMin = Math.min(...y())
    const yMax = Math.max(...y())
    const yPadding = (yMax - yMin) * 0.1

    const newLayout: Partial<Plotly.Layout> = {
      ...figure.layout,
      xaxis: {
        ...figure.layout.xaxis,
        range: xRange,
      },
      yaxis: {
        ...figure.layout.yaxis,
        range: [yMin - yPadding, yMax + yPadding],
      },
    }

    if (!hasAnimated) {
      const animFrames: Plotly.Frame[] = []

      const step = Math.ceil(x().length / 100) // step size for animation frames, should give 100 frames

      const xReversed = [...x()].reverse() as string[] | number[]
      const yReversed = [...y()].reverse()
      for (let i = 0; i < x().length; i += step) {
        animFrames.push({
          group: '1',
          name: `frame${i}`,
          data: getPlotData(
            xReversed.slice(0, i + 1),
            yReversed.slice(0, i + 1),
          ),
          traces: [0],
          baseframe: '',
          layout: {},
        })
      }
      console.log('number of frames', animFrames.length)
      setFigure((prev) => ({
        ...prev,
        data: getPlotData([], []), // Clear data for animation
        layout: newLayout,
        frames: animFrames,
      }))
    } else {
      // No animation after first render
      setFigure((prev) => ({
        ...prev,
        data: getPlotData(x(), y()),
        layout: newLayout,
      }))
    }
  }, [x, y, hasAnimated])

  const [isReady, setIsReady] = useState(false)
  const plotRef = useRef<Plotly.PlotlyHTMLElement | null>(null)

  useEffect(() => {
    if (
      isReady &&
      plotRef.current &&
      figure.frames &&
      figure.frames.length > 0
    ) {
      Plotly.animate(plotRef.current, null, {
        frame: { duration: 10, redraw: true },
        transition: { duration: 0 },
      })
      setHasAnimated(true)
    }
  }, [isReady, animationDuration, figure.frames])

  return (
    <Box w='100%' h='100%'>
      <Plot
        data={figure.data}
        layout={figure.layout}
        frames={figure.frames || []}
        config={figure.config}
        useResizeHandler={true}
        style={{ width: '100%', height: height }}
        onError={(err) => console.error(err)}
        onInitialized={(figure, graphDiv) => {
          plotRef.current = graphDiv as Plotly.PlotlyHTMLElement
          setIsReady(true)
        }}
      />
    </Box>
  )
}

export default TimeSeriesChart
