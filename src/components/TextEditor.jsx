import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Container, Divider } from 'semantic-ui-react';

const TextEditor = () => {
    // const [editorContent, setEditorContent] = useState('');
    // const [editorState, setEditorState] = useState(EditorState.createEmpty());

    // const handleEditorChange = (content, editor) => {
    //     setEditorContent(content);
    //     console.log(content);
    // };

    // const handleEditorStateChange = (editorState) => {
    //     setEditorState(editorState);
    //     console.log(editorState);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(editorContent);
    // };

    // const handleEditorChange = (content, editor) => {
    //     setEditorContent(content);
    //     console.log(content);
    // };

    // const handleEditorStateChange = (editorState) => {
    //     setEditorState(editorState);
    //     console.log(editorState);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };


    return (
        <Container>

            <Divider />
            <Editor
                apiKey={process.env.REACT_APP_TINYMCE_API}
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            <button onClick={log}>Log editor content</button>
        </Container>
    );
}

export default TextEditor
