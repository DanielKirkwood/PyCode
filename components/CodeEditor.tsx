import SaveButton from '@/components/SaveButton'
import TestAccordion from '@/components/TestAccordion'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import React, { Fragment, useState } from 'react'
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
  const options = {
    lineNumbers: true,
    mode: 'python',
    theme: 'material',
    indentUnit: 4,
    smartIndent: true,
    indentWithTabs: false,
    electricChars: true,
    matchBrackets: true,
  }
  function onCodeChange(newCode: string) {
    setSaving(SavingState.NOT_SAVED)
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
        {data?.payload?.document?.code && (
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
          className="ml-4 mt-4 rounded-lg px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300"
        >
          Check Code Style
        </button>

        {linterOutput && (
          <>
            <h3 className="leading-normal pt-4 text-center">Code Analysis Results</h3>
            <table className="sm:inline-table w-full flex flex-row flex-nowrap sm:bg-white rounded-lg overflow-hidden sm:shadow-lg my-5">
              <thead className="text-white">
                {linterOutput.map((l, i) => {
                  return (
                    <tr
                      key={i}
                      className={`${
                        i > 0 && 'sm:hidden'
                      } bg-gray-400 flex flex-col flex-nowrap sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0`}
                    >
                      <th className="p-3 text-left">Pylint Code</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Line</th>
                    </tr>
                  )
                })}
              </thead>
              <tbody className="flex-1 sm:flex-none">
                {linterOutput.map((message, i) => {
                  return (
                    <tr key={i} className="flex flex-col flex-nowrap sm:table-row mb-2 sm:mb-0 ">
                      <td className="border-grey-light border hover:bg-gray-100 p-3 border-b-0 ">
                        {message.messageID}
                      </td>
                      <td className="border-grey-light border border-b-0 hover:bg-gray-100 p-3 truncate">
                        {message.message}
                      </td>
                      <td className="border-grey-light border hover:bg-gray-100 p-3">{message.line}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}

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
