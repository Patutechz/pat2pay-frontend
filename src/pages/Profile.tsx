import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useAuthContext } from "../hooks/useAuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfilePic from "../assets/img/avatar.png";
import type { UserProfileDto } from "../types";

const BASE = "https://pat2pay.azurewebsites.net/";
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const FieldRow = ({ label, value }: { label: string; value: string }) => (
  <Box
    sx={{
      display: "flex",
      py: 1.5,
      borderBottom: "1px solid",
      borderColor: "divider",
    }}
  >
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ width: 160, flexShrink: 0 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={500}>
      {value}
    </Typography>
  </Box>
);

const Profile = () => {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`${BASE}/api/user/profile`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.ok && r.json().then(setProfile))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <PersonIcon sx={{ color: "primary.main", fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>
          My Profile
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {profile && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={1}
              sx={{ p: 4, borderRadius: 3, textAlign: "center" }}
            >
              <Avatar
                src={ProfilePic}
                sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
              />
              <Typography variant="h6" fontWeight={700}>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                @{profile.userName}
              </Typography>
              <Chip
                label={profile.type}
                color="primary"
                size="small"
                sx={{ mb: 2 }}
              />
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <AccountBalanceWalletIcon
                  sx={{ color: "success.main", fontSize: 20 }}
                />
                <Typography variant="h6" fontWeight={800} color="success.main">
                  {fmt(profile.walletBalance)}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Wallet Balance
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ bgcolor: "action.hover", borderRadius: 2, p: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Account Number
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  fontFamily="monospace"
                  letterSpacing={1.5}
                >
                  {profile.accountNumber}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={1} sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Personal Information
              </Typography>
              <FieldRow
                label="Full Name"
                value={`${profile.firstName} ${profile.lastName}`}
              />
              <FieldRow label="Email" value={profile.email} />
              <FieldRow label="Phone" value={profile.phoneNumber ?? "—"} />
              <FieldRow label="Username" value={`@${profile.userName}`} />
              <FieldRow
                label="Date of Birth"
                value={new Date(profile.dateOfBirth).toLocaleDateString()}
              />
              <FieldRow label="Address" value={profile.address} />
              <FieldRow label="Country" value={profile.country} />
              <FieldRow label="Account Type" value={profile.type} />
              <FieldRow
                label="Member Since"
                value={new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </Paper>
          </Grid>
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default Profile;
