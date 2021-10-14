import type { NextPage } from 'next'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'
import { List, PageHeader, Button, Space } from 'antd'
import { CodeOutlined } from '@ant-design/icons'

// TODO: Delete tempDara
const tempData = [
  {
    _id: 1,
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.You can return the answer in any order.',
    input: 'nums = [2,7,11,15], target = 9',
    output: '[0,1]',
    verified: true,
  },
  {
    _id: 2,
    title: 'Palindrome Number',
    description:
      'Given an integer x, return true if x is palindrome integer. An integer is a palindrome when it reads the same backward as forward. For example, 121 is palindrome while 123 is not.',
    input: 'x = 121',
    output: 'true',
    verified: true,
  },
  {
    _id: 3,
    title: 'Valid Parentheses',
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
    input: 's = "()[]{}"',
    output: 'true',
  },
  {
    _id: 4,
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.You can return the answer in any order.',
    input: 'nums = [2,7,11,15], target = 9',
    output: '[0,1]',
  },
  {
    _id: 5,
    title: 'Palindrome Number',
    description:
      'Given an integer x, return true if x is palindrome integer. An integer is a palindrome when it reads the same backward as forward. For example, 121 is palindrome while 123 is not.',
    input: 'x = 121',
    output: 'true',
  },
  {
    _id: 6,
    title: 'Valid Parentheses',
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
    input: 's = "()[]{}"',
    output: 'true',
  },
  {
    _id: 7,
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.You can return the answer in any order.',
    input: 'nums = [2,7,11,15], target = 9',
    output: '[0,1]',
  },
  {
    _id: 8,
    title: 'Palindrome Number',
    description:
      'Given an integer x, return true if x is palindrome integer. An integer is a palindrome when it reads the same backward as forward. For example, 121 is palindrome while 123 is not.',
    input: 'x = 121',
    output: 'true',
  },
  {
    _id: 9,
    title: 'Valid Parentheses',
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
    input: 's = "()[]{}"',
    output: 'true',
  },
]

const Challenges: NextPage = () => {
  const router: NextRouter = useRouter()
  return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => router.push('/')}
        title="Challenges"
        subTitle="Here you can view the list of available challenges"
      />
      <List
        size="large"
        dataSource={tempData}
        renderItem={(item) => (
          <List.Item key={item._id}>
            <Space direction="vertical">
              <List.Item.Meta title={<Link href={`/challenges/${item._id}`}>{item.title}</Link>} />
              {item.description}
              <Button
                type="default"
                size={'middle'}
                icon={<CodeOutlined />}
                shape="round"
                onClick={() => router.push(`/challenges/${item._id}`)}
              >
                Try Challenge
              </Button>
            </Space>
          </List.Item>
        )}
      />
    </>
  )
}

// TODO: add getStaticProps() with revalidation set

// TODO: add getStaticPaths() with fallback: 'blocking' to pre-render the available challenged at build time, the rest will server-side render the other pages on-demand

// ?: https://nextjs.org/docs/basic-features/data-fetching for help with above functions

export default Challenges
