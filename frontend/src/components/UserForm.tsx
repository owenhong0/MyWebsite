import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Paper
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { createUser, fetchUsers } from '../api/apis';
import type { User, CreateUserInput } from '../api/types';

export function UserForm() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<CreateUserInput>({
    name: '',
    email: '',
    age: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newUser = await createUser(formData);
      setUsers(prev => [newUser, ...prev]);
      setFormData({ name: '', email: '', age: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 5 }}>
        User Management
      </Typography>

      {/* Form Section */}
      <Paper elevation={4} sx={{ p: 4, mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PersonAddIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h5">Add New User</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ md: 4, xs: 12 }}>
              <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            </Grid>
            <Grid size={{ md: 4, xs: 12 }}>
              <TextField
                fullWidth
                type="email"
                label="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{ md: 4, xs: 12 }}>
              <TextField
                fullWidth
                type="number"
                label="Age"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid size={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                sx={{ py: 2 }}
              >
                {loading ? 'Creating User...' : 'Create User'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {/* Users List */}
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Users ({users.length})
        </Typography>

        {users.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No users yet. Create one above!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {users.map(user => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      Age: <strong>{user.age}</strong>
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="caption" color="text.secondary">
                        ID: {user.id}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
