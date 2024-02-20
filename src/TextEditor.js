import { Editor, EditorState, RichUtils, Modifier, convertFromRaw, convertToRaw } from 'draft-js';
import { useEffect, useState } from 'react';
import "./textEditor.css";




const TextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(()=>{
    const savedContent = localStorage.getItem("editorContent");
    if(savedContent){
      setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent))))
    }
    
  },[])

  const blockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    
    if (type === 'red-line') {
      console.log(type);
      return 'red-line';
    }

    if (type === 'strikeThrough') {
      console.log(type);
      return 'strikeThrough';
    }

    if (type === 'bold') {
      console.log(type);
      return 'bold';
    }
  };
  
    const onChange = (newEditorState) => {
      setEditorState(newEditorState);
    };
  
    const handleBeforeInput = (char) => {
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();
      const currentBlock = content.getBlockForKey(selection.getStartKey());
      const blockText = currentBlock.getText();

   
      if (char === ' ' && blockText.startsWith('#')) {
        const newContent = Modifier.replaceText(
          content,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 2
          }),
          ''
        );
  
        const newEditorState = EditorState.push(editorState, newContent, 'remove-text');
  
        onChange(RichUtils.toggleBlockType(newEditorState, 'header-one'));
        return 'handled';
      }
      else if (char === ' ' && blockText.startsWith('***')) {
        console.log("*");
          const newContent = Modifier.replaceText(
            content,
            selection.merge({
              anchorOffset: 0,
              focusOffset: 3
            }),
            ''
          );
          const newState = EditorState.push(editorState, newContent, 'remove-text');
          onChange(RichUtils.toggleBlockType(newState, 'strikeThrough'));
          return 'handled';
        }
  
     
      else if (char === ' ' && blockText.startsWith('**')) {
        console.log("**");
        const newContent = Modifier.replaceText(
          content,
          selection.merge({
            anchorOffset: 0,
            focusOffset: 3
          }),
          ''
        );
        const newState = EditorState.push(editorState, newContent, 'remove-text');
        onChange(RichUtils.toggleBlockType(newState, 'red-line'));
        return 'handled';
      } 
       else if (char === ' ' && blockText.startsWith('*')) {
        console.log("*");
          const newContent = Modifier.replaceText(
            content,
            selection.merge({
              anchorOffset: 0,
              focusOffset: 2
            }),
            ''
          );
          const newState = EditorState.push(editorState, newContent, 'remove-text');
          onChange(RichUtils.toggleBlockType(newState, 'bold'));
          return 'handled';
        }
  
      return 'not-handled';
    };

    const handleKeyCommand = (command, editorState) => {
      
    };
  
 
    const handleSave = () =>{
      const rawContentState = convertToRaw(editorState.getCurrentContent());
      localStorage.setItem("editorContent", JSON.stringify(rawContentState));
    }


    return (<div className='wrapper'>
      <div style={{display:"flex", marginTop:"50px"}}>
        <div className='title'>Demo Editor by Apurva Shekhar</div>
        <button className='saveBtn' onClick={handleSave}>Save</button>
      </div>
      <Editor
        className="textEditor"
        editorState={editorState}
        onChange={onChange}
        handleBeforeInput={handleBeforeInput}
        blockStyleFn={blockStyleFn}
        handleKeyCommand={handleKeyCommand}
      />
      <p>Please hit the "Enter Key" to go to start the next line and apply a new style.</p>
    </div>
        
    )
}

export default TextEditor;