import React, { Fragment, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'

import SaveButton from '@/components/SaveButton'
import TestAccordion from '@/components/TestAccordion'

import useSWR, { useSWRConfig } from 'swr'

interface TestCase {
  inputs: {
    inputName: string
    inputValue: string
  }[]
  output: string
}
interface Props {
  title: string
  testCases: TestCase[]
  challengeID: string | string[]
}

enum SavingState {
  NOT_SAVED,
  SAVING,
  SAVED,
  ERROR,
}

const CodeMirror = dynamic(
  () => {
    import('codemirror/mode/python/python')
    return import('react-codemirror')
  },
  { ssr: false }
)

function createFunctionName(title: string) {
  return title.toLowerCase().replace(/ /g, '_')
}

function createBoilerplate(title: string, testCase: TestCase) {
  const functionName = createFunctionName(title)
  let inputNames = ''
  testCase.inputs.forEach((inputObj) => {
    inputNames += `${inputObj.inputName}, `
  })
  inputNames = inputNames.substring(0, inputNames.length - 2)
  const boilerplate = `def ${functionName}(${inputNames}):`
  return boilerplate
}

export const CodeEditor = ({ title, testCases, challengeID }: Props) => {
  // controls user session
  const { data: session, status } = useSession()

  const { mutate } = useSWRConfig()
  // state
  const [code, setCode] = useState(() => {
    const initialState = createBoilerplate(title, testCases[0])
    return initialState
  })
  const [saving, setSaving] = useState(SavingState.NOT_SAVED)
  const [linterOutput, setLinterOutput] = useState([])

  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json())
  const { data } = useSWR(status === 'authenticated' ? `/api/${session.user.id}/${challengeID}` : null, fetcher)

  // code mirror
  const options = { lineNumbers: true, mode: 'python', theme: 'material', lineWrapping: true }
  function onCodeChange(newCode: string) {
    setCode(newCode)
  }

  async function onSave() {
    mutate(
      `/api/${session.user.id}/${challengeID}`,
      {
        ...data,
        payload: {
          document: {
            ...data.payload.document,
            code: code,
          },
        },
      },
      false
    )
    setSaving(SavingState.SAVING)

    const response = await fetch(`/api/${session.user.id}/${challengeID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
    })

    if (response.ok) {
      setSaving(SavingState.SAVED)
      mutate(`/api/${session.user.id}/${challengeID}`)
      return
    }

    setSaving(SavingState.NOT_SAVED)
    mutate(`/api/${session.user.id}/${challengeID}`)
    return
  }

  async function lintCode() {
    const response = await fetch('/api/code?execute=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
    })
    const data = await response.json()

    if (data.success === true) {
      setLinterOutput(data.payload.messages)
    }
  }

  return (
    CodeMirror && (
      <>
        {data?.payload?.document.code && (
          <>
            {
              <CodeMirror
                onChange={onCodeChange}
                options={options}
                value={data.payload.document.code}
                className="my-3 text-lg"
              />
            }
            <SaveButton onClick={onSave} saving={saving} />
          </>
        )}
        {data?.error && (
          <>
            {<CodeMirror onChange={onCodeChange} options={options} value={code} className="my-3 text-lg" />}
            <SaveButton onClick={onSave} saving={saving} />
          </>
        )}
        {!data && (
          <>
            {<CodeMirror onChange={onCodeChange} options={options} value={code} className="my-3 text-lg" />}
            <SaveButton onClick={onSave} saving={SavingState.ERROR} />
          </>
        )}

        <button
          onClick={lintCode}
          className="ml-4 px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 hover:underline border-2 my-3 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          Check Code Style
        </button>

        {linterOutput &&
          linterOutput.map((message, index) => {
            return (
              <Fragment key={index}>
                <p className="text-red-600">
                  <span className="font-bold">{message.messageID} - </span>
                  {message.message} on line {message.line}
                </p>
              </Fragment>
            )
          })}

        {testCases.map((test, index) => {
          return (
            <Fragment key={index}>
              <TestAccordion
                inputs={test.inputs}
                output={test.output}
                testNumber={index + 1}
                fnName={createFunctionName(title)}
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
