import { createFileRoute } from '@tanstack/react-router'
import { HealthDataService, MonitoringHeartRates } from '../../client'
import { useQuery } from '@tanstack/react-query'
import Plot from 'react-plotly.js'
import { Box } from '@chakra-ui/react'
import { useColorModeValue } from '../../components/ui/color-mode'
import { useState } from 'react'
import { DateRange, DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'

export const Route = createFileRoute('/_layout/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selected, setSelected] = useState<DateRange>()

  const heartRateQuery = useQuery<MonitoringHeartRates>({
    queryKey: ['monitoringHeartRate', selected],
    queryFn: async () => {
      const response = await HealthDataService.healthDataGetMonitoringHeartRate(
        {
          query: {
            start: selected?.from?.toISOString(),
            end: selected?.to?.toISOString(),
          },
        },
      )
      if (!response.data) {
        throw new Error('Error fetching heart rate data')
      }
      return response.data
    },
  })

  // plot color stuff
  const textColor = useColorModeValue('#1A202C', '#E2E8F0')
  const gridColor = useColorModeValue('#CBD5E0', '#4A5568')
  const tooltipBgColor = useColorModeValue(
    'rgba(255, 255, 255, 0.9)',
    'rgba(26, 32, 44, 0.9)',
  )
  const tooltipBorderColor = useColorModeValue('#CBD5E0', '#4A5568')
  const bgColor = 'transparent'

  return (
    <Box w='100%'>
      <Box className='chakra-day-picker'>
        <style>
          {`
      .chakra-day-picker {
        --rdp-accent-color: var(--chakra-colors-blue-500);
        --rdp-background-color: var(--chakra-colors-gray-100);
        --rdp-color: var(--chakra-colors-gray-900);
      }

      [data-theme='dark'] .chakra-day-picker {
        --rdp-background-color: var(--chakra-colors-gray-700);
        --rdp-color: var(--chakra-colors-whiteAlpha-900);
      }
    `}
        </style>
        <DayPicker
          className='chakra-day-picker'
          mode='range'
          selected={selected}
          onSelect={setSelected}
          footer={
            selected
              ? `Selected: ${selected.from?.toISOString()} - ${selected.to?.toISOString()}`
              : 'Pick a day.'
          }
        />
      </Box>
      <Plot
        data={[
          {
            x: heartRateQuery?.data?.timestamp,
            y: heartRateQuery?.data?.heart_rate,
            type: 'scatter',
            mode: 'lines',
            hoverlabel: {
              bgcolor: tooltipBgColor,
              bordercolor: tooltipBorderColor,
              font: {
                family: 'Inter, sans-serif',
                size: 12,
                color: textColor,
              },
            },
            customdata: heartRateQuery?.data?.timestamp?.map((time, i) => [
              new Date(time).toLocaleTimeString(),
              heartRateQuery?.data?.heart_rate[i],
            ]),
            hovertemplate:
              '<b>Time:</b> %{customdata[0]}<br><b>Heart Rate:</b> %{customdata[1]} bpm<extra></extra>',
          },
        ]}
        layout={{
          title: {
            text: 'Heart Rate Over Time',
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
              text: 'Time',
              standoff: 5, // space between title and axis
            },
            automargin: true,
            showgrid: false,
            showline: false,
            gridwidth: 0.4,
            gridcolor: gridColor,
          },
          yaxis: {
            title: {
              text: 'Heart Rate [bpm]',
              standoff: 5, // space between title and axis
            },
            automargin: true,
            showgrid: true,
            showline: false,
            gridwidth: 0.4,
            gridcolor: gridColor,
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
          },
          // modeBarButtonsToRemove: [],
          // editable: true
        }}
        useResizeHandler={true}
      />
    </Box>
  )
}
