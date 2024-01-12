// EmployeeList.js
import React, { useState } from 'react';
import './EmployeeList.css';

const EmployeeList = ({ employees, onSelect, onTeamFilter }) => {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(search.toLowerCase()) &&
      (teamFilter === '' || employee.team === teamFilter)
  );

  const handleTeamFilterChange = (e) => {
    const newTeamFilter = e.target.value;
    setTeamFilter(newTeamFilter);
    onTeamFilter(newTeamFilter);
  };

  return (
    <div className="employee-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, designation, team..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={teamFilter} onChange={handleTeamFilterChange}>
          <option value="">All Teams</option>
          {[...new Set(employees.map((employee) => employee.team))].map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredEmployees.map((employee) => (
          <li key={employee.id} onClick={() => onSelect(employee)}>
            {employee.name} - {employee.designation} - {employee.team}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeList;
