import React, { Fragment, useState } from 'react'
import dynamic from 'next/dynamic'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import TestAccordion from './TestAccordion'

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
}

const CodeMirror = dynamic(
  () => {
    import('codemirror/mode/python/python')
    return import('react-codemirror')
  },
  { ssr: false }
)

export const CodeEditor = ({ title, testCases }: Props) => {
  const functionName = title.toLowerCase().replace(/ /g, '_')
  let inputNames = ''
  testCases[0].inputs.forEach((inputObj) => {
    inputNames += `${inputObj.inputName}, `
  })
  inputNames = inputNames.substring(0, inputNames.length - 2)

  const [code, setCode] = useState(`def ${functionName}(${inputNames}):`)

  const options = { lineNumbers: true, mode: 'python', theme: 'material', lineWrapping: true }

  const onCodeChange = (code: string) => setCode(code)

  return (
    CodeMirror && (
      <>
        <CodeMirror onChange={onCodeChange} options={options} value={code} className="my-3 text-lg" />

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
