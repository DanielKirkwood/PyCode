import type { NextPage } from 'next'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'
import { Fragment } from 'react'
import { NextRouter, useRouter } from 'next/router'

const Create: NextPage = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [testCases, setTestCases] = useState([])
  const [inputName, setInputName] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const titleInput = useRef(null)

  const { data: session, status } = useSession()
  const router: NextRouter = useRouter()

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title || !description || !testCases) {
      setError('Please fill out all the fields')
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

  const handleAddTest = () => {
    const testCase = {
      inputName,
      inputValue,
      output,
    }
    setTestCases([...testCases, testCase])
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
            <h3 className="text-2xl font-bold text-center">Create challenge</h3>
            <form onSubmit={onFormSubmit}>
              <div className="mt-4 w-full">
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
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-center">Test Cases</h2>
                  <div className="grid grid-cols-12">
                    <p className="col-span-4 py-2">input name</p>
                    <p className="col-span-4 py-2">input value</p>
                    <p className="col-span-4 py-2">output value</p>
                    {testCases.map((test, i) => {
                      return (
                        <Fragment key={i}>
                          <p className="col-span-4 py2">{test.inputName}</p>
                          <p className="col-span-4 py2">{test.inputValue}</p>
                          <p className="col-span-4 py2">{test.output}</p>
                        </Fragment>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-12 gap-4">
                    <input
                      id="inputName"
                      type="text"
                      placeholder="x"
                      onChange={(e) => setInputName(e.target.value)}
                      value={inputName}
                      className="col-span-3 sm:col-span-2 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <input
                      id="inputValue"
                      type="text"
                      placeholder="5"
                      onChange={(e) => setInputValue(e.target.value)}
                      value={inputValue}
                      className="col-span-4 sm:col-span-5 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <input
                      id="output"
                      type="text"
                      placeholder="50"
                      onChange={(e) => setOutput(e.target.value)}
                      value={output}
                      className="col-span-4 sm:col-span-5 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
                {error && <span className="text-xs tracking-wide text-red-600">{error}</span>}
                <div className="flex flex-col items-center sm:flex-row sm:items-baseline justify-between">
                  <button
                    onClick={handleAddTest}
                    type="button"
                    className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                  >
                    Add test case
                  </button>
                </div>
                <hr className="w-full mt-3" />
                <div className="flex flex-col items-center sm:flex-row sm:items-baseline justify-between">
                  <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                    Upload challenge
                  </button>
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
