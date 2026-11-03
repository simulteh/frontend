import React from 'react';
import { STATUS_FILTERS } from './adminUtils';

// Переключатель фильтра по статусу заявок
const StatusFilter = ({ value, onChange }) => (
  <div className="ad-segmented" role="group" aria-label="Фильтр по статусу">
    {STATUS_FILTERS.map((f) => (
      <button
        key={f.value || 'all'}
        type="button"
        className={value === f.value ? 'is-active' : ''}
        onClick={() => onChange(f.value)}
      >
        {f.label}
      </button>
    ))}
  </div>
);

export default StatusFilter;
