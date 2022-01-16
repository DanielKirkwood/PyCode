import React, { Dispatch, SetStateAction } from 'react'

type Props = {
  searchValue: string
  setSearchInput: Dispatch<SetStateAction<string>>
  limitValue: number
  setLimit: Dispatch<SetStateAction<number>>
}

function SearchBar({ searchValue, setSearchInput, limitValue, setLimit }: Props): JSX.Element {
  return (
    <div className="my-2 flex sm:flex-row flex-col">
      <div className="block relative">
        <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
            <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
          </svg>
        </span>
        <input
          onChange={(event) => setSearchInput(event.target.value)}
          value={searchValue}
          autoFocus
          name="searchName"
          id="searchName"
          placeholder="Search for a name..."
          className="appearance-none rounded-l sm:rounded-r-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
        />
      </div>
      <div className="relative">
        <select
          onChange={(event) => setLimit(parseInt(event.target.value, 10))}
          value={limitValue}
          className="h-full rounded-r border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          <option value={5}>Show 5 results</option>
          <option value={10}>Show 10 results</option>
          <option value={20}>Show 20 results</option>
          <option value={50}>Show 50 results</option>
        </select>
      </div>
    </div>
  )
}

export default SearchBar
