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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCardContext } from "../hooks/useCardContext";
import DashboardLayout from "../layouts/DashboardLayout";

const BASE = "https://pat2pay.azurewebsites.net/";
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const cardGradients: Record<string, string> = {
  Debit: "linear-gradient(135deg, #1d4ed8, #2563eb)",
  Credit: "linear-gradient(135deg, #ff4081, #e91e63)",
  Prepaid: "linear-gradient(135deg, #0ba876, #00c853)",
};

const Cards = () => {
  const { user } = useAuthContext();
  const { cards, dispatch } = useCardContext();
  const [requestOpen, setRequestOpen] = useState(false);
  const [cardType, setCardType] = useState("Debit");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${user?.token ?? ""}` };

  useEffect(() => {
    if (!user) return;
    fetch(`${BASE}/api/cards`, { headers }).then(
      (r) =>
        r.ok &&
        r.json().then((d) => dispatch({ type: "SET_CARDS", payload: d })),
    );
  }, [user]);

  const handleRequest = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch(`${BASE}/api/cards`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ cardType }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) setError(json.message ?? "Request failed");
    else {
      dispatch({ type: "ADD_CARD", payload: json });
      setRequestOpen(false);
      setSuccess("Card requested successfully!");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
    const res = await fetch(`${BASE}/api/cards/${id}/status`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const json = await res.json();
    if (res.ok) {
      dispatch({ type: "UPDATE_CARD", payload: json });
      setSuccess(`Card ${newStatus.toLowerCase()}.`);
    } else setError(json.message ?? "Failed to update status");
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
          <CreditCardIcon sx={{ color: "primary.main", fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700}>
            My Cards
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ textTransform: "none", fontWeight: 600 }}
          onClick={() => setRequestOpen(true)}
        >
          Request Card
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

      {!cards && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {cards?.length === 0 && (
        <Typography color="text.secondary" variant="body2">
          No cards yet. Request your first card!
        </Typography>
      )}

      <Grid container spacing={3}>
        {cards?.map((card) => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                background: cardGradients[card.type] ?? cardGradients.Debit,
                color: "#fff",
                position: "relative",
                overflow: "hidden",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: -20,
                  top: -20,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.1)",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  {card.type} Card
                </Typography>
                <Chip
                  label={card.status}
                  size="small"
                  sx={{
                    bgcolor:
                      card.status === "Active"
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(0,0,0,0.3)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 10,
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                letterSpacing={2}
                sx={{ mb: 2 }}
              >
                {card.maskedNumber}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.75 }}>
                    Card Holder
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {card.cardHolderName}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" sx={{ opacity: 0.75 }}>
                    Expires
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {card.expiryDate}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Spending Limit
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {fmt(card.spendingLimit)}
                  </Typography>
                </Box>
                {card.status !== "Expired" && (
                  <Button
                    size="small"
                    variant="outlined"
                    color={card.status === "Active" ? "error" : "success"}
                    startIcon={
                      card.status === "Active" ? <LockIcon /> : <LockOpenIcon />
                    }
                    sx={{ textTransform: "none" }}
                    onClick={() => handleToggleStatus(card.id, card.status)}
                  >
                    {card.status === "Active" ? "Block" : "Unblock"}
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Request a New Card</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <FormControl fullWidth size="small">
            <InputLabel>Card Type</InputLabel>
            <Select
              label="Card Type"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
            >
              <MenuItem value="Debit">Debit</MenuItem>
              <MenuItem value="Credit">Credit</MenuItem>
              <MenuItem value="Prepaid">Prepaid</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRequestOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRequest}
            variant="contained"
            disabled={loading}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Request"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default Cards;
