import Stepper from '@/components/Stepper'
import { getOne } from 'lib/db/challenges'
import clientPromise from 'lib/db/mongodb'
import type { GetServerSideProps, NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { ImCross } from 'react-icons/im'

interface TestCase {
  inputs: {
    inputName: string
    inputValue: string
  }[]
  output: string
}
interface challengeData {
  id: string
  title: string
  owner: string
  description: string
  verified: boolean
  testCases: TestCase[]
  createdAt: string
}

interface Props {
  challenge: challengeData
}

const EditChallengePage: NextPage<Props> = ({ challenge }) => {
  const router: NextRouter = useRouter()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const steps = ['description', 'test cases']
  const [editTitle, setEditTitle] = useState(false)

  const [challengeData, setChallengeData] = useState({
    title: challenge.title,
    description: challenge.description,
    testCases: challenge.testCases,
  })

  const [editableTestID, setEditableTestID] = useState<number | null>(null)

  const handleInputFieldOnChange = (event) => {
    const fieldName = event.target.getAttribute('name')
    const fieldValue = event.target.value

    const newFormData = { ...challengeData }
    newFormData[fieldName] = fieldValue

    setChallengeData(newFormData)
  }

  const handleChange = (event, inputIndex: number, testIndex: number) => {
    const fieldName = event.target.getAttribute('name')
    const fieldValue = event.target.value

    const newFormData = { ...challengeData }
    newFormData.testCases[testIndex].inputs[inputIndex][fieldName] = fieldValue

    setChallengeData(newFormData)
  }

  const addTestInput = () => {
    const newFormData = { ...challengeData }
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

  const handleSubmit = async () => {
    const response = await fetch(`/api/challenges/${challenge.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ challengeData }),
    })
    const data = await response.json()

    if (data.success) {
      router.push(`/challenges/${challenge.id}`)
    }
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
                  className="pr-2 text-left text-lg hover:text-red-500 hover:underline"
                />
                <input
                  onChange={(e) => handleChange(e, j, testID)}
                  type="text"
                  name="inputName"
                  id="inputName"
                  value={challengeData.testCases[testID].inputs[j].inputName}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900">
                <input
                  onChange={(e) => handleChange(e, j, testID)}
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
          <td colSpan={2} />
          <td className="text-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 first:text-gray-900">
            <input
              onChange={(e) => handleChange(e, 0, testID)}
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
          <textarea
            className="w-full leading-relaxed mb-4 border-indigo-500"
            rows={10}
            name="description"
            id="description"
            value={challengeData.description}
            onChange={(e) => handleInputFieldOnChange(e)}
          />
        )
        break
      case 2:
        jsx = (
          <div>
            {challengeData.testCases.map((test, i) => {
              return (
                <Fragment key={i}>
                  <div className="pb-2 text-lg">
                    <h3>
                      {`Test ${i + 1}`}
                      {editableTestID === i ? (
                        <span>
                          <button className="hover:text-blue-500 hover:underline pl-2" onClick={() => saveTest()}>
                            save
                          </button>
                          <button className="hover:text-blue-500 hover:underline pl-2" onClick={() => addTestInput()}>
                            add input
                          </button>
                        </span>
                      ) : (
                        <span onClick={() => setEditableTestID(i)} className="hover:text-blue-500">
                          <FiEdit2 />
                        </span>
                      )}
                    </h3>
                  </div>

                  <table className="table-auto w-full text-left whitespace-no-wrap">
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
                  <hr className="border-1 border-indigo-500 pb-4" />
                </Fragment>
              )
            })}
          </div>
        )
      default:
        break
    }
    return jsx
  }

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className=" mx-auto flex flex-wrap">
          <div className="w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            {editTitle ? (
              <>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={challengeData.title}
                  onChange={(e) => setChallengeData({ ...challengeData, title: e.target.value })}
                />
                <button onClick={() => setEditTitle(false)} className="pl-2 hover:text-blue-500">
                  save
                </button>
              </>
            ) : (
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                {challengeData.title}
                <span onClick={() => setEditTitle(true)} className="hover:text-blue-500">
                  <FiEdit2 />
                </span>
              </h1>
            )}

            <Stepper steps={steps} currentStep={currentStep} />
            {setDisplay(currentStep)}
            <div className="flex">
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep <= 1}
                className="flex mr-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={currentStep < steps.length ? () => setCurrentStep(currentStep + 1) : () => handleSubmit()}
                className="flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep < steps.length ? 'Next' : 'Submit changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // get challenge data from database
  // this function will be called server-side and therefore will not be exposed to client
  const dbClient = await clientPromise
  const challenges = dbClient.db(process.env.MONGODB_DB).collection('challenges')

  const document = await getOne(challenges, context.params.challengeID.toString())
  const challengeData = JSON.parse(JSON.stringify(document))

  if (challengeData.error) {
    return {
      props: {},
    }
  }

  return {
    props: {
      challenge: {
        id: challengeData._id,
        title: challengeData.title,
        description: challengeData.description,
        testCases: challengeData.testCases,
        owner: challengeData.owner,
        verified: challengeData.verified,
        createdAt: challengeData.createdAt,
      },
    },
  }
}

export default EditChallengePage
