import React, { useState } from 'react'
import { BiChevronDownCircle, BiChevronUpCircle } from 'react-icons/bi'
import { FiAlertCircle, FiCheckCircle, FiCircle, FiPlayCircle } from 'react-icons/fi'

interface Props {
  inputs: {
    inputName: string
    inputValue: string
  }[]
  output: string
  testNumber: number
  code: string
  fnName: string
}

const TestAccordion = ({ code, inputs, output, testNumber, fnName }: Props) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('Here you can view any print statements or error messages for debugging')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const executeCode = async () => {
    setError('')
    setResult('')
    setSuccess(false)
    setLoading(true)
    let inputValues = ''
    inputs.forEach((inputObj) => {
      inputValues += `${inputObj.inputValue}, `
    })
    // TODO: Refactor code - must -2 from string to remove excess ", "
    inputValues = inputValues.substring(0, inputValues.length - 2)

    const codeToExecute = `${code}\nassert ${fnName}(${inputValues}) == ${output}`

    const response = await fetch('/api/code?execute=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: codeToExecute }),
    })
    const data = await response.json()

    if (data.success && data.payload.output.error) {
      setError(data.payload.output.message)
      setLoading(false)
      return
    }
    if (data.success && !data.payload.output.error) {
      setSuccess(true)
      setResult(data.payload.output.message)
      setLoading(false)
      return
    }
  }

  return (
    <div className="my-5">
      <button
        onClick={(e) => {
          e.stopPropagation()
          executeCode()
        }}
        className={`
          rounded-lg px-4 py-2 bg-blue-500 text-blue-100 hover:bg-blue-600 duration-300
          ${loading ? 'cursor-not-allowed disabled:opacity-50' : 'bg-blue-500'}`}
        type="button"
        disabled={loading}
      >
        {loading && (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white align-middle inline-block mr-2"></div>
            <span>Running test {testNumber}...</span>
          </>
        )}
        {!loading && (
          <>
            <FiPlayCircle className="text-white mr-2 inline-block align-middle" />
            <span>Run test {testNumber}</span>
          </>
        )}
      </button>
      <div
        className={`text-xl font-medium  duration-300 p-3 flex justify-between rounded-lg ${
          open ? 'bg-gray-100 bg-opacity-50 rounded-b-none' : 'bg-white hover:bg-gray-100 hover:bg-opacity-50'
        } `}
        role="alert"
        onClick={() => setOpen(!open)}
      >
        <div>
          Test {testNumber}
          {!success && !error && <FiCircle className="ml-2 align-middle inline-block" />}
          {success && <FiCheckCircle className="ml-2 text-green-600 align-middle inline-block" />}
          {error && <FiAlertCircle className="ml-2 text-red-600 align-middle inline-block" />}
        </div>
        {open ? (
          <BiChevronUpCircle
            className={`inline-block align-middle ${error && 'text-red-600'} ${success && 'text-green-600'}`}
          />
        ) : (
          <BiChevronDownCircle
            className={`inline-block align-middle ${error && 'text-red-600'} ${success && 'text-green-600'}`}
          />
        )}
      </div>
      {open && (
        <div className="bg-gray-100 bg-opacity-50 p-3 pt-1 rounded-b-lg">
          {inputs.map((input, index) => {
            return (
              <h3 key={index} className="text-lg">
                {input.inputName} = {input.inputValue}
              </h3>
            )
          })}
          <h3 className="text-lg">Expected Output: {output}</h3>
          <div className="flex justify-between items-center mt-3">
            <hr className="w-full" />
            <span className="p-2 text-gray-400 mb-1">Console</span>
            <hr className="w-full" />
          </div>
          <h3 className={`text-lg ${error && 'text-red-600'}`}>
            {success && 'Well done! This test passed'}
            {result && result}
            {error && error}
          </h3>
        </div>
      )}
    </div>
  )
}

export default TestAccordion
