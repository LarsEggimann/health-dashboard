import CustomPopover from '../ui/popover'
import { DateRange, DayPicker } from 'react-day-picker'

type DateSelectorPopoverProps = {
  buttonLabel?: string
  selected: DateRange | undefined
  setSelected: (range: DateRange | undefined) => void
}

const DateSelectorPopover = (props: DateSelectorPopoverProps) => {
  return (
    <CustomPopover buttonLabel={props.buttonLabel}>
      <DayPicker
        className='chakra-day-picker'
        mode='range'
        selected={props.selected}
        onSelect={props.setSelected}
        required={false}
        footer={
          props.selected
            ? `Selected: ${props.selected.from?.toISOString()} - ${props.selected.to?.toISOString()}`
            : 'Pick a day.'
        }
      />
    </CustomPopover>
  )
}
export default DateSelectorPopover
