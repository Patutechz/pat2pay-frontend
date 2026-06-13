import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  LinearProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddIcon from "@mui/icons-material/Add";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLoanContext } from "../hooks/useLoanContext";
import DashboardLayout from "../layouts/DashboardLayout";
import type { LoanDto } from "../types";

const BASE = "http://localhost:5145";
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const statusColor = (
  s: string,
): "default" | "warning" | "success" | "error" | "info" | "primary" =>
  (
    ({
      Pending: "warning",
      Active: "success",
      Repaid: "primary",
      Rejected: "error",
      Defaulted: "error",
    }) as any
  )[s] ?? "default";

const Loans = () => {
  const { user } = useAuthContext();
  const { loans, dispatch } = useLoanContext();
  const [applyOpen, setApplyOpen] = useState(false);
  const [repayLoan, setRepayLoan] = useState<LoanDto | null>(null);
  const [repayAmount, setRepayAmount] = useState("");
  const [form, setForm] = useState({
    loanType: "Personal",
    principalAmount: "",
    termMonths: "12",
    purpose: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${user?.token ?? ""}` };

  useEffect(() => {
    if (!user) return;
    fetch(`${BASE}/api/loans`, { headers }).then(
      (r) =>
        r.ok &&
        r.json().then((d) => dispatch({ type: "SET_LOANS", payload: d })),
    );
  }, [user]);

  const handleApply = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch(`${BASE}/api/loans/apply`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        principalAmount: parseFloat(form.principalAmount),
        termMonths: parseInt(form.termMonths),
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.message ?? "Application failed");
    } else {
      dispatch({ type: "ADD_LOAN", payload: json });
      setApplyOpen(false);
      setSuccess("Loan application submitted!");
    }
  };

  const handleApprove = async (id: number) => {
    setLoading(true);
    const res = await fetch(`${BASE}/api/loans/${id}/approve`, {
      method: "POST",
      headers,
    });
    const json = await res.json();
    setLoading(false);
    if (res.ok) {
      dispatch({ type: "UPDATE_LOAN", payload: json });
      setSuccess("Loan approved and disbursed!");
    } else setError(json.message ?? "Failed");
  };

  const handleRepay = async () => {
    if (!repayLoan) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`${BASE}/api/loans/${repayLoan.id}/repay`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(repayAmount) }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.message ?? "Repayment failed");
    } else {
      dispatch({ type: "UPDATE_LOAN", payload: json });
      setRepayLoan(null);
      setRepayAmount("");
      setSuccess(`Repaid ${fmt(parseFloat(repayAmount))}`);
    }
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <AccountBalanceIcon sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700}>
            Loans
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ textTransform: "none", fontWeight: 600 }}
          onClick={() => setApplyOpen(true)}
        >
          Apply for Loan
        </Button>
      </Box>

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!loans && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {loans?.length === 0 && (
        <Typography color="text.secondary" variant="body2">
          No loans yet. Apply for your first loan!
        </Typography>
      )}

      <Grid container spacing={2}>
        {loans?.map((loan) => {
          const progress =
            loan.totalRepayable > 0
              ? (loan.amountRepaid / loan.totalRepayable) * 100
              : 0;
          return (
            <Grid key={loan.id} size={{ xs: 12, md: 6 }}>
              <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>
                      {loan.type} Loan
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(loan.createdAt).toLocaleDateString()} ·{" "}
                      {loan.termMonths} months
                    </Typography>
                  </Box>
                  <Chip
                    label={loan.status}
                    color={statusColor(loan.status)}
                    size="small"
                  />
                </Box>
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid size={4}>
                    <Typography variant="caption" color="text.secondary">
                      Principal
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(loan.principalAmount)}
                    </Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="caption" color="text.secondary">
                      Outstanding
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="error.main"
                    >
                      {fmt(loan.outstandingBalance)}
                    </Typography>
                  </Grid>
                  <Grid size={4}>
                    <Typography variant="caption" color="text.secondary">
                      Monthly
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(loan.monthlyPayment)}
                    </Typography>
                  </Grid>
                </Grid>
                <Box sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Repaid
                    </Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {progress.toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  {loan.status === "Pending" && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      sx={{ textTransform: "none" }}
                      disabled={loading}
                      onClick={() => handleApprove(loan.id)}
                    >
                      Approve & Disburse
                    </Button>
                  )}
                  {loan.status === "Active" && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ textTransform: "none" }}
                      onClick={() => {
                        setRepayLoan(loan);
                        setRepayAmount("");
                        setError(null);
                      }}
                    >
                      Make Repayment
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Apply dialog */}
      <Dialog
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Apply for a Loan</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          <FormControl fullWidth size="small">
            <InputLabel>Loan Type</InputLabel>
            <Select
              label="Loan Type"
              value={form.loanType}
              onChange={(e) =>
                setForm((p) => ({ ...p, loanType: e.target.value }))
              }
            >
              {["Personal", "Mortgage", "Auto", "Business"].map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Amount ($)"
            type="number"
            size="small"
            fullWidth
            value={form.principalAmount}
            onChange={(e) =>
              setForm((p) => ({ ...p, principalAmount: e.target.value }))
            }
          />
          <TextField
            label="Term (months)"
            type="number"
            size="small"
            fullWidth
            inputProps={{ min: 1, max: 360 }}
            value={form.termMonths}
            onChange={(e) =>
              setForm((p) => ({ ...p, termMonths: e.target.value }))
            }
          />
          <TextField
            label="Purpose"
            size="small"
            fullWidth
            multiline
            rows={2}
            value={form.purpose}
            onChange={(e) =>
              setForm((p) => ({ ...p, purpose: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setApplyOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            disabled={loading || !form.principalAmount}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : "Apply"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Repay dialog */}
      <Dialog
        open={Boolean(repayLoan)}
        onClose={() => setRepayLoan(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Repay {repayLoan?.type} Loan</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Outstanding: {fmt(repayLoan?.outstandingBalance ?? 0)}
          </Typography>
          <TextField
            label="Repayment Amount ($)"
            type="number"
            size="small"
            fullWidth
            inputProps={{
              min: 0.01,
              max: repayLoan?.outstandingBalance,
              step: "0.01",
            }}
            value={repayAmount}
            onChange={(e) => setRepayAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRepayLoan(null)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRepay}
            variant="contained"
            disabled={loading || !repayAmount}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={18} color="inherit" /> : "Repay"}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Loans;
