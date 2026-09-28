import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ReviewPanel } from '../../components/admin/ReviewPanel';
import { useCivic } from '../../context/CivicContext';

export const VerificationPage: React.FC = () => {
  const { adminReviews, approveReview, rejectReview } = useCivic();

  return (
    <AdminLayout
      title="Pending Verification"
      subtitle="Review and approve AI-extracted procedure requirements prior to publishing."
    >
      <ReviewPanel
        items={adminReviews}
        onApprove={approveReview}
        onReject={rejectReview}
      />
    </AdminLayout>
  );
};
