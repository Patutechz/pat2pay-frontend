import { Box, Typography, Chip } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import type { WalletTransactionDto } from "../types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const typeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  Deposit: {
    icon: <ArrowDownwardIcon fontSize="small" />,
    color: "success.main",
    label: "Deposit",
  },
  Withdrawal: {
    icon: <ArrowUpwardIcon fontSize="small" />,
    color: "error.main",
    label: "Withdrawal",
  },
  Transfer: {
    icon: <SwapHorizIcon fontSize="small" />,
    color: "info.main",
    label: "Transfer",
  },
  InvestmentDebit: {
    icon: <TrendingUpIcon fontSize="small" />,
    color: "secondary.main",
    label: "Invested",
  },
  InvestmentReturn: {
    icon: <TrendingUpIcon fontSize="small" />,
    color: "success.main",
    label: "Return",
  },
  LoanDisbursement: {
    icon: <AccountBalanceIcon fontSize="small" />,
    color: "warning.main",
    label: "Loan",
  },
  LoanRepayment: {
    icon: <AccountBalanceIcon fontSize="small" />,
    color: "error.main",
    label: "Repayment",
  },
};

const TransactionRow = ({ tx }: { tx: WalletTransactionDto }) => {
  const cfg = typeConfig[tx.type] ?? {
    icon: <SwapHorizIcon fontSize="small" />,
    color: "text.secondary",
    label: tx.type,
  };
  const isCredit = ["Deposit", "InvestmentReturn", "LoanDisbursement"].includes(
    tx.type,
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          color: cfg.color,
          display: "flex",
          p: 1,
          bgcolor: "action.hover",
          borderRadius: "50%",
        }}
      >
        {cfg.icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {tx.description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(tx.createdAt).toLocaleDateString()} · {tx.reference ?? ""}
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{ color: isCredit ? "success.main" : "error.main" }}
        >
          {isCredit ? "+" : "-"}
          {fmt(tx.amount)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Bal: {fmt(tx.balanceAfter)}
        </Typography>
      </Box>
      <Chip
        label={tx.status}
        size="small"
        variant="outlined"
        sx={{ fontSize: 10, height: 18, display: { xs: "none", sm: "flex" } }}
      />
    </Box>
  );
};

export default TransactionRow;
