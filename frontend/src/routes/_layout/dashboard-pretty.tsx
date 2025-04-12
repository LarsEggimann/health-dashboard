import { createFileRoute } from '@tanstack/react-router'
import { HealthDataService, MonitoringHeartRates } from '../../client'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Chart, useChart } from '@chakra-ui/charts'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Box } from '@chakra-ui/react'

export const Route = createFileRoute('/_layout/dashboard-pretty')({
  component: RouteComponent,
})

type PlotDataPoint = {
  timestamp: string
  heart_rate: number
}

function useHeartRatePlotData(
  data: MonitoringHeartRates | undefined,
): PlotDataPoint[] {
  return useMemo(() => {
    if (!data || !data.heart_rate || !data.timestamp) return []

    const minLength = Math.min(data.heart_rate.length, data.timestamp.length)

    return Array.from({ length: minLength }, (_, i) => ({
      timestamp: data.timestamp[i],
      heart_rate: data.heart_rate[i],
    }))
  }, [data])
}

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

  const heartRateData = useHeartRatePlotData(heartRateQuery.data)

  const chart = useChart({
    data: heartRateData,
    series: [
      {
        name: 'heart_rate',
      },
    ],
  })

  return (
    <Box>
      <Chart.Root chart={chart}>
        <LineChart data={chart.data}>
          <CartesianGrid stroke={chart.color('border')} vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={chart.key('timestamp')}
            tickFormatter={(value) => value.slice(0, 3)}
            stroke={chart.color('border')}
          />
          <YAxis
            axisLine={false}
            dataKey={chart.key('heart_rate')}
            tickLine={false}
            tickMargin={10}
            stroke={chart.color('border')}
          />
          <Tooltip
            animationDuration={100}
            cursor={false}
            content={<Chart.Tooltip />}
          />
          {chart.series.map((item) => (
            <Line
              key={item.name}
              isAnimationActive={false}
              dataKey={chart.key(item.name)}
              stroke={chart.color(item.color)}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </Chart.Root>
    </Box>
  )
}
