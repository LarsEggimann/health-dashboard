import { DateRangePicker } from 'rsuite'
import 'rsuite/DateRangePicker/styles/index.css'
import {
  startOfWeek,
  endOfWeek,
  subDays,
  subHours,
  endOfToday,
  startOfToday,
  startOfYesterday,
  endOfYesterday,
} from 'date-fns'
import { RangeType } from 'rsuite/esm/DateRangePicker'
import { useColorMode } from '../../ui/color-mode'
import { useState } from 'react'
import { Box, Input } from '@chakra-ui/react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export type DateRange = {
  from: Date | undefined | null
  to: Date | undefined | null
}

type DateSelectorPopoverProps = {
  buttonLabel?: string
  selected: DateRange | undefined
  setSelected: (range: DateRange | undefined) => void
}

const DateSelectorPopover = (props: DateSelectorPopoverProps) => {
  const preDefinedRanges: RangeType[] = [
    {
      label: 'Last Hour',
      value: [subHours(new Date(), 1), new Date()],
      placement: 'left',
    },
    {
      label: 'Today',
      value: [startOfToday(), endOfToday()],
      placement: 'left',
    },
    {
      label: 'Yesterday',
      value: [startOfYesterday(), endOfYesterday()],
      placement: 'left',
    },
    {
      label: 'This week',
      value: [startOfWeek(new Date()), endOfWeek(new Date())],
      placement: 'left',
    },
    {
      label: 'Last 7 days',
      value: [subDays(new Date(), 6), new Date()],
      placement: 'left',
    },
    {
      label: 'Last 30 days',
      value: [subDays(new Date(), 29), new Date()],
      placement: 'left',
    },
  ]

  const setDates = (dates: [Date, Date] | null) => {
    if (dates) {
      props.setSelected({
        from: dates[0],
        to: dates[1],
      })
    } else {
      props.setSelected(undefined)
    }
  }

  const { colorMode } = useColorMode()
  const [startDate, setStartDate] = useState<Date | null>(props.selected?.from)
  const [endDate, setEndDate] = useState<Date | null>(props.selected?.to)

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    props.setSelected({ from: start, to: end })
  }

  return (
    // <CustomPopover buttonLabel={props.buttonLabel}>
    // <CustomPopover buttonLabel={props.buttonLabel}>
    <>
      <Box
        style={
          {
            '.react-datepicker': {
              backgroundColor: colorMode === 'dark' ? '#2D3748' : 'white',
              color: colorMode === 'dark' ? 'white' : 'black',
              border: '1px solid',
              borderColor: colorMode === 'dark' ? 'gray.600' : 'gray.200',
            },
            '.react-datepicker__header': {
              backgroundColor: colorMode === 'dark' ? '#1A202C' : 'gray.100',
              borderBottom: '1px solid',
              borderColor: colorMode === 'dark' ? 'gray.600' : 'gray.200',
            },
            '.react-datepicker__day--selected': {
              backgroundColor: colorMode === 'dark' ? '#63B3ED' : '#3182CE',
            },
            '.react-datepicker__day:hover': {
              backgroundColor: colorMode === 'dark' ? '#4A5568' : '#E2E8F0',
            },
          } as React.CSSProperties
        }
      >
        <ReactDatePicker
          selected={startDate}
          onChange={handleChange}
          startDate={startDate}
          endDate={endDate}
          showTimeSelect
          selectsRange
          customInput={<Input />}
          dateFormat='dd.MM.yyyy'
          placeholderText='Select date range'
        />
      </Box>

      {/* <DateRangePicker
        ranges={preDefinedRanges}
        // showOneCalendar={true}
        format='dd.MM.yyyy HH:mm'
        onChange={(dates) => setDates(dates)}
        appearance='subtle'
      /> */}
    </>

    // </CustomPopover>
  )
}
export default DateSelectorPopover
