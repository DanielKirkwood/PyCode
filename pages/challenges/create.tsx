import type { NextPage } from 'next'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'
import { Fragment } from 'react'
import { NextRouter, useRouter } from 'next/router'
import Stepper from '@/components/Stepper'

const Create: NextPage = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [testCases, setTestCases] = useState([])
  const [inputs, setInputs] = useState([])
  const [inputName, setInputName] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const titleInput = useRef(null)

  const { data: session, status } = useSession()
  const router: NextRouter = useRouter()

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title || !description || !testCases) {
      setError('Please fill out all the fields')
      return
    }

    const response = await fetch('/api/challenges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner: session.user.email,
        title,
        description,
        testCases,
      }),
    })

    if (response.status === 500) {
      setError('There was a problem uploading the challenge')
    } else {
      const data = await response.json()
      router.push(`/challenges/${data.insertId}`)
    }

    return
  }

  const handleAddInput = () => {
    const newInput = {
      inputName,
      inputValue,
    }
    setInputs([...inputs, newInput])
    setInputName('')
    setInputValue('')
    return
  }

  const handleAddTest = () => {
    const testCase = {
      inputs,
      output,
    }
    setTestCases([...testCases, testCase])
    setInputs([])
    setInputName('')
    setInputValue('')
    setOutput('')
    return
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 w-full sm:w-2/3 text-center sm:text-left bg-white shadow-lg">
        {status === 'unauthenticated' && (
          <div className="text-center">
            <p className="py-2 mb-4 text-center text-md tracking-wide text-red-600">
              You must be logged in to create challenges
            </p>
            <Link href="/login">
              <a className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</a>
            </Link>
          </div>
        )}
        {status === 'authenticated' && (
          <>
            <h3 className="text-2xl font-bold text-center mb-10">Create challenge</h3>
            <Stepper currentStep={currentStep} steps={['Details', 'Test Cases', 'Review & Confirm']} />
            <form onSubmit={onFormSubmit}>
              <div className="mt-4 w-full">
                {currentStep === 1 && (
                  <>
                    <div>
                      <label className="block" htmlFor="title">
                        Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        placeholder="My Awesome Challenge"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        ref={titleInput}
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        id="description"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        placeholder="Enter the challenge description here"
                        className="form-textarea px-4 py-2 mt-2 block w-full border rounded-lg focus:outline-none"
                        rows={4}
                      />
                    </div>
                  </>
                )}
                {currentStep === 2 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-12 gap-4">
                      <label className="block col-span-6" htmlFor="inputName">
                        Input name
                      </label>
                      <label className="block col-span-6" htmlFor="inputValue">
                        Input value
                      </label>
                      {inputs.map((input, i) => {
                        return (
                          <Fragment key={i}>
                            <p className="block col-span-6">{input.inputName}</p>
                            <p className="block col-span-6">{input.inputValue}</p>
                          </Fragment>
                        )
                      })}
                      <input
                        id="inputName"
                        type="text"
                        placeholder="x"
                        onChange={(e) => setInputName(e.target.value)}
                        value={inputName}
                        className="col-span-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                      <input
                        id="inputValue"
                        type="text"
                        placeholder="5"
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                        className="col-span-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <button
                      onClick={handleAddInput}
                      type="button"
                      className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                    >
                      Add Input
                    </button>

                    <div className="flex flex-col items-center sm:flex-row sm:items-center justify-between">
                      <div className="mt-4">
                        <input
                          id="output"
                          type="text"
                          placeholder="Output"
                          onChange={(e) => setOutput(e.target.value)}
                          value={output}
                          className="col-span-4 sm:col-span-5 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                      <button
                        onClick={handleAddTest}
                        type="button"
                        className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                      >
                        Confirm test
                      </button>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="mt-10">
                    <p className="text-lg my-2">Title: {title}</p>
                    <p className="text-lg my-2">Description: {description}</p>
                    {testCases.map((test, i) => {
                      return (
                        <Fragment key={i}>
                          <hr className="w-full my-3" />
                          <p className="text-lg text-center">Test {i + 1}</p>
                          <p className="text-lg">Inputs:</p>
                          {test.inputs.map((input, j) => {
                            return (
                              <Fragment key={j}>
                                <p className="text-lg">{`${input.inputName} = ${input.inputValue}`}</p>
                              </Fragment>
                            )
                          })}
                          <p className="text-lg mt-4">Output: {test.output}</p>
                        </Fragment>
                      )
                    })}
                  </div>
                )}
                {error && <span className="text-xs tracking-wide text-red-600">{error}</span>}
                <hr className="w-full mt-3" />
                <div className="flex flex-col items-center sm:flex-row sm:items-baseline justify-between">
                  <button
                    disabled={currentStep === 1 ? true : false}
                    onClick={() => setCurrentStep(currentStep - 1)}
                    type="button"
                    className={`px-6 py-2 mt-4 text-white rounded-lg ${
                      currentStep === 1 ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-900'
                    }`}
                  >
                    Previous Step
                  </button>
                  {currentStep !== 3 && (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      type="button"
                      className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                    >
                      Next Step
                    </button>
                  )}
                  {currentStep === 3 && (
                    <button
                      type="submit"
                      className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                    >
                      Finish
                    </button>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default Create
