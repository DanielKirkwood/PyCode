import React, { Fragment, ReactElement, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { BsCheck } from 'react-icons/bs'
import { useSession } from 'next-auth/react'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import TestAccordion from './TestAccordion'

interface AutoSaveProps {
  saving: SavingState
}

const AutoSaveDisplay = ({ saving }: AutoSaveProps): ReactElement => {
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
      display = <em>not saved</em>
    default:
      display = <br />
  }
  return <div className="auto-save-display">{display}</div>
}

interface TestCases {
  inputs: {
    inputName: string
    inputValue: string
  }[]
  output: string
}
interface Props {
  title: string
  testCases: TestCases[]
  challengeID: string | string[]
}

enum SavingState {
  NOT_SAVED,
  SAVING,
  SAVED,
}

const CodeMirror = dynamic(
  () => {
    import('codemirror/mode/python/python')
    return import('react-codemirror')
  },
  { ssr: false }
)

export const CodeEditor = ({ title, testCases, challengeID }: Props) => {
  const { data: session } = useSession()
  const functionName = title.toLowerCase().replace(/ /g, '_')
  let inputNames = ''
  testCases[0].inputs.forEach((inputObj) => {
    inputNames += `${inputObj.inputName}, `
  })
  inputNames = inputNames.substring(0, inputNames.length - 2)

  const [code, setCode] = useState(`def ${functionName}(${inputNames}):`)
  const [saving, setSaving] = useState(SavingState.NOT_SAVED)

  const options = { lineNumbers: true, mode: 'python', theme: 'material', lineWrapping: true }

  const onCodeChange = (code: string) => setCode(code)

  const DELAY = 5 // minutes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setSaving(SavingState.SAVING)

      // call to api to save code
      const response = await fetch(`/api/${session.user.id}/${challengeID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
        }),
      })

      if (response.ok) {
        // if successful
        setSaving(SavingState.SAVED)
      } else {
        console.error('error saving code')
        setSaving(SavingState.NOT_SAVED)
      }
    }, DELAY * 1000)
    return () => {
      clearTimeout(timer)
      setSaving(SavingState.NOT_SAVED)
    }
  })

  return (
    CodeMirror && (
      <>
        <CodeMirror onChange={onCodeChange} options={options} value={code} className="my-3 text-lg" />
        <AutoSaveDisplay saving={saving} />
        {testCases.map((test, index) => {
          return (
            <Fragment key={index}>
              <TestAccordion
                inputs={test.inputs}
                output={test.output}
                testNumber={index + 1}
                fnName={functionName}
                code={code}
              />
            </Fragment>
          )
        })}
      </>
    )
  )
}

export default CodeEditor
