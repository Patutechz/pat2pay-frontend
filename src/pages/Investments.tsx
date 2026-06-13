import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useAuthContext } from "../hooks/useAuthContext";
import { useInvestmentContext } from "../hooks/useInvestmentContext";
import InvestmentCard from "../components/InvestmentCard";
import DashboardLayout from "../layouts/DashboardLayout";
import type { InvestmentPlanDto } from "../types";

const BASE = "https://pat2pay.azurewebsites.net/";
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const Investments = () => {
  const { user } = useAuthContext();
  const { investments, dispatch } = useInvestmentContext();
  const [plans, setPlans] = useState<InvestmentPlanDto[] | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlanDto | null>(
    null,
  );
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/investment/plans`)
      .then((r) => r.json())
      .then(setPlans);
    if (!user) return;
    fetch(`${BASE}/api/investment/my-investments`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(
      (r) =>
        r.ok &&
        r.json().then((d) => dispatch({ type: "SET_INVESTMENTS", payload: d })),
    );
  }, [user, dispatch]);

  const handleInvest = async () => {
    if (!user || !selectedPlan) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    const res = await fetch(`${BASE}/api/investment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        planId: selectedPlan.id,
        amount: parseFloat(amount),
      }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(
        typeof json === "string" ? json : (json.message ?? "Investment failed"),
      );
    } else {
      dispatch({ type: "ADD_INVESTMENT", payload: json });
      setSuccess(`Invested ${fmt(json.amountInvested)} in ${json.planName}`);
      setSelectedPlan(null);
      setAmount("");
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <MonetizationOnIcon sx={{ color: "primary.main", fontSize: 28 }} />
        <Typography variant="h5" fontWeight={700}>
          Investments
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Plans */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        Available Plans
      </Typography>
      {!plans && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {plans
          ?.filter((p) => p.isActive)
          .map((plan) => (
            <Grid key={plan.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    {plan.name}
                  </Typography>
                  <Chip
                    label={`${plan.returnRate}% return`}
                    color="success"
                    size="small"
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, flex: 1 }}
                >
                  {plan.description}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Min
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(plan.minimumAmount)}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {plan.durationDays} days
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">
                      Max
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {fmt(plan.maximumAmount)}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  sx={{ textTransform: "none", fontWeight: 600 }}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setAmount("");
                    setError(null);
                  }}
                >
                  <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> Invest
                  Now
                </Button>
              </Paper>
            </Grid>
          ))}
      </Grid>

      {/* My investments */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        My Investments
      </Typography>
      {!investments && <CircularProgress size={24} />}
      {investments?.length === 0 && (
        <Typography color="text.secondary" variant="body2">
          No investments yet.
        </Typography>
      )}
      <Grid container spacing={2}>
        {investments?.map((inv) => (
          <Grid key={inv.id} size={{ xs: 12, md: 6 }}>
            <InvestmentCard investment={inv} />
          </Grid>
        ))}
      </Grid>

      {/* Invest dialog */}
      <Dialog
        open={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Invest in {selectedPlan?.name}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Range: {fmt(selectedPlan?.minimumAmount ?? 0)} –{" "}
            {fmt(selectedPlan?.maximumAmount ?? 0)}
          </Typography>
          <TextField
            label="Amount ($)"
            type="number"
            fullWidth
            size="small"
            inputProps={{
              min: selectedPlan?.minimumAmount,
              max: selectedPlan?.maximumAmount,
              step: "0.01",
            }}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSelectedPlan(null)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInvest}
            variant="contained"
            disabled={loading || !amount}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Confirm"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Investments;
