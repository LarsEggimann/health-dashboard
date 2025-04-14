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

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

type DateSelectorPopoverProps = {
  buttonLabel?: string
  selected: DateRange | undefined
  setSelected: (range: DateRange | undefined) => void
}

const DateSelectorPopover = (props: DateSelectorPopoverProps) => {
  const preDefinedRanges = [
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

  return (
    // <CustomPopover buttonLabel={props.buttonLabel}>
    // <CustomPopover buttonLabel={props.buttonLabel}>
    <>
      <DateRangePicker
        ranges={preDefinedRanges}
        showOneCalendar={true}
        format='dd.MM.yyyy HH:mm'
        onChange={(dates) => setDates(dates)}
        appearance='subtle'
      />
    </>

    // </CustomPopover>
  )
}
export default DateSelectorPopover
