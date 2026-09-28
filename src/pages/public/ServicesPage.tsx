import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { ServiceCatalog } from '../../components/civic/ServiceCatalog';

export const ServicesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ServiceCatalog />
      </div>
    </MainLayout>
  );
};
