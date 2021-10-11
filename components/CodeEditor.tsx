import React, { useState } from 'react'
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

  const options = { lineNumbers: true, mode: 'python', theme: 'material', lineWrapping: true }

  const onCodeChange = (code) => setCode(code)

  return CodeMirror && <CodeMirror onChange={onCodeChange} options={options} value={code} className={styles.editor} />
}

export default CodeEditor
