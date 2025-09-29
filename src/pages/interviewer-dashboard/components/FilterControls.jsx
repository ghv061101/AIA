import React from 'react';

import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterControls = ({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange, 
  sortBy, 
  onSortByChange, 
  sortOrder, 
  onSortOrderChange,
  onExport 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Candidates' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' }
  ];

  const sortOptions = [
    { value: 'score', label: 'Final Score' },
    { value: 'date', label: 'Interview Date' },
    { value: 'name', label: 'Candidate Name' },
    { value: 'duration', label: 'Completion Time' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search candidates by name, email, or skills..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-3">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              placeholder="Filter by status"
              className="min-w-[150px]"
            />
            
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={onSortByChange}
              placeholder="Sort by"
              className="min-w-[140px]"
            />
            
            <Button
              variant="outline"
              size="default"
              onClick={onSortOrderChange}
              iconName={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
              iconPosition="left"
              className="px-3"
            >
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export Data
          </Button>
          
          <Button
            variant="default"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;