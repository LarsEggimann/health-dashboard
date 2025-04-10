import { toaster } from '../components/ui/toaster'

const useCustomToast = () => {
  const showSuccessToast = (description: string) => {
    toaster.create({
      title: 'Success!',
      description,
      type: 'success',
    })
  }

  const showErrorToast = (description: string) => {
    toaster.create({
      title: 'Something went wrong!',
      description,
      type: 'error',
      duration: 120 * 1000, // 120 seconds,
    })
  }

  return { showSuccessToast, showErrorToast }
}

export default useCustomToast
