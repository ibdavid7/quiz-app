import PlaceholderComponent from './PlaceholderComponent'
import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Container, Divider, Icon, Segment, Form, Loader, Header, Image } from 'semantic-ui-react';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';
import { Amplify, Auth, Storage } from 'aws-amplify';
import TEST_TYPE from '../constants/testType';
import { useForm } from 'react-hook-form';
import ImageGalleryModal from './ImageGalleryModal';
import HookFormControlledDropdown from './HookFormControlledDropdown';
import HookFormControlledField from './HookFormControlledField';
import HookFormControlledMultiSelect from './HookFormControlledMultiSelect';
import TAGS from '../constants/tags';
import HookFormControlledImagePicker from './HookFormControlledImagePicker';
import HookFormControlledHtmlEditor from './HookFormControlledHtmlEditor';
import ButtonSave from './ButtonSave';

const InstructionsEditor = ({ testId }) => {

  const { data: test, isLoading: isTestLoading, isFetching: isTestFetching, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();
  const [modalState, setModalState] = useState({ isOpen: false, dispatchProps: {} });

  const { handleSubmit, getValues, control, watch, setValue, formState: { isDirty, errors, isValid } } = useForm({
    values: test?.['config'],
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  })

  const watchImage = watch("instructions_image")

  console.log('values:', getValues())

  // const editorRef = useRef(null);

  const handleOnFormSubmit = ({questions, ...data}) => {

    const body = {
      config: data,
      testId,
      scope: 'config'
    }

    // console.log('body:', body)

    editTest(body);
  }


  return (

    <Container>

      {modalState?.isOpen &&
        <ImageGalleryModal
          testId={testId}
          modalState={modalState}
          setModalState={setModalState}
          setValue={(field, value) => setValue(field, value)}
        />}


      <Form
        onSubmit={handleSubmit(handleOnFormSubmit)}
        loading={isTestFetching}
        widths={'equal'}
      >

        <HookFormControlledDropdown
          name={'category'}
          options={TEST_TYPE}
          label={'Select Test Category'}
          control={control}
        />

        <Form.Field>
          <label>{'Number of Questions (Edit in Questions Tab)'}</label>
          <Form.Input
            value={test?.questions?.length}
            disabled={true}
          />
        </Form.Field>

        <HookFormControlledMultiSelect
          name={'tags'}
          control={control}
          label={'Select Tags (Multi-select allowed)'}
          options={TAGS}
        />

        <HookFormControlledField
          name={'time_limit'}
          control={control}
          label={'Recommended Time Limit (in minutes)'}
          type={'number'}
        />

        <HookFormControlledHtmlEditor
          label={'Test Instructions'}
          name={'instructions'}
          control={control}
        />

        {watchImage &&
          <Image
            wrapped
            ui={false}
            size={'large'} src={watchImage}
          />
        }

        <HookFormControlledImagePicker
          name={'instructions_image'}
          setModalState={setModalState}
          control={control}
        />

        <Divider hidden />

        <ButtonSave
          type={'submit'}
          color={'green'}
          isDisabled={editTestIsLoading || !isDirty}
          isLoading={editTestIsLoading}
          label={'Save Answer Explanation Changes'}
          isError={editTestIsError || !isValid}
          error={{ ...editTestError, ...errors }}
        />



      </Form>

    </Container>


    // isTestSuccess
    //   ? (
    //     <Container >
    //       <Editor
    //         apiKey={process.env.REACT_APP_TINYMCE_API}
    //         onInit={(evt, editor) => editorRef.current = editor}
    //         initialValue={test?.['config']?.['instructions'] || "<p>Insert instructions content.</p>"}
    //         init={{
    //           height: 800,
    //           menubar: true,
    //           plugins: [
    //             'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    //             'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    //             'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    //           ],
    //           toolbar: 'undo redo | blocks | ' +
    //             'bold italic forecolor | alignleft aligncenter ' +
    //             'alignright alignjustify | bullist numlist outdent indent | ' +
    //             'removeformat | help',
    //           content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    //           // urlconverter_callback: myCustomCoverter,
    //         }}
    //       />

    //       <Segment basic>

    //         <Button
    //           color='green'
    //           // floated='right'
    //           onClick={handleOnClickSave}
    //           disabled={editTestIsLoading}
    //         >
    //           <>
    //             {!editTestIsLoading ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
    //             Save Edits
    //           </>
    //         </Button>

    //         {editTestIsError &&
    //           <Segment><Header as={'h3'}>{JSON.stringify(editTestError)}</Header></Segment>}


    //       </Segment>
    //     </Container >
    //   )
    //   : (<PlaceholderComponent />)
  )
}

export default InstructionsEditor
