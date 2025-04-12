import React from 'react'
import Plot from 'react-plotly.js'
import { Box } from '@chakra-ui/react'
import { useColorModeValue } from '../../components/ui/color-mode'

interface TimeSeriesChartProps {
  xData: () => any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  yData: () => any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  customData?: any[][] // eslint-disable-line @typescript-eslint/no-explicit-any
  hoverTemplate?: string
  lineColor?: string
  height?: string | number
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  xData,
  yData,
  title = 'Time Series Chart',
  xAxisLabel = 'Time',
  yAxisLabel = 'Value',
  customData,
  hoverTemplate = '<b>X:</b> %{x}<br><b>Y:</b> %{y}<extra></extra>',
  lineColor,
  height = '400px',
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

  const defaultCustomData =
    customData ||
    xData().map((x, y) => [new Date(x).toLocaleTimeString(), yData()[y]])

  return (
    <Box w='100%' h='100%'>
      <Plot
        data={[
          {
            x: xData(),
            y: yData(),
            type: 'scatter',
            mode: 'lines',
            line: {
              color: finalLineColor,
              width: 2,
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
            customdata: defaultCustomData,
            hovertemplate: hoverTemplate,
          },
        ]}
        layout={{
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
        }}
        style={{ width: '100%', height }}
        config={{
          responsive: true,
          displaylogo: false,
          toImageButtonOptions: {
            format: 'png',
            filename: 'chart_export',
          },
          // modeBarButtonsToRemove: [],
          // editable: true
        }}
        useResizeHandler={true}
      />
    </Box>
  )
}

export default TimeSeriesChart
