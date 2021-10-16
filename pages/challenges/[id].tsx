import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { Drawer, Button, Divider, Typography, Collapse, Row, Col } from 'antd'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import CodeEditor from '@/components/CodeEditor'

const { Title, Text } = Typography

const challengeData = {
  _id: 1,
  title: 'Two Sum',
  description:
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.You can return the answer in any order.',
  input: 'nums = [2,7,11,15], target = 9',
  output: '[0,1]',
  hints: [
    "A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it's best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.",
    'So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?',
    'The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?',
  ],
}

function useWindowSize(): { width: number; height: number } {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  function handleResize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)

      handleResize()

      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])
  return windowSize
}

function RenderDetails(title: string, description: string, input: string, output: string, hints?: string[]) {
  if (!hints) {
    return (
      <>
        <Title level={3}>{title}</Title>
        <Divider />
        <Title level={4}>Problem Description</Title>
        <Text>{description}</Text>
        <Divider />
        <Title level={4}>Input</Title>
        <Text>{input}</Text>
        <Divider />
        <Title level={4}>Output</Title>
        <Text>{output}</Text>
      </>
    )
  }
  return (
    <>
      <Title level={3}>{title}</Title>
      <Divider />
      <Title level={4}>Problem Description</Title>
      <Text>{description}</Text>
      <Divider />
      <Title level={4}>Input</Title>
      <Text>{input}</Text>
      <Divider />
      <Title level={4}>Output</Title>
      <Text>{output}</Text>
      <Divider />
      <Collapse>
        {hints.map((hint, i) => {
          return (
            <Collapse.Panel header={`Hint ${i + 1}`} key={i + 1}>
              <Text>{hint}</Text>
            </Collapse.Panel>
          )
        })}
      </Collapse>
    </>
  )
}

const ChallengePage: NextPage = () => {
  const [visible, setVisible] = useState(false)
  const size = useWindowSize()

  const { title, description, input, output, hints } = challengeData
  return (
    <>
      <Row>
        <Col span={size.width > 480 ? 10 : 2}>
          {size.width > 480 && RenderDetails(title, description, input, output, hints)}
          {size.width <= 480 && <Button icon={<MenuUnfoldOutlined />} onClick={() => setVisible(true)} />}
        </Col>
        <Col span={size.width > 480 ? 14 : 22}>
          <CodeEditor />
        </Col>
      </Row>
      <>
        <Drawer
          width={'75vw'}
          title={<Title level={3}>{challengeData.title}</Title>}
          placement="left"
          onClose={() => setVisible(false)}
          visible={visible}
          key={challengeData._id}
        >
          {RenderDetails(title, description, input, output, hints)}
        </Drawer>
      </>
    </>
  )
}

export default ChallengePage
