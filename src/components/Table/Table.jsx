import React, { useState, useMemo } from 'react';
import './Table.css';

const Table = ({ columns, data, onRowClick, actions, loading, emptyMessage }) => {
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	const sortedData = useMemo(() => {
		if (!sortConfig.key) return data;

		const sorted = [...data].sort((a, b) => {
			const aVal = a[sortConfig.key];
			const bVal = b[sortConfig.key];

			// Пытаемся сравнивать числа/даты, если строка — сравниваем как строки
			if (!isNaN(parseFloat(aVal)) && !isNaN(parseFloat(bVal))) {
				return sortConfig.direction === 'asc'
					? parseFloat(aVal) - parseFloat(bVal)
					: parseFloat(bVal) - parseFloat(aVal);
			}

			return sortConfig.direction === 'asc'
				? String(aVal).localeCompare(String(bVal))
				: String(bVal).localeCompare(String(aVal));
		});

		return sorted;
	}, [data, sortConfig]);

	const handleSort = (key) => {
		setSortConfig((prev) => {
			if (prev.key === key) {
				return {
					key,
					direction: prev.direction === 'asc' ? 'desc' : 'asc'
				};
			}
			return { key, direction: 'asc' };
		});
	};

	if (loading) {
		return <div className="table-loading">Загрузка...</div>;
	}

	if (!data || data.length === 0) {
		return <div className="table-empty">{emptyMessage || 'Нет данных для отображения'}</div>;
	}

	const getSortIndicator = (key) => {
		if (sortConfig.key !== key) return '';
		return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
	};

	return (
		<div className="table-wrapper">
			<table className="universal-table">
				<thead>
				<tr>
					{columns.map(col => (
						<th
							key={col.key}
							onClick={() => handleSort(col.key)}
							style={{ cursor: 'pointer', userSelect: 'none' }}
						>
							{col.label}{getSortIndicator(col.key)}
						</th>
					))}
					{actions && <th>Действия</th>}
				</tr>
				</thead>
				<tbody>
				{sortedData.map((row, index) => (
					<tr
						key={index}
						onClick={() => onRowClick?.(row)}
						className={onRowClick ? 'clickable-row' : ''}
					>
						{columns.map(col => (
							<td key={col.key}>
								{col.renderCell ? col.renderCell(row, index) : row[col.key]}
							</td>
						))}
						{actions && <td className="actions-cell">{actions(row)}</td>}
					</tr>
				))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
