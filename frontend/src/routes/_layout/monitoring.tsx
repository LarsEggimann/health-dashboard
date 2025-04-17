import { createFileRoute } from '@tanstack/react-router'
import {
  HealthDataService,
  MonitoringHeartRateResponse,
  MonitoringResponse,
} from '../../client'
import { useQuery } from '@tanstack/react-query'
import { Box } from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import DateSelectorPopover, {
  DateRange,
} from '../../components/common/datepicker/DateSelectorPopover'
import TimeSeriesChart from '../../components/common/PlotlyPlot'
import { subDays } from 'date-fns'

export const Route = createFileRoute('/_layout/monitoring')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selected, setSelected] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  })

  const [plotData, setPlotData] = useState<{ x: string[]; y: number[] }>({
    x: [],
    y: [],
  })

  useQuery<MonitoringHeartRateResponse>({
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
      setPlotData({
        x: response.data.timestamp,
        y: response.data.heart_rate,
      })
      return response.data
    },
  })

  const [monitoringData, setMonitoringData] =
    useState<MonitoringResponse | null>(null)

  useQuery<MonitoringResponse>({
    queryKey: ['monitoring', selected],
    queryFn: async () => {
      const response = await HealthDataService.healthDataGetMonitoringData({
        query: {
          start: selected?.from?.toISOString(),
          end: selected?.to?.toISOString(),
        },
      })
      if (!response.data) {
        throw new Error('Error fetching heart rate data')
      }
      setMonitoringData(response.data)
      return response.data
    },
  })

  const [intesityData, setIntesityData] = useState<{
    x: string[]
    y: number[]
  }>({
    x: [],
    y: [],
  })

  useMemo(() => {
    console.log('monitoringData', monitoringData?.data)
    if (monitoringData?.data) {
      const x: string[] = []
      const y: number[] = []
      for (const m of monitoringData.data) {
        x.push(m.timestamp)
        y.push(m.intensity)
      }
      setIntesityData({
        x: x,
        y: y,
      })
    }
  }, [monitoringData])

  return (
    <Box w='100%' h='100%'>
      <DateSelectorPopover
        selected={selected}
        setSelected={setSelected}
        buttonLabel='Select Date Range'
      />

      <Box h='50%'>
        <TimeSeriesChart
          xData={plotData.x}
          yData={plotData.y}
          title='Heart Rate'
          xAxisLabel='Time'
          yAxisLabel='Heart Rate [bpm]'
        />
      </Box>
      <Box h='50%'>
        <TimeSeriesChart
          xData={intesityData.x}
          yData={intesityData.y}
          title='Intensity'
          xAxisLabel='Time'
          yAxisLabel='Intensity [AU]'
        />
      </Box>
    </Box>
  )
}
