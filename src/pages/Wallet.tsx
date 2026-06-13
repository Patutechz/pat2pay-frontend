import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWalletContext } from "../hooks/useWalletContext";
import TransactionRow from "../components/TransactionRow";
import DashboardLayout from "../layouts/DashboardLayout";
import type { TransferResultDto } from "../types";

const BASE = "https://pat2pay.azurewebsites.net/";
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const Wallet = () => {
  const { user, dispatch: authDispatch } = useAuthContext();
  const { wallet, dispatch } = useWalletContext();

  const [fundAmount, setFundAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [error, setError] = useState<Record<string, string | null>>({});
  const [success, setSuccess] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(false);

  const setMsg = (
    key: string,
    kind: "error" | "success",
    msg: string | null,
  ) => {
    if (kind === "error") setError((p) => ({ ...p, [key]: msg }));
    else setSuccess((p) => ({ ...p, [key]: msg }));
  };

  useEffect(() => {
    if (!user) return;
    fetch(`${BASE}/api/wallet`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((r) => r.json())
      .then((d) => dispatch({ type: "SET_WALLET", payload: d }));
  }, [user, dispatch]);

  const syncBalance = (balance: number) => {
    authDispatch({ type: "UPDATE_BALANCE", payload: balance });
    const stored = JSON.parse(localStorage.getItem("user") ?? "{}");
    localStorage.setItem(
      "user",
      JSON.stringify({ ...stored, walletBalance: balance }),
    );
  };

  const post = async (
    endpoint: string,
    body: object,
    key: string,
    successMsg: string,
    reset: () => void,
  ) => {
    if (!user) return;
    setLoading(true);
    setMsg(key, "error", null);
    setMsg(key, "success", null);
    const res = await fetch(`${BASE}/api/wallet/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setMsg(
        key,
        "error",
        typeof json === "string" ? json : (json.message ?? `${key} failed`),
      );
    } else {
      if (endpoint !== "transfer") {
        dispatch({ type: "SET_WALLET", payload: json });
        syncBalance(json.balance);
        setMsg(key, "success", successMsg);
        reset();
      } else {
        const result = json as TransferResultDto;
        syncBalance(result.newBalance);
        setMsg(
          key,
          "success",
          `Transferred ${fmt(result.amount)} to ${result.toAccount}. Ref: ${result.reference}`,
        );
        reset();
        fetch(`${BASE}/api/wallet`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
          .then((r) => r.json())
          .then((d) => dispatch({ type: "SET_WALLET", payload: d }));
      }
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <AccountBalanceWalletIcon
          sx={{ color: "primary.main", fontSize: 28 }}
        />
        <Typography variant="h5" fontWeight={700}>
          My Wallet
        </Typography>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 3,
          bgcolor: "primary.main",
          color: "#fff",
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5 }}>
          Available Balance
        </Typography>
        <Typography variant="h4" fontWeight={500}>
          {wallet ? fmt(wallet.balance) : fmt(user?.walletBalance ?? 0)}
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Fund */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AddIcon sx={{ color: "success.main" }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Fund Wallet
              </Typography>
            </Box>
            {error.fund && (
              <Alert severity="error" sx={{ mb: 1.5 }}>
                {error.fund}
              </Alert>
            )}
            {success.fund && (
              <Alert severity="success" sx={{ mb: 1.5 }}>
                {success.fund}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Amount ($)"
                type="number"
                size="small"
                inputProps={{ min: 1, step: "0.01" }}
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="success"
                disabled={loading || !fundAmount}
                onClick={() =>
                  post(
                    "fund",
                    { amount: parseFloat(fundAmount) },
                    "fund",
                    `Deposited ${fmt(parseFloat(fundAmount))}`,
                    () => setFundAmount(""),
                  )
                }
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Deposit"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Withdraw */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <RemoveIcon sx={{ color: "error.main" }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Withdraw
              </Typography>
            </Box>
            {error.withdraw && (
              <Alert severity="error" sx={{ mb: 1.5 }}>
                {error.withdraw}
              </Alert>
            )}
            {success.withdraw && (
              <Alert severity="success" sx={{ mb: 1.5 }}>
                {success.withdraw}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Amount ($)"
                type="number"
                size="small"
                inputProps={{ min: 1, step: "0.01" }}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="error"
                disabled={loading || !withdrawAmount}
                onClick={() =>
                  post(
                    "withdraw",
                    { amount: parseFloat(withdrawAmount) },
                    "withdraw",
                    `Withdrew ${fmt(parseFloat(withdrawAmount))}`,
                    () => setWithdrawAmount(""),
                  )
                }
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Withdraw"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Transfer */}
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <SwapHorizIcon sx={{ color: "info.main" }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Transfer
              </Typography>
            </Box>
            {error.transfer && (
              <Alert severity="error" sx={{ mb: 1.5 }}>
                {error.transfer}
              </Alert>
            )}
            {success.transfer && (
              <Alert severity="success" sx={{ mb: 1.5 }}>
                {success.transfer}
              </Alert>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Account Number"
                size="small"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                fullWidth
                inputProps={{ maxLength: 10 }}
              />
              <TextField
                label="Amount ($)"
                type="number"
                size="small"
                inputProps={{ min: 1, step: "0.01" }}
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="info"
                disabled={loading || !toAccount || !transferAmount}
                onClick={() =>
                  post(
                    "transfer",
                    {
                      toAccountNumber: toAccount,
                      amount: parseFloat(transferAmount),
                    },
                    "transfer",
                    "",
                    () => {
                      setToAccount("");
                      setTransferAmount("");
                    },
                  )
                }
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                {loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Transfer"
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Transaction history */}
      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Transaction History
        </Typography>
        <Divider sx={{ mb: 1 }} />
        {!wallet && (
          <Typography color="text.secondary" variant="body2">
            Loading transactions…
          </Typography>
        )}
        {wallet?.recentTransactions.length === 0 && (
          <Typography color="text.secondary" variant="body2">
            No transactions yet.
          </Typography>
        )}
        {wallet?.recentTransactions.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </Paper>
    </DashboardLayout>
  );
};

export default Wallet;
