import { useContext, useState } from "react";
import { AuthContext } from "../context/Authcontext";
import toast from "react-hot-toast";
import { updateProfile, resetPassword } from "../services/auth";
import {
  ProfileContainer,
  ProfileHeader,
  AvatarCircle,
  ProfileCard,
  InfoGroup,
  ProfileInput,
  ActionButton,
  ButtonGroup,
} from "../styles/Profile";

export default function Profile() {
  const auth = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(auth?.user?.name || "");
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleSave = async () => {
    try {
      const res = await updateProfile({ name: name.trim() });

      // Fix: access .data before .user
      if (auth?.updateUser) {
        auth.updateUser(res.data.user);
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password too short!");
      return;
    }
    try {
      await resetPassword({ newPassword });
      toast.success("Password updated!");
      setNewPassword("");
      setIsResetting(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password");
    }
  };

  const initials = auth?.user?.name
    ? auth.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarCircle>{initials}</AvatarCircle>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Account Settings</h1>
          <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>
            {isEditing
              ? "Update your personal details"
              : "Your account information"}
          </p>
        </div>
      </ProfileHeader>

      <ProfileCard>
        <InfoGroup>
          <label>Full Name</label>
          {isEditing ? (
            <ProfileInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          ) : (
            <p>{auth?.user?.name}</p>
          )}
        </InfoGroup>

        <InfoGroup>
          <label>Email Address</label>
          <p style={{ opacity: 0.7 }}>
            {auth?.user?.email} (Email cannot be changed)
          </p>
        </InfoGroup>

        <ButtonGroup>
          {isEditing ? (
            <>
              <ActionButton onClick={handleSave}>Save Changes</ActionButton>
              <ActionButton
                $variant="secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </ActionButton>
            </>
          ) : (
            <ActionButton onClick={() => setIsEditing(true)}>
              Edit Profile
            </ActionButton>
          )}
        </ButtonGroup>
      </ProfileCard>
      <h2 style={{ marginTop: "32px", fontSize: "18px", color: "#6b7280" }}>
        Security
      </h2>
      <ProfileCard>
        <InfoGroup>
          <label>Password</label>
          {isResetting ? (
            <ProfileInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          ) : (
            <p>••••••••••••</p>
          )}
        </InfoGroup>

        <ButtonGroup>
          {isResetting ? (
            <>
              <ActionButton onClick={handleResetPassword}>
                Update Password
              </ActionButton>
              <ActionButton
                $variant="secondary"
                onClick={() => setIsResetting(false)}
              >
                Cancel
              </ActionButton>
            </>
          ) : (
            <ActionButton
              $variant="secondary"
              onClick={() => setIsResetting(true)}
            >
              Change Password
            </ActionButton>
          )}
        </ButtonGroup>
      </ProfileCard>
    </ProfileContainer>
  );
}
