import React from 'react';
import EarthquakeMagnitudeMap from '@/components/EarthquakeMagnitudeMap';

const TestEarthquakeMap = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Earthquake Magnitude Map Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Component Test</h2>
          <p className="text-gray-600 mb-6">
            This page tests the EarthquakeMagnitudeMap component in isolation to identify any rendering issues.
          </p>
          
          <EarthquakeMagnitudeMap height={600} />
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Component should display a map with earthquake data</p>
            <p>• Check browser console for any error messages</p>
            <p>• If loading fails, check network tab for failed requests</p>
            <p>• Verify that react-plotly.js is properly loaded</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestEarthquakeMap;
