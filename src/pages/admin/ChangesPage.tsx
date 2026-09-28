import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ChangeCard } from '../../components/admin/ChangeCard';
import { useCivic } from '../../context/CivicContext';

export const ChangesPage: React.FC = () => {
  const { sourceChanges, approveChange, rejectChange } = useCivic();

  return (
    <AdminLayout
      title="Source Change Detection"
      subtitle="Automated alerts when official government websites update legal requirements or fees."
    >
      <div className="space-y-6 text-left">
        {sourceChanges.map((change) => (
          <ChangeCard
            key={change.id}
            change={change}
            onApprove={approveChange}
            onReject={rejectChange}
          />
        ))}
      </div>
    </AdminLayout>
  );
};
