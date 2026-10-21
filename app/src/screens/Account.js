import { View, Text, Button, Alert, TextInput } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../components/AuthContext";
import { logout } from "../utils/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import TextButton from "../components/TextButton";
import { updateUserProfile } from "../utils/backendConn";

const Account = () => {
  const {user, setUser} = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Name and email cannot be empty");
      return;
    }

    setLoading(true);

    const updatedUser = await updateUserProfile(user.token, name, email);

    setLoading(false);

    if (updatedUser) {
      setUser({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
      });
      setIsEditing(false);
    }
  }

  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setIsEditing(false);
  }

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>Account</Text>

        <View style={staticStyles.form}>
          {isEditing ? (
            <View>
              <Text style={staticStyles.label}>Name</Text>
              <TextInput
              style={staticStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              />

              <Text style={staticStyles.label}>Email</Text>
              <TextInput
              style={staticStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              />

              <View style={staticStyles.rowButtons}>
                <TextButton
                style={[staticStyles.halfButton, {backgroundColor: '#888888'}]}
                buttonText='Cancel'
                onPress={handleCancel}
                />
                <TextButton
                style={staticStyles.halfButton}
                buttonText={loading ? 'Saving...' : 'Save'}
                onPress={handleSave}
                />
              </View>
            </View>
          ) : (
            <View style={{alignItems: 'center', paddingTop: 10}}>
              <Text style={[staticStyles.label, {fontSize: 24, fontWeight: 'bold', marginBottom: 6, color: '#554A6B'}]}>
                {user?.name || 'Guest'}
              </Text>
              <Text style={[staticStyles.label, {fontSize: 16, color: 'grey', marginBottom: 30}]}>
                {user?.email || ''}
              </Text>

              {!user?.isGuest && (
                <TextButton
                style={[staticStyles.fullButton, {marginBottom: 15, width: '100%'}]}
                buttonText='Edit profile'
                onPress={() => setIsEditing(true)}
                />
              )}
              <TextButton
              style={[staticStyles.fullButton, {backgroundColor: '#D9534F', width: '100%'}]}
              buttonText='Log out'
              onPress={() => logout(setUser)}
              />
            </View>
          )}
        </View>
      </View>
      <Navigation />
    </SafeAreaView>
  )
}

export default Account;