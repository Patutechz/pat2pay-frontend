import { Box, Typography, Chip, LinearProgress } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import type { InvestmentDto } from "../types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const InvestmentCard = ({ investment: inv }: { investment: InvestmentDto }) => {
  const totalDays = Math.round(
    (new Date(inv.maturityDate).getTime() - new Date(inv.createdAt).getTime()) /
      86400000,
  );
  const progress =
    totalDays > 0
      ? Math.max(
          0,
          Math.min(100, ((totalDays - inv.daysRemaining) / totalDays) * 100),
        )
      : 100;
  const statusColor =
    inv.status === "Active"
      ? "success"
      : inv.status === "Matured"
        ? "primary"
        : "default";

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUpIcon fontSize="small" sx={{ color: "primary.main" }} />
          <Typography variant="body2" fontWeight={700}>
            {inv.planName}
          </Typography>
        </Box>
        <Chip label={inv.status} color={statusColor as any} size="small" />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Invested
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {fmt(inv.amountInvested)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary">
            Expected Return
          </Typography>
          <Typography variant="body2" fontWeight={600} color="success.main">
            {fmt(inv.expectedReturn)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" color="text.secondary">
            Rate
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {inv.returnRate}%
          </Typography>
        </Box>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 4, borderRadius: 2, mb: 0.5 }}
      />
      <Typography variant="caption" color="text.secondary">
        {inv.daysRemaining > 0
          ? `${inv.daysRemaining} days remaining`
          : "Matured"}{" "}
        · Matures {new Date(inv.maturityDate).toLocaleDateString()}
      </Typography>
    </Box>
  );
};

export default InvestmentCard;
