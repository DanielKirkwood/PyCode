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
      className="hover:underline border-blue-400 border-2 text-black
               font-bold rounded-lg my-3 py-2 px-4 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
    >
      {display}
    </button>
  )
}

export default SaveButton
