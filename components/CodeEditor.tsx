import React, { useState } from 'react'
import { Button, Divider, Typography } from 'antd'
import { PlayCircleFilled } from '@ant-design/icons'
import dynamic from 'next/dynamic'
import styles from '../styles/CodeEditor.module.css'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

const CodeMirror = dynamic(
  () => {
    import('codemirror/mode/python/python')
    return import('react-codemirror')
  },
  { ssr: false }
)

export const CodeEditor = () => {
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')

  const options = { lineNumbers: true, mode: 'python', theme: 'material', lineWrapping: true }

  const onCodeChange = (code: string) => setCode(code)

  const executeCode = async (code: string) => {
    const response = await fetch('/api/executeCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
    })
    const data = await response.json()
    console.log(data)

    if (data.error) {
      setOutput(data.error)
      console.log('error')
    } else {
      setOutput(data.output)
      console.log('success')
    }
  }

  return (
    CodeMirror && (
      <>
        <CodeMirror onChange={onCodeChange} options={options} value={code} className={styles.editor} />
        <Button
          onClick={(e) => {
            e.stopPropagation()
            executeCode(code)
          }}
          shape="round"
          icon={<PlayCircleFilled />}
        >
          Run Code
        </Button>
        <Divider />
        <Typography.Text>{output}</Typography.Text>
      </>
    )
  )
}

export default CodeEditor
