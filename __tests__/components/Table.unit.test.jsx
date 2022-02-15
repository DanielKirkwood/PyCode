// /__tests__/Table.unit.test.jsx
/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import Table from '../../components/Table/Table'

jest.mock('swr', () => {
  const originalModule = jest.requireActual('swr')

  return {
    __esModule: true,
    ...originalModule,
    default: jest
      .fn(() => {
        return {
          data: {
            success: true,
            payload: {
              users: [
                {
                  id: '12345678',
                  name: 'John Smith',
                  email: 'johnsmith@email.com',
                },
                {
                  id: '87654321',
                  name: 'Jane Doe',
                  email: 'janedoe@email.com',
                },
                {
                  id: '13579246',
                  name: 'Jack Smith',
                  email: 'jacksmith@email.com',
                },
              ],
              numDocuments: 3,
              totalDocuments: 3,
              numDocumentsRemaining: 0,
            },
          },
        }
      })
      .mockName('useSWR mock'),
  }
})

describe('Table', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetModules()
  })

  const fakeFormDataObject = {
    id: 'string',
    user: 'string',
    email: 'string',
  }

  it('should render a table', () => {
    render(
      <Table
        dataSource="/users"
        dataKey="users"
        exclude={[]}
        protectedKeys={['id', 'name', 'email']}
        formDataObject={fakeFormDataObject}
      />
    )

    expect(screen.getByRole('table')).toBeInTheDocument()

    expect(screen.getByText('John Smith')).toBeInTheDocument()

    // 3 for number of users + 1 for the heading row
    expect(screen.getAllByRole('row')).toHaveLength(4)
  })
})
