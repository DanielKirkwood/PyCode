import Table from '@/components/Table'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Fragment, useState } from 'react'
import useSWR from 'swr'

const Admin: NextPage = () => {
  // get session to determine if user already signed in
  const { data: session, status } = useSession()

  const [userToEdit, setUserToEdit] = useState(null)
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

  const handleSearchNameChange = (event) => {
    const searchNameValue = event.target.value
    setSearchName(searchNameValue)
  }

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value))
  }

  const handleEditClick = (event, user) => {
    setUserToEdit(user._id)

    const formValues = {
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
    }
    setEditFormData(formValues)
  }

  const handleEditOnChange = (event) => {
    const fieldName = event.target.getAttribute('name')
    const fieldValue = fieldName === 'verified' ? event.target.checked : event.target.value

    const newFormData = { ...editFormData }
    newFormData[fieldName] = fieldValue

    setEditFormData(newFormData)
  }

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const editedUser = {
      _id: userToEdit,
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
    setUserToEdit(null)
  }

  const handleCancelClick = () => {
    setEditFormData({
      name: '',
      email: '',
      role: '',
    })
    setUserToEdit(null)
  }

  return (
    <div className="pt-24 w-full">
      {status === 'unauthenticated' && (
        <div className="text-center">
          <p className="py-2 mb-4 text-center text-md tracking-wide text-red-600">
            You must be logged in to view the admin page
          </p>
          <Link href="/login">
            <a className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</a>
          </Link>
        </div>
      )}
      {status === 'authenticated' && session?.user.role !== 'super-admin' && (
        <div className="text-center">
          <p className="py-2 mb-4 text-center text-md tracking-wide text-red-600">
            Only users with the role of &quot;super-admin&quot; can view this page
          </p>
          <Link href="/challenges">
            <a className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Go to challenges page</a>
          </Link>
        </div>
      )}
      {status === 'authenticated' && session?.user.role === 'super-admin' && (
        <div>
          <h1>Admin Dashboard</h1>
          {error && <h1>There was an error</h1>}
          {!data && <h1>Loading user data</h1>}
          <div className="my-2 flex sm:flex-row flex-col">
            <div className="block relative">
              <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </span>
              <input
                onChange={(event) => handleSearchNameChange(event)}
                value={searchName}
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
            </div>
          </div>
          <Table
            editable
            handleEditSubmit={onFormSubmit}
            handleEditClick={handleEditClick}
            headings={['_id', 'name', 'email', 'role']}
            protectedNames={['_id']}
          >
            {data &&
              data.payload.users.map((user) => (
                <Fragment key={user._id}>
                  {userToEdit === user._id ? (
                    <Table.EditableRow
                      data={user}
                      editFormData={editFormData}
                      handleCancelClick={handleCancelClick}
                      handleEditOnChange={handleEditOnChange}
                    />
                  ) : (
                    <Table.Row data={user} />
                  )}
                </Fragment>
              ))}
            {data && (
              <Table.Pagination
                limit={limit}
                skip={skip}
                setSkip={setSkip}
                numRows={data.payload.numDocuments}
                totalRows={data.payload.totalDocuments}
                numRowsRemaining={data.payload.numDocumentsRemaining}
              />
            )}
          </Table>
        </div>
      )}
    </div>
  )
}

export default Admin
