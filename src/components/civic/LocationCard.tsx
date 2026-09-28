import React, { useState } from 'react';
import { MapPin, Info, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { LocationState } from '../../types';

interface LocationCardProps {
  location: LocationState;
  onConfirm: () => void;
  onChangeLocation: (newLoc: LocationState) => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({
  location,
  onConfirm,
  onChangeLocation,
}) => {
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editState, setEditState] = useState(location.state);
  const [editDistrict, setEditDistrict] = useState(location.district);
  const [editCity, setEditCity] = useState(location.city);

  const handleSaveLocation = () => {
    onChangeLocation({
      state: editState,
      district: editDistrict,
      city: editCity,
      detected: false,
      rawLocationString: `${editCity}, ${editState}`,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Main Location Box */}
      <div className="bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border border-blue-200/90 rounded-2xl p-6 sm:p-8 shadow-xs text-left">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/10">
            <MapPin size={28} />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600">
              APPROXIMATE LOCATION DETECTED FROM YOUR DEVICE
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              {location.city}, {location.state}
            </h2>
            <p className="text-xs font-medium text-slate-600 mt-1.5 leading-relaxed">
              We detected your approximate location. Procedures and licensing bodies differ by municipality, so please confirm before we continue.
            </p>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            kind="primary"
            size="lg"
            className="flex-1"
            onClick={onConfirm}
          >
            Use this location →
          </Button>
          <Button
            kind="secondary"
            size="lg"
            icon={Edit3}
            onClick={() => setIsModalOpen(true)}
          >
            Change location
          </Button>
        </div>

        {/* Manual entry text link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Enter location manually
          </button>
        </div>
      </div>

      {/* Privacy Guarantee Expandable Section */}
      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden text-left">
        <button
          onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info size={15} className="text-blue-600" />
            <span>How was this detected & why do we confirm?</span>
          </div>
          {showPrivacyDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showPrivacyDetails && (
          <div className="px-5 pb-4 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 space-y-2 leading-relaxed">
            <p className="pt-2">
              <strong className="text-slate-800">Your location is never silently assumed. You stay in control.</strong>
            </p>
            <p>
              CivicPath uses coarse IP geolocating to suggest your municipal area. Because legal requirements, fees, and government departments vary between cities and districts, explicit location confirmation ensures accurate procedural steps.
            </p>
          </div>
        )}
      </div>

      {/* Change Location Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Location Manually"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">State</label>
            <select
              value={editState}
              onChange={(e) => setEditState(e.target.value)}
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">District</label>
            <input
              type="text"
              value={editDistrict}
              onChange={(e) => setEditDistrict(e.target.value)}
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-600"
              placeholder="e.g. Amravati"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">City / Municipality</label>
            <input
              type="text"
              value={editCity}
              onChange={(e) => setEditCity(e.target.value)}
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-600"
              placeholder="e.g. Amravati"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button kind="secondary" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button kind="primary" size="md" onClick={handleSaveLocation}>
              Save & Use Location
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
