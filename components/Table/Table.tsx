import React, { useState } from 'react'
import useSWR from 'swr'
import Pagination from '../Pagination/Pagination'
import SearchBar from '../SearchBar'
import TableDisplay from './TableDisplay'

type Props = {
  dataSource: string
  dataKey: string
  exclude: string[]
  protectedKeys: string[]
  formDataObject: unknown
}

function Table({ dataSource, dataKey, exclude, protectedKeys, formDataObject }: Props): JSX.Element {
  const [limit, setLimit] = useState<number>(10)
  const [skip, setSkip] = useState<number>(0)
  const [searchInput, setSearchInput] = useState<string>('')

  const fetcher = (url: RequestInfo) => fetch(url).then((res) => res.json())
  const { data, mutate } = useSWR(`${dataSource}&limit=${limit}&skip=${skip}&search=${searchInput}`, fetcher)

  const keys = Object.keys(formDataObject)
  const initialData = {}
  keys.forEach((key) => {
    const value = formDataObject[key]
    switch (value) {
      case 'string':
        initialData[key] = ''
        break
      case 'boolean':
        initialData[key] = false
        break
      case 'number':
        initialData[key] = 1
        break
      default:
        initialData[key] = ''
        break
    }
  })

  const [rowToEditId, setRowToEditId] = useState<string | number | null>(null)
  const [editedFormData, setEditedFormData] = useState(initialData)

  const handleSelectFieldOnChange = (event) => {
    const fieldName = event.target.getAttribute('name')
    const fieldValue = event.target.checked

    const newFormData = { ...editedFormData }
    newFormData[fieldName] = fieldValue

    setEditedFormData(newFormData)
  }

  const handleInputFieldOnChange = (event) => {
    const fieldName = event.target.getAttribute('name')
    const fieldValue = fieldName === 'verified' ? event.target.checked : event.target.value

    const newFormData = { ...editedFormData }
    newFormData[fieldName] = fieldValue

    setEditedFormData(newFormData)
  }

  const handleEditClick = (data) => {
    setRowToEditId(data['_id'])

    const formValues = {}
    keys.forEach((key) => {
      formValues[key] = data[key]
    })

    setEditedFormData(formValues)
  }

  const handleCancelClick = () => {
    setEditedFormData(initialData)
    setRowToEditId(null)
  }

  function onSkipBtnClick(n: number): void {
    setSkip(n)
  }

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const newData = {
      ...data,
    }

    newData.payload[dataKey] = data.payload[dataKey].map((x) => {
      if (x._id === rowToEditId) {
        return { ...x, ...editedFormData }
      }
      return x
    })

    mutate(newData, false)

    await fetch(`${dataSource}/${rowToEditId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedFormData),
    })

    mutate()
    setRowToEditId(null)
  }

  // Created a new array of objects but with the excluded keys removed from each data entry
  let cleanData: unknown[]
  let numDocuments: number, numDocumentsRemaining: number, totalDocuments: number

  if (data) {
    if (data.payload.numDocuments) {
      cleanData = data.payload[dataKey].map((row) => {
        return Object.keys(row)
          .filter((key) => !exclude.includes(key))
          .reduce((obj, key) => {
            obj[key] = row[key]
            return obj
          }, {})
      })
    }
    numDocuments = data.payload.numDocuments
    numDocumentsRemaining = data.payload.numDocumentsRemaining
    totalDocuments = data.payload.totalDocuments
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="w-full mx-auto overflow-auto">
          {data && (
            <>
              <SearchBar
                searchValue={searchInput}
                setSearchInput={setSearchInput}
                limitValue={limit}
                setLimit={setLimit}
              />
              {totalDocuments > 0 && (
                <TableDisplay
                  data={cleanData}
                  editable={true}
                  formDataObject={formDataObject}
                  protectedKeys={protectedKeys}
                  handleCancelClick={handleCancelClick}
                  handleInputFieldOnChange={handleInputFieldOnChange}
                  handleSelectFieldOnChange={handleSelectFieldOnChange}
                  editedFormData={editedFormData}
                  handleEditClick={handleEditClick}
                  rowToEditId={rowToEditId}
                  onFormSubmit={onFormSubmit}
                />
              )}
              <Pagination
                limit={limit}
                skip={skip}
                onSkipBtnClick={onSkipBtnClick}
                numRows={numDocuments}
                numRowsRemaining={numDocumentsRemaining}
                totalRows={totalDocuments}
              />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Table
