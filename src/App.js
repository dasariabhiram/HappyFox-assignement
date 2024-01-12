// App.js
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EmployeeList from './EmployeeList';
import OrganizationChart from './OrganizationChart';
import './App.css';
import { createServer } from 'miragejs';

createServer({
  routes() {
    this.get('/api/employees', () => {
      return {
        employees: [
          { id: 1, name: 'John Green', designation: 'Manager', team: 'A', manager: null, type: 'manager' },
          { id: 2, name: 'Joe Linux', designation: 'Developer', team: 'A', manager: 1, type: 'person' },
          { id: 3, name: 'Ron Blomquist', designation: 'Designer', team: 'A', manager: 1, type: 'person' },
          { id: 4, name: 'Mark Hill', designation: 'Manager', team: 'B', manager: null, type: 'manager' },
          { id: 5, name: 'Jane Doe', designation: 'Developer', team: 'B', manager: 4, type: 'person' },
          { id: 6, name: 'Alice Smith', designation: 'Designer', team: 'B', manager: 4, type: 'person' },
          // Add more employees as needed
        ],
      };
    });
  },
});

const App = () => {
  // Load state from localStorage or set default values
  const [employees, setEmployees] = useState(JSON.parse(localStorage.getItem('employees')) || []);
  const [loading, setLoading] = useState(true);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    fetch('/api/employees')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched data:', data);
        setEmployees(data?.employees || []);
        setFilteredEmployees(data?.employees || []);
        localStorage.setItem('employees', JSON.stringify(data?.employees || []));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employees:', error);
        setLoading(false);
      });
  }, []);

  const handleDrop = (employeeId, newPosition) => {
    // Perform API call to update the manager ID based on newPosition.newManagerId
    // Replace the following line with your actual API call
    fetch(`/api/employees/${employeeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ manager: newPosition.newManagerId }),
    })
      .then((response) => response.json())
      .then((updatedEmployee) => {
        const updatedEmployees = employees.map((employee) =>
          employee.id === employeeId ? updatedEmployee : employee
        );
        setEmployees(updatedEmployees);

        // Update the filtered employees as well
        const updatedFilteredEmployees = filteredEmployees.map((employee) =>
          employee.id === employeeId ? updatedEmployee : employee
        );
        setFilteredEmployees(updatedFilteredEmployees);

        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      })
      .catch((error) => {
        console.error('Error updating manager ID:', error);
      });
  };

  const handleTeamFilter = (team) => {
    // Update the filtered employees based on the selected team
    const newFilteredEmployees = employees.filter((employee) => team === '' || employee.team === team);
    setFilteredEmployees(newFilteredEmployees);
    setSelectedTeam(team);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <EmployeeList employees={employees} onTeamFilter={handleTeamFilter} />
            <OrganizationChart employees={filteredEmployees} onDrop={handleDrop} />
          </>
        )}
      </div>
    </DndProvider>
  );
};

export default App;
