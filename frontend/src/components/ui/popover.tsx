import { Button, Popover, Portal, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

type CustomPopoverProps = {
  buttonLabel?: string
  buttonVariant?:
    | 'outline'
    | 'solid'
    | 'subtle'
    | 'surface'
    | 'ghost'
    | 'plain'
    | undefined
  children?: ReactNode
}

const CustomPopover = ({
  buttonLabel = 'Click me',
  buttonVariant = 'surface',
  children,
}: CustomPopoverProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button size='sm' variant={buttonVariant}>
          {buttonLabel}
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              {children ?? (
                <>
                  <Text fontWeight='medium'>Naruto Form</Text>
                  <Text my='4'>
                    Naruto is a Japanese manga series written and illustrated by
                    Masashi Kishimoto.
                  </Text>
                </>
              )}
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

export default CustomPopover
