import { createFileRoute } from '@tanstack/react-router'
import { HealthDataService, MonitoringHeartRates } from '../../client'
import { useQuery } from '@tanstack/react-query'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'
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

  useQuery<MonitoringHeartRates>({
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

  return (
    <Box w='100%' h='100%'>
      <DateSelectorPopover
        selected={selected}
        setSelected={setSelected}
        buttonLabel='Select Date Range'
      />

      <TimeSeriesChart
        xData={plotData.x}
        yData={plotData.y}
        title='Heart Rate'
        xAxisLabel='Time'
        yAxisLabel='Heart Rate [bpm]'
      />
    </Box>
  )
}
