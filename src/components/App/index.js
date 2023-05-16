import React, { useState } from 'react';

import Layout from '../Layout';
import Loader from '../Loader';
import Main from '../Main';
import Quiz from '../Quiz';
import Result from '../Result';

import { shuffle } from '../../utils';
import Test from '../../api/test';
import Listing from '../Listing';

import { useGetTestsQuery } from '../../store/store';


// import { ThemeProvider  } from '@aws-amplify/ui-react';


const App = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);

  // get Tests Data from RTK Query
  const {
    data: tests = [],
    isLoading: isTestsLoading,
    isSuccess: isTestsSuccess,
    isError: isTestsError,
    error: testsError
  } = useGetTestsQuery();

  const startQuiz = (data, countdownTime) => {
    setLoading(true);
    setCountdownTime(countdownTime);

    setTimeout(() => {
      setData(data);
      setIsQuizStarted(true);
      setLoading(false);
    }, 1000);
  };

  const endQuiz = resultData => {
    setLoading(true);

    setTimeout(() => {
      setIsQuizStarted(false);
      setIsQuizCompleted(true);
      setResultData(resultData);
      setLoading(false);
    }, 2000);
  };

  const replayQuiz = () => {
    setLoading(true);

    const shuffledData = shuffle(data);
    shuffledData.forEach(element => {
      element.options = shuffle(element.options);
    });

    setData(shuffledData);

    setTimeout(() => {
      setIsQuizStarted(true);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  const resetQuiz = () => {
    setLoading(true);

    setTimeout(() => {
      setData(null);
      setCountdownTime(null);
      setIsQuizStarted(false);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };


  return (
    <>
      {/* <Layout> */}
      {/* Test only, remove */}
      {/* <Test /> */}

      {/* Display Tests Data */}
      {isTestsLoading && <Loader />}
      {isTestsSuccess && <Listing tests={tests} />}

      {loading && <Loader />}
      {!loading && !isQuizStarted && !isQuizCompleted && (
        <Main startQuiz={startQuiz} />
      )}
      {!loading && isQuizStarted && (
        <Quiz data={data} countdownTime={countdownTime} endQuiz={endQuiz} />
      )}
      {!loading && isQuizCompleted && (
        <Result {...resultData} replayQuiz={replayQuiz} resetQuiz={resetQuiz} />
      )}
      {/* <AmplifyAuthenticator usernameAlias="email" /> */}
      {/* </Layout> */}
    </>
  );
};

export default App;
