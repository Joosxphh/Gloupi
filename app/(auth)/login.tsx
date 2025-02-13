import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import {Text, TextInput, Button, View, Pressable, StyleSheet} from 'react-native'
import React from 'react'

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')

    // Handle the submission of the sign-in form
    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, emailAddress, password])

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
            <TextInput
                style={styles.input}
                value={password}
                placeholder="Enter password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
            />

            <Pressable title="Sign in" onPress={onSignInPress} style={styles.button}>
                <Text style={styles.buttonText}>Sign in</Text>
            </Pressable>

            <View>
                <Text style={styles.label}>Don't have an account?</Text>
                <Link href="/signup" style={styles.secondaryButton}>
                    <Text style={styles.secondaryText}>Sign up</Text>
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 24,
    },

    button: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 25,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },

    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginVertical: 10,
    },

    secondaryButton: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderRadius: 25,
    },

    label: {
        width: '100%',
        textAlign: 'center',
    },

    secondaryText: {
        textAlign: 'center',
    },
})