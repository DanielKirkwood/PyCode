import Table from '@/components/Table/Table'
import type { NextPage } from 'next'

const Testing: NextPage = () => {
  return (
    <div className="pt-24 w-full">
      <Table
        dataSource="/api/users"
        dataKey="users"
        exclude={['password', 'nameSearch', 'image', 'emailVerified']}
        protectedKeys={['_id']}
        formDataObject={{
          name: 'string',
          email: 'string',
          role: 'string',
        }}
      />
      <Table
        dataSource="/api/challenges"
        dataKey="challenges"
        exclude={['testCases', 'verifiedBy', 'createdAt']}
        protectedKeys={['_id', 'owner']}
        formDataObject={{
          title: 'string',
          description: 'string',
          verified: 'boolean',
        }}
      />
    </div>
  )
}

export default Testing
