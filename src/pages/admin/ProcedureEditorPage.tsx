import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ProcedureEditor } from '../../components/admin/ProcedureEditor';

export const ProcedureEditorPage: React.FC = () => {
  return (
    <AdminLayout
      title="Procedure Editor"
      subtitle="Edit steps, legal prerequisites, and interactive dependency graphs."
    >
      <ProcedureEditor />
    </AdminLayout>
  );
};
