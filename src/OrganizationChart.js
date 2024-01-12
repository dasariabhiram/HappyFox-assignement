// OrganizationChart.js
import React, { useRef } from 'react';
import Tree from 'react-d3-tree';
import { useDrop } from 'react-dnd';

const OrganizationChart = ({ employees, onDrop }) => {
  const treeContainerRef = useRef(null);

  const buildTreeData = (employees, managerId = null) => {
    const managerEmployees = employees.filter((employee) => employee.manager === managerId);

    return managerEmployees.map((employee) => ({
      name: `${employee.name}\n${employee.designation}`,
      attributes: { team: employee.team },
      children: buildTreeData(employees, employee.id),
    }));
  };

  const treeData = [
    {
      name: 'Top Management',
      attributes: { team: 'A' },
      children: buildTreeData(employees),
    },
  ];

  const [, drop] = useDrop({
    accept: 'EMPLOYEE',
    drop: (item) => {
      const employeeId = item.id;
      const newPosition = calculateDropPosition(treeContainerRef.current, item);
      onDrop(employeeId, newPosition);
    },
  });

  const calculateDropPosition = (container, item) => {
    const containerRect = container.getBoundingClientRect();
    const x = item.x - containerRect.left;
    const y = item.y - containerRect.top;

    // Your logic to determine the new manager based on the drop position
    // For simplicity, let's assume the top half and bottom half represent different managers
    const newManagerId = y < containerRect.height / 2 ? null : 1;

    return { x, y, newManagerId };
  };

  // Custom node styling to prevent overlapping
  const nodeSize = { x: 200, y: 80 };
  const separation = { siblings: 1.5, nonSiblings: 1.5 };

  return (
    <div ref={(el) => { treeContainerRef.current = el; drop(el); }} className="organization-chart">
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        collapsible={false}
        allowForeignObjects
        nodeSize={nodeSize}
        separation={separation}
        styles={{
          nodes: {
            node: {
              circle: {
                stroke: 'white',
                strokeWidth: '1px',
              },
              name: {
                fontSize: '12px',
                textAnchor: 'middle',
                dominantBaseline: 'hanging',
                whiteSpace: 'pre-line', // Allow line breaks
              },
            },
          },
        }}
      />
    </div>
  );
};

export default OrganizationChart;
