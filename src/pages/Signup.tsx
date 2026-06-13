import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import type { RegisterDto } from "../types";
import MainLayout from "../layouts/MainLayout";

const Signup = () => {
  const [form, setForm] = useState<RegisterDto>({
    firstname: "",
    lastname: "",
    address: "",
    country: "",
    dateOfBirth: "",
    phone: "",
    username: "",
    email: "",
    accountType: "Savings",
    currency: "USD",
    password: "",
  });
  const { signup, isLoading, error } = useSignup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(form);
  };

  const field = (
    name: keyof RegisterDto,
    label: string,
    type = "text",
    half = false,
  ) => (
    <Grid size={{ xs: 12, sm: half ? 6 : 12 }}>
      <TextField
        label={label}
        name={name}
        type={type}
        fullWidth
        size="small"
        value={form[name]}
        onChange={handleChange}
        required
      />
    </Grid>
  );

  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          py: 4,
        }}
      >
        <Paper elevation={0} sx={{ width: "100%", maxWidth: 560, p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <AccountBalanceWalletOutlinedIcon
              sx={{ color: "primary.main", fontSize: 28 }}
            />
            <Typography variant="h5" fontWeight={700}>
              Create Account
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {field("firstname", "First Name", "text", true)}
              {field("lastname", "Last Name", "text", true)}
              {field("username", "Username")}
              {field("email", "Email Address", "email")}
              {field("phone", "Phone Number", "tel")}
              {field("address", "Address")}
              {field("country", "Country")}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  fullWidth
                  size="small"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    label="Account Type"
                    value={form.accountType}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, accountType: e.target.value }))
                    }
                  >
                    <MenuItem value="Savings">Savings</MenuItem>
                    <MenuItem value="Checking">Checking</MenuItem>
                    <MenuItem value="FixedDeposit">Fixed Deposit</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Currency</InputLabel>
                  <Select
                    label="Currency"
                    value={form.currency}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, currency: e.target.value }))
                    }
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                    <MenuItem value="NGN">NGN</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {field("password", "Password", "password")}
              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  sx={{ py: 1.2, textTransform: "none", fontWeight: 600 }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 3, textAlign: "center" }}
          >
            Already have an account?{" "}
            <Box
              component={Link}
              to="/login"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Log in
            </Box>
          </Typography>
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default Signup;
