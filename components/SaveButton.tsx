import React, { ReactElement } from 'react'
import { BsCheck } from 'react-icons/bs'

enum SavingState {
  NOT_SAVED,
  SAVING,
  SAVED,
  ERROR,
}

interface SaveButtonProps {
  saving: SavingState
  onClick(event: React.MouseEvent<HTMLElement>): void
}

const SaveButton = ({ saving, onClick }: SaveButtonProps): ReactElement => {
  let display
  switch (saving) {
    case SavingState.SAVING:
      display = <em>saving...</em>
      break
    case SavingState.SAVED:
      display = (
        <>
          <BsCheck /> <em>saved!</em>
        </>
      )
      break
    case SavingState.NOT_SAVED:
      display = <em>not saved - click here to save your work</em>
      break
    case SavingState.ERROR:
      display = <em>Sign in to save your code</em>
      break
    default:
      display = <br />
      break
  }
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 hover:underline border-2 my-3 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
    >
      {display}
    </button>
  )
}

export default SaveButton
