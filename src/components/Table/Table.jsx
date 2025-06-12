import React from 'react';
import './Table.css';

const Table = ({ columns, data, onRowClick, actions, loading, emptyMessage }) => {
	if (loading) {
		return <div className="table-loading">Загрузка...</div>;
	}

	if (!data || data.length === 0) {
		return <div className="table-empty">{emptyMessage || 'Нет данных для отображения'}</div>;
	}

	return (
		<div className="table-wrapper">
			<table className="universal-table">
				<thead>
				<tr>
					{columns.map(col => (
						<th key={col.key}>{col.label}</th>
					))}
					{actions && <th>Действия</th>}
				</tr>
				</thead>
				<tbody>
				{data.map((row, index) => (
					<tr
						key={index}
						onClick={() => onRowClick?.(row)}
						className={onRowClick ? 'clickable-row' : ''}
					>
						{columns.map(col => (
							<td key={col.key}>{row[col.key]}</td>
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
