import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from '../aws-exports';
Amplify.configure(awsExports);

const AuthenticatorAmplify = ({ setModal = null }) => {
    return (
        <Authenticator>
            {({ signOut, user }) => {
                // { console.log('user:', user) }
                { user && setModal && setModal(false) }
                return (
                    < main >
                        <h1>Hello {user.attributes.email}</h1>
                        <button onClick={signOut}>Sign out</button>
                    </main>
                )
            }
            }
        </Authenticator >
    );
}

export default AuthenticatorAmplify;