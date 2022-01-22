import Stepper from '@/components/Stepper'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { ChangeEvent, Fragment, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { FiEdit2 } from 'react-icons/fi'
import { ImCross } from 'react-icons/im'

const Create: NextPage = () => {
  const { data: session, status } = useSession()
  const router: NextRouter = useRouter()

  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [editableTestID, setEditableTestID] = useState<number | null>(null)
  const [challengeData, setChallengeData] = useState({
    title: '',
    description: '',
    testCases: [],
  })

  const handleDetailsChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fieldName = event.target.getAttribute('name')

    const fieldValue = event.target.value

    const newFormData = { ...challengeData }

    newFormData[fieldName] = fieldValue
    setChallengeData(newFormData)
    return
  }

  const handleTestChange = (event, testIndex: number, inputIndex: number) => {
    const fieldName = event.target.getAttribute('name')
    const fieldValue = event.target.value

    const newFormData = { ...challengeData }

    if (fieldName === 'output') {
      newFormData.testCases[testIndex].output = fieldValue
      setChallengeData(newFormData)
      return
    }

    newFormData.testCases[testIndex].inputs[inputIndex][fieldName] = fieldValue

    setChallengeData(newFormData)
  }

  const addTestInput = () => {
    const newFormData = { ...challengeData }
    console.log('🚀 ~ file: create.tsx ~ line 61 ~ addTestInput ~ newFormData', newFormData)
    console.log('🚀 ~ file: create.tsx ~ line 62 ~ addTestInput ~ editableTestID', editableTestID)
    newFormData.testCases[editableTestID].inputs.push({
      inputName: '',
      inputValue: '',
    })
    setChallengeData(newFormData)
  }

  const removeTestInput = (inputID) => {
    const newFormData = { ...challengeData }
    newFormData.testCases[editableTestID].inputs.splice(inputID, 1)
    setChallengeData(newFormData)
  }

  const saveTest = () => {
    setEditableTestID(null)
  }

  const deleteTestCase = () => {
    const newFormData = { ...challengeData }
    newFormData.testCases.splice(editableTestID, 1)
    setChallengeData(newFormData)
    setEditableTestID(null)
  }

  const addTestCase = () => {
    const newFormData = { ...challengeData }
    newFormData.testCases.push({
      inputs: [
        {
          inputName: '',
          inputValue: '',
        },
      ],
      output: '',
    })
    setChallengeData(newFormData)
  }

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!challengeData.title || !challengeData.description || !challengeData.testCases) {
      setError('Please fill out all the fields')
      return
    }
    if (challengeData.testCases.length <= 2) {
      setError('Please provide at least 3 test cases')
      return
    }

    const response = await fetch('/api/challenges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        owner: session.user.id,
        title: challengeData.title,
        description: challengeData.description,
        testCases: challengeData.testCases,
      }),
    })

    const data = await response.json()

    if (data.success) {
      console.log(data)

      router.push(`/challenges/${data.payload.insertID}`)
      return
    }

    setError('There was a problem uploading the challenge')
    return
  }

  const renderTest = (test, testID) => {
    if (editableTestID !== testID) {
      return (
        <Fragment>
          {test.inputs.map((input, j) => {
            return (
              <tr key={j} className="text-center">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900">
                  {input.inputName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900">
                  {input.inputValue}
                </td>
              </tr>
            )
          })}
          <tr>
            <td colSpan={2} />
            <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900">
              {test.output}
            </td>
          </tr>
        </Fragment>
      )
    }
    return (
      <Fragment>
        {test.inputs.map((input, j) => {
          return (
            <tr key={j} className="text-center">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900">
                <ImCross
                  onClick={() => removeTestInput(j)}
                  className="inline-block align-middle pr-2 text-left text-lg text-red-500 hover:text-red-700 hover:underline"
                />
                <input
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg shadow-sm border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  onChange={(e) => handleTestChange(e, testID, j)}
                  type="text"
                  name="inputName"
                  id="inputName"
                  value={challengeData.testCases[testID].inputs[j].inputName}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900">
                <input
                  className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg shadow-sm border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                  onChange={(e) => handleTestChange(e, testID, j)}
                  type="text"
                  name="inputValue"
                  id="inputValue"
                  value={challengeData.testCases[testID].inputs[j].inputValue}
                />
              </td>
            </tr>
          )
        })}
        <tr>
          <td>
            <div className="flex justify-center items-center mt-6">
              <button className="hover:text-green-500" type="button" onClick={() => addTestInput()}>
                <span>
                  <AiOutlinePlus className="inline-block align-middle" />
                </span>
                <span className="ml-2">Add input</span>
              </button>
            </div>
          </td>
          <td colSpan={1} />
          <td className="text-center px-6 py-4 text-sm font-medium text-gray-500 first:text-gray-900">
            <input
              className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg shadow-sm border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              onChange={(e) => handleTestChange(e, testID, 0)}
              type="text"
              name="output"
              id="output"
              value={challengeData.testCases[testID].output}
            />
          </td>
        </tr>
      </Fragment>
    )
  }

  const setDisplay = (step) => {
    let jsx: JSX.Element
    switch (step) {
      case 1:
        jsx = (
          <>
            <div>
              <label className="block" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="My Awesome Challenge"
                onChange={(e) => handleDetailsChange(e)}
                value={challengeData.title}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                onChange={(e) => handleDetailsChange(e)}
                value={challengeData.description}
                placeholder="Enter the challenge description here"
                className="form-textarea px-4 py-2 mt-2 block w-full border rounded-lg focus:outline-none"
                rows={4}
              />
            </div>
          </>
        )
        break
      case 2:
        jsx = (
          <div>
            {challengeData.testCases.length === 0 && <h4>There are no test cases</h4>}
            {challengeData.testCases.map((test, i) => {
              return (
                <Fragment key={i}>
                  <div className="pb-2 text-lg">
                    <h3>
                      {`Test ${i + 1} - `}
                      {editableTestID === i ? (
                        <span>
                          <button
                            type="button"
                            className="inline-flex text-white bg-blue-500 border-0 py-2 px-4 mb-2 mx-2 focus:outline-none hover:bg-blue-600 rounded text-lg"
                            onClick={() => saveTest()}
                          >
                            save test
                          </button>

                          <button
                            className="inline-flex text-white bg-red-500 border-0 py-2 px-4 mb-2 focus:outline-none hover:bg-red-600 rounded text-lg"
                            type="button"
                            onClick={() => deleteTestCase()}
                          >
                            delete test
                          </button>
                        </span>
                      ) : (
                        <span onClick={() => setEditableTestID(i)} className="hover:text-blue-500">
                          <FiEdit2 className="align-middle inline-block" />
                        </span>
                      )}
                    </h3>
                  </div>

                  <table className="table w-full text-left">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl text-center">
                          input name
                        </th>
                        <th className="px-6 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl text-center">
                          input value
                        </th>
                        <th className="px-6 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl text-center">
                          output
                        </th>
                      </tr>
                    </thead>
                    <tbody>{renderTest(test, i)}</tbody>
                  </table>
                </Fragment>
              )
            })}
            <div className="flex justify-between items-center mt-3">
              <hr className="w-1/2" />

              <button
                type="button"
                onClick={() => addTestCase()}
                className="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 hover:underline text-xs text-center mx-5"
              >
                <span>
                  <AiOutlinePlus className="inline-block align-middle" />
                </span>
                <span className="ml-2">Add test case</span>
              </button>

              <hr className="w-1/2" />
            </div>
          </div>
        )
      default:
        break
    }
    return jsx
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 w-full lg:w-5/6 text-center sm:text-left bg-white shadow-lg">
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
                {setDisplay(currentStep)}
                {currentStep === 3 && (
                  <div className="mt-10">
                    <p className="text-lg my-2">Title: {challengeData.title}</p>
                    <p className="text-lg my-2">Description: {challengeData.description}</p>
                    {challengeData.testCases.map((test, i) => {
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
                    className="px-6 py-2 mt-4 text-white rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-900"
                  >
                    Previous Step
                  </button>

                  {currentStep !== 3 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
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
                      Create Challenge
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
