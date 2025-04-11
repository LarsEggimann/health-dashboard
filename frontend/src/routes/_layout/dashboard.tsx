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
import { useColorModeValue } from '@chakra-ui/react'

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
          title: { text: 'Heart Rate Over Time' },
          font: {
            color: '#E2E8F0',
          },
          autosize: true,
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          xaxis: {
            title: 'Time',
            titlefont: {
              color: '#E2E8F0',
            },
            showgrid: true,
            gridwidth: 0.5,
            gridcolor: '#4A5568',
          },
          yaxis: {
            title: 'Heart Rate (bpm)',
            showgrid: true,
            gridwidth: 0.5,
            gridcolor: '#4A5568',
          },
          margin: { l: 40, r: 20, t: 40, b: 40 },
        }}
        style={{ width: '100%', height: '100%' }}
        config={{
          responsive: true,
          displaylogo: false,
          // modeBarButtonsToRemove: [],
          // editable: true
        }}
        useResizeHandler={true}

      />
    </Box>
  )
}
