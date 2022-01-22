import React, { ReactElement } from 'react'
import { AiFillSave } from 'react-icons/ai'
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
          <BsCheck className="align-middle inline-block " /> <em>saved!</em>
        </>
      )
      break
    case SavingState.NOT_SAVED:
      display = (
        <>
          <AiFillSave className="align-middle inline-block " /> <em>save changes</em>
        </>
      )
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
      className="rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-blue-600 duration-300 text-md"
    >
      {display}
    </button>
  )
}

export default SaveButton
