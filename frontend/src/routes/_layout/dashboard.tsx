import { createFileRoute } from '@tanstack/react-router'
import { HealthDataService, MonitoringHeartRates } from '../../client'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Chart, useChart } from '@chakra-ui/charts'
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import Plot from 'react-plotly.js';
import { Box } from '@chakra-ui/react'
import { useColorModeValue } from '../../components/ui/color-mode'

export const Route = createFileRoute('/_layout/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const heartRateQuery = useQuery<MonitoringHeartRates>({
    queryKey: ['monitoringHeartRate'],
    queryFn: async () => {
      const response =
        await HealthDataService.healthDataGetMonitoringHeartRate()
      if (!response.data) {
        throw new Error('Error fetching heart rate data')
      }
      return response.data
    },
  })


  // plot color stuff
  const textColor = useColorModeValue('#1A202C', '#E2E8F0')
  const gridColor = useColorModeValue('#CBD5E0', '#4A5568')
  const bgColor = 'transparent'


  return (
    <Box w='100%' h='100%'>
      <Plot
        data={[
          {
            x: heartRateQuery?.data?.timestamp,
            y: heartRateQuery?.data?.heart_rate,
            type: 'scatter',
            mode: 'lines',
          }
        ]}
        layout={{
          title: { 
            text: 'Heart Rate Over Time',
            font: { color: textColor }
          },
          font: {
            color: textColor,
            size: 16
          },
          autosize: true,
          paper_bgcolor: bgColor,
          plot_bgcolor: bgColor,
          xaxis: {
            title: {
              text: 'Time',
              standoff: 5, // space between title and axis
            },
            automargin: true,
            showgrid: false,
            showline: false,
            gridwidth: 0.4,
            gridcolor: gridColor,
            ticklabelstandoff: 10, // space beween tick labels and axis
          },
          yaxis: {
            title: {
              text: 'Heart Rate (bpm)',
              standoff: 5, // space between title and axis
            },
            automargin: true,
            showgrid: true,
            showline: false,
            gridwidth: 0.4,
            gridcolor: gridColor,
            ticklabelstandoff: 10,
          },
          margin: { l: 60, r: 30, t: 35, b: 60 },
        }}
        style={{ width: '100%', height: '100%' }}
        config={{
          responsive: true,
          displaylogo: false,
          toImageButtonOptions: {
            format: 'png',
            filename: 'custom_image',
          }        
          // modeBarButtonsToRemove: [],
          // editable: true
        }}
        useResizeHandler={true}
      />
    </Box>
  )
}
