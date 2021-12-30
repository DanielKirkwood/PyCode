import React, { useState } from 'react'
import EditableRow from './EditableRow'
import ReadOnlyRow from './ReadOnlyRow'
import useSWR from 'swr'

const UserTable = () => {
  const [editUserById, setEditUserById] = useState(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
  })

  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json())
  const { data, error, mutate } = useSWR('/api/users', fetcher)

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
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <form onSubmit={onFormSubmit}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {error && <h1>There was an error</h1>}
                  {!data && <h1>Loading user data</h1>}
                  {data &&
                    data.payload.users.map((user) => (
                      <>
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
                      </>
                    ))}
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTable
