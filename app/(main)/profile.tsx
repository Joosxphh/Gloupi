import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useAuth, useUser} from '@clerk/clerk-expo';

const ProfileScreen = () => {
    const { user } = useUser();
    const { signOut } = useAuth();
    console.log(user);
    return (
        <View style={styles.container}>
            <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
            <Pressable title="Se déconnecter"onPress={() => signOut()} style={styles.button}>
                <Text style={styles.buttonText}>
                    Se déconnecter
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    email: {
        fontSize: 18,
        marginBottom: 20,
    },

    button: {
        padding: 10,
        backgroundColor: 'black',
        borderRadius: 25,
        width: 250,
        alignItems: 'center',
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
    }
});

export default ProfileScreen;