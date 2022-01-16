import React from 'react'
import TableEditableRow from './TableEditableRow'
import TableRow from './TableRow'

type Props = {
  data: unknown[]
  formDataObject: unknown
  editable: boolean
  protectedKeys: string[]
  handleCancelClick: () => void
  handleInputFieldOnChange: (event) => void
  handleSelectFieldOnChange: (event) => void
  editedFormData: Record<string, unknown>
  handleEditClick: (data) => void
  rowToEditId: unknown
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

function TableDisplay({
  data,
  editable,
  protectedKeys,
  handleCancelClick,
  handleEditClick,
  handleInputFieldOnChange,
  handleSelectFieldOnChange,
  editedFormData,
  rowToEditId,
  onFormSubmit,
}: Props): JSX.Element {
  return (
    <form onSubmit={onFormSubmit}>
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr>
            {Object.keys(data[0]).map((heading, index) => {
              return (
                <th
                  key={index}
                  className="px-6 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl"
                >
                  {heading}
                </th>
              )
            })}

            {editable && (
              <th scope="col" className="relative px-6 py-3 bg-gray-100 rounded-tl rounded-bl">
                <span className="sr-only">Edit</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => {
            return rowToEditId === row['_id'] ? (
              <TableEditableRow
                key={index}
                data={row}
                handleCancelClick={handleCancelClick}
                handleInputFieldOnChange={handleInputFieldOnChange}
                handleSelectFieldOnChange={handleSelectFieldOnChange}
                editedFormData={editedFormData}
                protectedKeys={protectedKeys}
              />
            ) : (
              <TableRow key={index} data={row} editable={editable} handleEditClick={handleEditClick} />
            )
          })}
        </tbody>
      </table>
    </form>
  )
}

export default TableDisplay
