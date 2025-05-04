import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, CardContent, Grid } from '@mui/material';
import './MarianEngineeringData.css';
const CollegeLeaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'total_karma', direction: 'desc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://mulearn.org/api/v1/leaderboard/college/');
        if (response.data && response.data.response) {
          const sortedData = response.data.response.map((college, index) => ({
            ...college,
            rank: index + 1
          }));
          setData(sortedData);
        }
      } catch (err) {
        setError('Failed to fetch leaderboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    }).map((college, index) => ({
      ...college,
      rank: index + 1
    }));
    setData(sortedData);
  };

  if (loading) return (
    <Container className="flex justify-center items-center h-screen">
      <CircularProgress />
    </Container>
  );

  if (error) return (
    <Container className="mt-8">
      <Alert severity="error">{error}</Alert>
    </Container>
  );

  const mceData = data.find(college => college.code === 'MCE');

  return (
    <Container className="table-container">
      <Typography variant="h3" className="text-center mb-8 font-bold text-gray-900 fade-in">
        College Leaderboard
      </Typography>

      {mceData && (
        <Card className="mce-card fade-in">
          <CardContent>
            <Typography variant="h4" className="font-bold mb-4">
              {mceData.title}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" className="font-medium">
                  Rank: #{mceData.rank}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" className="font-medium">
                  Total Students: {mceData.total_students.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" className="font-medium">
                  Total Karma: {mceData.total_karma.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Typography variant="h5" className="text-center mb-6 font-semibold text-gray-800">
        Other Colleges
      </Typography>
      <TableContainer component={Paper} className="fade-in">
        <Table>
          <TableHead>
            <TableRow className="bg-blue-50">
              <TableCell className="table-header" onClick={() => handleSort('rank')}>
                Rank <span className="sort-icon">{sortConfig.key === 'rank' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
              </TableCell>
              <TableCell className="table-header" onClick={() => handleSort('title')}>
                College Name <span className="sort-icon">{sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
              </TableCell>
              <TableCell className="table-header" onClick={() => handleSort('code')}>
                Code <span className="sort-icon">{sortConfig.key === 'code' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
              </TableCell>
              <TableCell className="table-header" onClick={() => handleSort('total_students')}>
                Total Students <span className="sort-icon">{sortConfig.key === 'total_students' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
              </TableCell>
              <TableCell className="table-header" onClick={() => handleSort('total_karma')}>
                Total Karma <span className="sort-icon">{sortConfig.key === 'total_karma' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((college) => (
              <TableRow
                key={college.code}
                className={`table-row ${college.code === 'MCE' ? 'highlight-row' : ''}`}
              >
                <TableCell>{college.rank}</TableCell>
                <TableCell>{college.title}</TableCell>
                <TableCell>{college.code}</TableCell>
                <TableCell>{college.total_students.toLocaleString()}</TableCell>
                <TableCell>{college.total_karma.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CollegeLeaderboard;