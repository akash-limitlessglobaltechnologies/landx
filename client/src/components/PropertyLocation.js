export const PropertyLocation = ({
    locationLink,
    setLocationLink,
    onNext,
    onPrevious
  }) => {
    const getProcessedMapLink = () => {
      if (!locationLink) return '';
      
      if (locationLink.includes('<iframe')) {
        const srcMatch = locationLink.match(/src="([^"]+)"/);
        return srcMatch ? srcMatch[1] : '';
      }
      
      if (locationLink.includes('google.com/maps/place/')) {
        return locationLink.replace(
          /maps\/place\//,
          'maps/embed?pb=!1m18!1m12!1m3!1d'
        );
      }
      
      return locationLink;
    };
  
    return (
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Google Maps Location
        </label>
        <textarea
          value={locationLink}
          onChange={(e) => setLocationLink(e.target.value)}
          placeholder="Paste Google Maps embed link or iframe code"
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        />
  
        {locationLink && locationLink.includes('google.com/maps') && (
          <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden h-[300px]">
            <iframe
              src={getProcessedMapLink()}
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Property Location"
            />
          </div>
        )}
  
        <div className="flex justify-between mt-6">
          <button
            onClick={onPrevious}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };