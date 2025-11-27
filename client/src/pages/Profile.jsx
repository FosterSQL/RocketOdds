import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, token, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username, email })
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Failed to update profile");
      } else {
        setMessage("Profile updated successfully!");
        updateUser(data.user);
      }
    } catch (err) {
      setError("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/users/${user._id}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Failed to change password");
      } else {
        setMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Failed to delete account");
      } else {
        alert("Your account has been deleted.");
        logout();
        navigate("/login");
      }
    } catch (err) {
      setError("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-page">
      <h2>Profile Settings</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="profile-sections">
        {/* Update Profile Section */}
        <section className="profile-section">
          <h3>Update Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </section>

        {/* Change Password Section */}
        <section className="profile-section">
          <h3>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>

      {/* Danger Zone - Delete Account */}
      <section className="profile-section danger-zone" style={{ marginTop: 30 }}>
        <h3>Danger Zone</h3>
        <p style={{ marginBottom: 16, color: "var(--muted)" }}>
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          className="delete-button"
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </section>
    </div>
  );
}
