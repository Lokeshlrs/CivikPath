import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { SourceTable } from '../../components/admin/SourceTable';
import { useCivic } from '../../context/CivicContext';

export const SourcesPage: React.FC = () => {
  const { sources, toggleSourceStatus } = useCivic();

  return (
    <AdminLayout
      title="Government Source Registry"
      subtitle="Manage verified official government domains and source extraction URLs."
    >
      <div className="space-y-6">
        <SourceTable
          sources={sources}
          onToggleStatus={toggleSourceStatus}
        />
      </div>
    </AdminLayout>
  );
};
