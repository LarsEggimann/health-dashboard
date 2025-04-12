import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { CurrentDataResponse, ElectrometerService } from '../../client'
import { Button, Flex } from '@chakra-ui/react'
import TimeSeriesChart from '../../components/common/PlotlyPlot'
import { DateRange } from 'react-day-picker'

export const Route = createFileRoute('/_layout/test-websockets')({
  component: RouteComponent,
})

function RouteComponent() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [ws, setWs] = useState<WebSocket | undefined>(undefined)

  const [selected, setSelected] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 10 * 1000),
    to: new Date(),
  })

  const [x, setX] = useState<string[]>([])
  const [y, setY] = useState<number[]>([])

  const em1Query = useQuery<CurrentDataResponse>({
    queryKey: ['em1Data', selected],
    queryFn: async () => {
      const response =
        await ElectrometerService.electrometerTestGetDataElectrometer1({
          query: {
            start: selected?.from?.toISOString(),
            end: selected?.to?.toISOString(),
          },
        })
      if (!response.data) {
        throw new Error('Error fetching heart rate data')
      }
      dataRef.current.x = response.data.time
      dataRef.current.y = response.data.current
      forceUpdate((n) => n + 1) // trigger re-render to show initial chart

      return response.data
    },
  })

  const dataRef = useRef<{ x: string[]; y: number[] }>({ x: [], y: [] })
  const [_, forceUpdate] = useState(0) // force a re-render when needed

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws')
    setWs(websocket)
    websocket.onopen = () => console.log('Connected to WebSocket server')
    websocket.onmessage = (event) => {
      const { current, time } = JSON.parse(JSON.parse(event.data))
      console.log('Received data:', current, time)
      if (current && time) {
        const newDataCount = current.length
        dataRef.current.x = [...dataRef.current.x, ...time].slice(newDataCount)
        dataRef.current.y = [...dataRef.current.y, ...current].slice(
          newDataCount,
        )
        forceUpdate((n) => n + 1) // trigger re-render
      }
    }
    websocket.onclose = () => console.log('Disconnected from WebSocket server')
    return () => websocket.close()
  }, [selected])

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(input)
      setInput('')
    } else {
      console.error('WebSocket is not open. Unable to send message.')
    }
  }

  return (
    <div className='notification-center'>
      <h2>Real-Time Notifications</h2>
      <input
        type='text'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Type a message'
      />
      <button onClick={sendMessage}>Send</button>

      <Flex gap={4}>
        <Button
          onClick={() =>
            ElectrometerService.electrometerTestConnectToElectrometer1()
          }
          colorScheme='teal'
          size='md'
        >
          Connect to Electrometer 1
        </Button>
        <Button
          onClick={() =>
            ElectrometerService.electrometerTestTriggerMeasureElectrometer1()
          }
          colorScheme='teal'
          size='md'
        >
          Trigger Measure
        </Button>
        <Button
          onClick={() =>
            ElectrometerService.electrometerTestStartContinuousMeasureElectrometer1()
          }
          colorScheme='teal'
          size='md'
        >
          Start Continous
        </Button>
        <Button
          onClick={() =>
            ElectrometerService.electrometerTestStopContinuousMeasureElectrometer1()
          }
          colorScheme='teal'
          size='md'
        >
          Stop Measure
        </Button>
      </Flex>

      {!em1Query.isPending && (
        <TimeSeriesChart
          xData={() => dataRef.current.x}
          yData={() => dataRef.current.y}
          height={500}
          title='Electrometer 1'
          xAxisLabel='Time'
          yAxisLabel='Current [A]'
          hoverTemplate='<b>Time:</b> %{customdata[0]}<br><b>Current:</b> %{customdata[1]} A<extra></extra>'
        />
      )}
      <div className='messages'>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  )
}
