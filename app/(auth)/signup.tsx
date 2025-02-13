import * as React from 'react'
import {Text, TextInput, Button, View, StyleSheet, Pressable} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }

    if (pendingVerification) {
        return (
            <View style={styles.container}>
                <Text style={{ marginBottom: 10, fontSize: 25 }}>Vérifier votre email</Text>
                <TextInput
                    style={styles.input}
                    value={code}
                    placeholder="Entrer votre code de verification"
                    onChangeText={(code) => setCode(code)}
                />
                <Pressable mode="contained" onPress={onVerifyPress} style={styles.button} title={"vérifier"}>
                    <Text style={styles.buttonText}>Vérifier</Text>
                </Pressable>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    onChangeText={(email) => setEmailAddress(email)}
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    placeholder="Enter password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
                <Pressable title="Continue" onPress={onSignUpPress} style={styles.button}>
                    <Text style={styles.buttonText}>S'inscrire</Text>
                </Pressable>
            </>
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

    buttonButton: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 25,
        width: '100%',
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
})