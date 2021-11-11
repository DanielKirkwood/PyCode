import React, { useState } from 'react'
import { FiCircle, FiCheckCircle, FiAlertCircle, FiPlayCircle } from 'react-icons/fi'
import { BiChevronDownCircle, BiChevronUpCircle } from 'react-icons/bi'

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
    inputValues = inputValues.substring(0, inputValues.length - 2)

    const codeToExecute = `${code}\nassert ${fnName}(${inputValues}) == ${output}`

    const response = await fetch('/api/executeCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: codeToExecute }),
    })
    const data = await response.json()
    console.log(data)

    if (data.error) {
      setError(data.error)
      console.log('error')
      setLoading(false)
    } else {
      setSuccess(true)
      setResult(data.output)
      console.log('success')
      setLoading(false)
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
          text-white
          font-bold
          uppercase
          rounded-lg
          text-sm
          shadow
          hover:shadow-lg
          outline-none
          focus:outline-none
          px-3
          py-2
          mb-3
          ease-linear
          transition-all
          duration-150
          ${loading ? 'bg-gray-500' : 'bg-blue-500'}`}
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
            <FiPlayCircle className="text-white mr-2" />
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
          {!success && !error && <FiCircle className="ml-2" />}
          {success && <FiCheckCircle className="ml-2 text-green-600" />}
          {error && <FiAlertCircle className="ml-2 text-red-600" />}
        </div>
        {open ? <BiChevronUpCircle /> : <BiChevronDownCircle />}
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
