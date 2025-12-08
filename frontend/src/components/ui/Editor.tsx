import React, { forwardRef } from 'react';
import styles from './Editor.module.css';

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  // Allow overriding defaults if necessary, but defaults match the requirement
}

const Editor = forwardRef<HTMLDivElement, EditorProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`${styles.editor} ${className || ''}`}
      contentEditable={true}
      aria-label="editor"
      role="textbox"
      spellCheck={false}
      {...props}
    />
  );
});

Editor.displayName = 'Editor';

export default Editor;
