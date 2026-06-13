import { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
// import ShowChartIcon from "@mui/icons-material/ShowChart";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useWalletContext } from "../hooks/useWalletContext";
// import { useInvestmentContext } from "../hooks/useInvestmentContext";
import TransactionRow from "../components/TransactionRow";
// import InvestmentCard from "../components/InvestmentCard";
import DashboardLayout from "../layouts/DashboardLayout";

const BASE = "https://pat2pay.azurewebsites.net/";
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const cardGradients: Record<string, string> = {
  Debit: "linear-gradient(135deg, #1d4ed8, #2563eb)"
};

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) => (
  <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, background : cardGradients.Debit, color: "#fff", }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
      <Box sx={{ color : "#fff", display: "flex" }}>{icon}</Box>
      <Typography variant="body2">
        {label}
      </Typography>
    </Box>
    <Typography variant="h6" fontWeight={800}>
      {value}
    </Typography>
    {/* {sub && (
      <Typography variant="caption" color="text.secondary">
        {sub}
      </Typography>
    )} */}
  </Paper>
);

const Home = () => {
  const { user } = useAuthContext();
  const { wallet, dispatch: walletDispatch } = useWalletContext();
  // const { investments, dispatch: investDispatch } = useInvestmentContext();

  useEffect(() => {
    if (!user) return;
    const headers = { Authorization: `Bearer ${user.token}` };
    fetch(`${BASE}/api/wallet`, { headers }).then(
      (r) =>
        r.ok &&
        r
          .json()
          .then((d) => walletDispatch({ type: "SET_WALLET", payload: d })),
    );
  }, [user, walletDispatch]);

  // const activeCount =
  //   investments?.filter((i) => i.status === "Active").length ?? 0;
  // const totalInvested =
  //   investments?.reduce((s, i) => s + i.amountInvested, 0) ?? 0;
  // const expectedTotal =
  //   investments?.reduce((s, i) => s + i.expectedReturn, 0) ?? 0;

  return (
    <DashboardLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={800}>
          Welcome back, {user?.userName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's an overview of your account.
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <StatCard
            icon={<AccountBalanceWalletIcon />}
            label="Wallet Balance"
            value={wallet ? fmt(wallet.balance) : fmt(user?.walletBalance ?? 0)}
            sub="Available to invest"
            color="text.secondary"
          />
        </Grid>
        {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<TrendingUpIcon />}
            label="Active Investments"
            value={String(activeCount)}
            sub="Currently running"
            color="secondary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<ShowChartIcon />}
            label="Total Invested"
            value={fmt(totalInvested)}
            sub="Across all plans"
            color="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<AccountBalanceIcon />}
            label="Expected Returns"
            value={fmt(expectedTotal)}
            sub="On maturity"
            color="info.main"
          />
        </Grid> */}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Paper elevation={1} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={700}>
                Recent Transactions
              </Typography>
              <Button
                component={Link}
                to="/wallet"
                size="small"
                sx={{ color: "primary.main", textTransform: "none" }}
              >
                View all
              </Button>
            </Box>
            <Divider sx={{ mb: 1 }} />
            {!wallet && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            {wallet?.recentTransactions.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No transactions yet.
              </Typography>
            )}
            {wallet?.recentTransactions.slice(0, 5).map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </Paper>
        </Grid>

        {/* <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={1} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={700}>
                Active Investments
              </Typography>
              <Button
                component={Link}
                to="/investments"
                size="small"
                sx={{ color: "primary.main", textTransform: "none" }}
              >
                Invest more
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {!investments && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            {investments?.filter((i) => i.status === "Active").length === 0 && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  No active investments.
                </Typography>
                <Button
                  component={Link}
                  to="/investments"
                  variant="contained"
                  size="small"
                  sx={{ textTransform: "none" }}
                >
                  Browse Plans
                </Button>
              </Box>
            )}
            {investments
              ?.filter((i) => i.status === "Active")
              .slice(0, 3)
              .map((inv) => (
                <Box key={inv.id} sx={{ mb: 2 }}>
                  <InvestmentCard investment={inv} />
                </Box>
              ))}
          </Paper>
        </Grid> */}
      </Grid>
    </DashboardLayout>
  );
};

export default Home;
