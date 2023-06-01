import PlaceholderComponent from './PlaceholderComponent'
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Container, Divider, Icon, Segment, Form, Loader, Header } from 'semantic-ui-react';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';
import { Amplify, Auth, Storage } from 'aws-amplify';

// TODO implement

const InstructionsEditor = ({ testId }) => {

  const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();

  const editorRef = useRef(null);

  const handleOnClickSave = () => {

    if (editorRef.current) {
      // console.log(editorRef.current.getContent());
      const body = {
        overview: editorRef.current.getContent(),
        testId,
        scope: 'instructions'
      }

      editTest(body);
    }

  }

  return (
    isTestSuccess
      ? (
        <Container >
          <Editor
            apiKey={process.env.REACT_APP_TINYMCE_API}
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={test?.['config']?.['instructions'] || "<p>Insert instructions content.</p>"}
            init={{
              height: 800,
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
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              // urlconverter_callback: myCustomCoverter,
            }}
          />

          <Segment basic>

            <Button
              color='green'
              // floated='right'
              onClick={handleOnClickSave}
              disabled={editTestIsLoading}
            >
              <>
                {!editTestIsLoading ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
                Save Edits
              </>
            </Button>

            {editTestIsError &&
              <Segment><Header as={'h3'}>{editTestError}</Header></Segment>}


          </Segment>
        </Container >
      )
      : (<PlaceholderComponent />)
  )
}

export default InstructionsEditor
