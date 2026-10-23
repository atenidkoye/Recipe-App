
import { View, Text, Button, Alert, TextInput } from "react-native";
import Navigation from "../components/Navigation";
import staticStyles from "../static/styles";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../components/AuthContext";
import { logout } from "../utils/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import TextButton from "../components/TextButton";
import { updateUserProfile } from "../utils/backendConn";

// Account screen allows users to view their account details,
// edit their profile information, and log out.
const Account = () => {
  // Access the currently authenticated user and the function
  // used to update the user throughout the application.
  const { user, setUser } = useContext(AuthContext);

  // Controls whether the profile is displayed or edited.
  const [isEditing, setIsEditing] = useState(false);

  // Store the profile form values, using empty strings as fallbacks
  // when the user has no name or email available.
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Tracks whether a profile update is currently in progress.
  const [loading, setLoading] = useState(false);

  // Keep the form values synchronized with the current user.
  // This is useful when the user logs in or their profile changes.
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Validate the profile fields and send the updated information
  // to the backend using the user's authentication token.
  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Name and email cannot be empty");
      return;
    }

    setLoading(true);

    const updatedUser = await updateUserProfile(
      user.token,
      name,
      email
    );

    setLoading(false);

    // Update the application-wide user context if the backend
    // successfully saves the profile changes.
    if (updatedUser) {
      setUser({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email,
      });

      // Return to the profile display after saving.
      setIsEditing(false);
    }
  };

  // Discard unsaved changes and restore the current profile values.
  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={staticStyles.safeArea}>
      <View style={staticStyles.container}>
        <Text style={staticStyles.headerText}>Account</Text>

        <View style={staticStyles.form}>
          {isEditing ? (
            // Profile editing form shown when the user selects
            // the Edit profile button.
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

              {/* Allow the user to discard changes or save them. */}
              <View style={staticStyles.rowButtons}>
                <TextButton
                  style={[
                    staticStyles.halfButton,
                    { backgroundColor: "#888888" },
                  ]}
                  buttonText="Cancel"
                  onPress={handleCancel}
                />

                <TextButton
                  style={staticStyles.halfButton}
                  buttonText={loading ? "Saving..." : "Save"}
                  onPress={handleSave}
                />
              </View>
            </View>
          ) : (
            // Profile display shown when the user is not editing.
            <View
              style={{
                alignItems: "center",
                paddingTop: 10,
              }}
            >
              <Text
                style={[
                  staticStyles.label,
                  {
                    fontSize: 24,
                    fontWeight: "bold",
                    marginBottom: 6,
                    color: "#554A6B",
                  },
                ]}
              >
                {user?.name || "Guest"}
              </Text>

              <Text
                style={[
                  staticStyles.label,
                  {
                    fontSize: 16,
                    color: "grey",
                    marginBottom: 30,
                  },
                ]}
              >
                {user?.email || ""}
              </Text>

              {/* Guest users cannot edit a registered profile. */}
              {!user?.isGuest && (
                <TextButton
                  style={[
                    staticStyles.fullButton,
                    { marginBottom: 15, width: "100%" },
                  ]}
                  buttonText="Edit profile"
                  onPress={() => setIsEditing(true)}
                />
              )}

              {/* Log out or leave the current guest session. */}
              <TextButton
                style={[
                  staticStyles.fullButton,
                  {
                    backgroundColor: "#D9534F",
                    width: "100%",
                  },
                ]}
                buttonText="Log out"
                onPress={() => logout(setUser)}
              />
            </View>
          )}
        </View>
      </View>

      {/* Bottom navigation for moving between application screens. */}
      <Navigation />
    </SafeAreaView>
  );
};

export default Account;
