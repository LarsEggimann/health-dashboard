import { createFileRoute } from '@tanstack/react-router'
import { HealthDataService, MonitoringHeartRates } from '../../client'
import { useQuery } from '@tanstack/react-query'
import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import 'react-day-picker/style.css'
import DateSelectorPopover from '../../components/common/DateSelectorPopover'
import TimeSeriesChart from '../../components/common/PlotlyPlot'

export const Route = createFileRoute('/_layout/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const [selected, setSelected] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    to: new Date(),
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
      return response.data
    },
  })

  return (
    <Box w='100%' h='100%'>
      <Box className='chakra-day-picker'>
        <DateSelectorPopover
          selected={selected}
          setSelected={setSelected}
          buttonLabel='Select Date Range'
        />
      </Box>
      {!heartRateQuery.isPending && (
        <TimeSeriesChart
          xData={() => heartRateQuery.data?.timestamp || []}
          yData={() => heartRateQuery.data?.heart_rate || []}
        />
      )}
    </Box>
  )
}
