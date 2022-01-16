import React from 'react'

type Props = {
  limit: number
  skip: number
  numRows: number
  totalRows: number
  numRowsRemaining: number
  onSkipBtnClick: (n: number) => void
}

function Pagination({ limit, skip, numRows, totalRows, numRowsRemaining, onSkipBtnClick }: Props): JSX.Element {
  return (
    <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
      <span className="text-xs xs:text-sm text-gray-900">
        {totalRows > 0
          ? `Showing ${Number(skip + 1)} to ${Number(skip + numRows)} of ${Number(totalRows)} Entries`
          : 'There are 0 entries'}
      </span>
      <div className="inline-flex mt-2 xs:mt-0">
        <button
          disabled={Number(skip) === 0 ? true : false}
          onClick={() => onSkipBtnClick(Number(skip - limit))}
          type="button"
          className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <button
          disabled={Number(numRowsRemaining) <= 0 ? true : false}
          onClick={() => onSkipBtnClick(Number(skip + limit))}
          type="button"
          className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination
