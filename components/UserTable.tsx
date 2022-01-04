import React, { Fragment, useState } from 'react'
import useSWR from 'swr'
import EditableRow from './EditableRow'
import ReadOnlyRow from './ReadOnlyRow'

const UserTable = () => {
  const [editUserById, setEditUserById] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
  })

  const [limit, setLimit] = useState(Number(20))
  const [skip, setSkip] = useState(Number(0))

  const [searchName, setSearchName] = useState('')

  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json())
  const { data, error, mutate } = useSWR(`/api/users?name=${searchName}&limit=${limit}&skip=${skip}`, fetcher)

  console.log('numDocumentsRemaining ->', data?.payload.numDocumentsRemaining)
  console.log('numDocuments ->', data?.payload.numDocuments)

  const handleSearchNameChange = (event) => {
    event.preventDefault()
    const searchNameValue = event.target.value
    setSearchName(searchNameValue)
  }

  const handleLimitChange = (event) => {
    event.preventDefault()
    setLimit(Number(event.target.value))
  }

  const handleEditFormChange = (event) => {
    event.preventDefault()
    const fieldName = event.target.getAttribute('name')
    const fieldValue = event.target.value

    const newFormData = { ...editFormData }
    newFormData[fieldName] = fieldValue

    setEditFormData(newFormData)
  }

  const handleEditClick = (event, user) => {
    event.preventDefault()
    setEditUserById(user._id)

    const formValues = {
      name: user.name,
      email: user.email,
      role: user.role,
    }

    setEditFormData(formValues)
  }

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const editedUser = {
      _id: editUserById,
      name: editFormData.name,
      email: editFormData.email,
      role: editFormData.role,
    }

    mutate(
      {
        ...data,
        payload: {
          users: data.payload.users.map((user) => (user._id === editedUser._id ? { ...user, ...editedUser } : user)),
        },
      },
      false
    )

    await fetch(`/api/users/${editedUser._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: editedUser.name,
        email: editedUser.email,
        role: editedUser.role,
      }),
    })

    mutate()
    setEditUserById(null)
  }

  const handleEditFormCancel = () => {
    setEditUserById(null)
  }

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="my-2 flex sm:flex-row flex-col">
            <div className="block relative">
              <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </span>
              <input
                onChange={handleSearchNameChange}
                name="searchName"
                id="searchName"
                placeholder="Search for a name..."
                className="appearance-none rounded-l sm:rounded-r-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
              />
            </div>
            <div className="relative">
              <select
                onChange={(event) => handleLimitChange(event)}
                value={limit}
                className="h-full rounded-r border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value={5}>Show 5 results</option>
                <option value={10}>Show 10 results</option>
                <option value={20}>Show 20 results</option>
                <option value={50}>Show 50 results</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <form onSubmit={onFormSubmit}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0"
                    >
                      Role
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 ">
                  {error && <h1>There was an error</h1>}
                  {!data && <h1>Loading user data</h1>}
                  {data &&
                    data.payload.users.map((user) => (
                      <Fragment key={user._id}>
                        {editUserById === user._id ? (
                          <EditableRow
                            key={user._id}
                            editFormData={editFormData}
                            handleEditFormChange={handleEditFormChange}
                            handleEditFormCancel={handleEditFormCancel}
                          />
                        ) : (
                          <ReadOnlyRow user={user} key={user._id} handleEditClick={handleEditClick} />
                        )}
                      </Fragment>
                    ))}
                </tbody>
              </table>
            </form>
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
              {data && (
                <>
                  <span className="text-xs xs:text-sm text-gray-900">
                    Showing {Number(skip + 1)} to {Number(skip + data.payload.numDocuments)} of{' '}
                    {Number(data.payload.totalDocuments)} Entries
                  </span>
                  <div className="inline-flex mt-2 xs:mt-0">
                    <button
                      disabled={Number(skip) === 0 ? true : false}
                      onClick={() => setSkip(Number(skip - limit))}
                      type="button"
                      className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>
                    <button
                      disabled={Number(data.payload.numDocumentsRemaining) === 0 ? true : false}
                      onClick={() => setSkip(Number(skip + limit))}
                      type="button"
                      className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTable
