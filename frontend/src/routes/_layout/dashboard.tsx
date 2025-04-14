import { createFileRoute } from '@tanstack/react-router'
import { HealthDataService, MonitoringHeartRates } from '../../client'
import { useQuery } from '@tanstack/react-query'
import { Box } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import DateSelectorPopover from '../../components/common/datepicker/DateSelectorPopover'
import TimeSeriesChart from '../../components/common/PlotlyPlot'
import { subDays } from 'date-fns'

export const Route = createFileRoute('/_layout/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selected, setSelected] = useState<DateRange | undefined>({
    from: subDays(new Date(), 6),
    to: new Date(),
  })

  const dataRef = useRef<{ x: string[]; y: number[] }>({
    x: [selected?.from?.toISOString() || ''],
    y: [80],
  })

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

      dataRef.current.x = response.data.timestamp
      dataRef.current.y = response.data.heart_rate

      return response.data
    },
  })

  return (
    <Box w='100%' h='100%'>
      <DateSelectorPopover
        selected={selected}
        setSelected={setSelected}
        buttonLabel='Select Date Range'
      />

      <TimeSeriesChart
        xData={dataRef.current.x}
        yData={dataRef.current.y}
        title='Heart Rate'
        xAxisLabel='Time'
        yAxisLabel='Heart Rate [bpm]'
      />
    </Box>
  )
}
