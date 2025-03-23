import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Grid,
  Badge,
  Tabs,
  Tab,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';

const TodoList = ({ tasks, onTaskUpdate }) => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Get counts for summary
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const backendTasks = tasks.filter(task => task.category === 'backend').length;
  const frontendTasks = tasks.filter(task => task.category === 'frontend').length;
  const testingTasks = tasks.filter(task => task.category === 'testing').length;

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Category filter
    if (filter !== 'all' && task.category !== filter) return false;
    
    // Tab filter (0 = all, 1 = todo, 2 = completed)
    if (tabValue === 1 && task.completed) return false;
    if (tabValue === 2 && !task.completed) return false;

    // Search filter
    if (searchQuery && 
        !task.heading.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Handle task toggling
  const handleToggleTask = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    onTaskUpdate(updatedTasks);
  };

  // Get category color and icon
  const getCategoryInfo = (category) => {
    switch(category) {
      case 'backend':
        return { 
          color: '#5E35B1', 
          icon: <CodeIcon style={{ color: '#5E35B1' }} />,
          bgcolor: '#EDE7F6'
        };
      case 'frontend':
        return { 
          color: '#00897B', 
          icon: <AssignmentIcon style={{ color: '#00897B' }} />,
          bgcolor: '#E0F2F1' 
        };
      case 'testing':
        return { 
          color: '#D81B60', 
          icon: <BugReportIcon style={{ color: '#D81B60' }} />,
          bgcolor: '#FCE4EC' 
        };
      default:
        return { 
          color: 'primary', 
          icon: <AssignmentIcon />,
          bgcolor: '#E3F2FD' 
        };
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              bgcolor: '#F5F5F5', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Typography variant="h6" color="primary" fontWeight="bold">
              {totalTasks}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Total Tasks
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              bgcolor: '#E8F5E9', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {completedTasks}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              bgcolor: '#EDE7F6', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Typography variant="h6" color="#5E35B1" fontWeight="bold">
              {backendTasks}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Backend
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              bgcolor: '#E0F2F1', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Typography variant="h6" color="#00897B" fontWeight="bold">
              {frontendTasks}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Frontend
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              bgcolor: '#FCE4EC', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Typography variant="h6" color="#D81B60" fontWeight="bold">
              {testingTasks}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Testing
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters and search */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Filter by Category</InputLabel>
            <Select
              value={filter}
              label="Filter by Category"
              onChange={(e) => setFilter(e.target.value)}
              startAdornment={<FilterListIcon color="action" sx={{ mr: 1 }} />}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="backend">Backend</MenuItem>
              <MenuItem value="frontend">Frontend</MenuItem>
              <MenuItem value="testing">Testing</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs 
        value={tabValue} 
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>All</Typography>
              <Badge badgeContent={totalTasks} color="primary" sx={{ ml: 2.3 }} />
            </Box>
          } 
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>To Do</Typography>
              <Badge badgeContent={totalTasks - completedTasks} color="error" sx={{ ml: 2.3 }} />
            </Box>
          }
        />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography>Completed</Typography>
              <Badge badgeContent={completedTasks} color="success" sx={{ ml: 2.3 }} />
            </Box>
          }
        />
      </Tabs>

      {/* Tasks list */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {filteredTasks.length > 0 ? (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {filteredTasks.map((task, index) => {
              const categoryInfo = getCategoryInfo(task.category);
              
              return (
                <React.Fragment key={task.id}>
                  {index > 0 && <Divider />}
                  <ListItem 
                    sx={{ 
                      py: 2,
                      bgcolor: task.completed ? '#F9FBE7' : 'inherit',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                        checkedIcon={<CheckCircleIcon color="success" />}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 'medium',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: task.completed ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {task.heading}
                        </Typography>
                      }
                      secondary={
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            mt: 0.5,
                            textDecoration: task.completed ? 'line-through' : 'none'
                          }}
                        >
                          {task.description}
                        </Typography>
                      }
                    />
                    <Chip
                      label={task.category}
                      size="small"
                      icon={categoryInfo.icon}
                      sx={{ 
                        bgcolor: categoryInfo.bgcolor,
                        color: categoryInfo.color,
                        borderRadius: 1,
                        minWidth: 90,
                        '& .MuiChip-icon': {
                          color: categoryInfo.color
                        }
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="textSecondary">
              No tasks found. Try adjusting your filters.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TodoList;