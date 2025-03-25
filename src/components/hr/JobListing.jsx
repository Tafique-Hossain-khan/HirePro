
import { ExternalLink } from 'lucide-react';

const JobListing = ({ job, onClose }) => {
  const handleApply = () => {
    // For development/demo purposes
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      alert(`Applied for ${job.title} at ${job.company} (Development mode: Application simulated)`);
    } else {
      // This would typically send an API request in production
      alert(`Applied for ${job.title} at ${job.company}`);
    }
  };

  return (
    <div className="flex justify-between items-start p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex items-start gap-3">
        {/* Company Logo */}
        <div className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
          {job.logo ? (
            <img src={job.logo} alt={`${job.company} logo`} />
          ) : (
            <div className="text-gray-400 text-lg font-bold">{job.company?.charAt(0) || "?"}</div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex flex-col">
          <a href="#" className="text-blue-600 font-medium hover:underline">
            {job.title}
          </a>
          <p className="text-sm">{job.company}</p>
          <p className="text-sm text-gray-600">{job.location}</p>
          
          <div className="flex items-center gap-2 mt-1">
            {job.workplaceType && (
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                {job.workplaceType}
              </span>
            )}
            {job.postedTime && (
              <span className="text-xs text-gray-500">{job.postedTime}</span>
            )}
            {job.easyApply && (
              <span className="flex items-center gap-1 text-xs">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#0077B5">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
                Easy Apply
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Close and Apply Buttons */}
      <div className="flex items-center gap-2">
        <button 
          onClick={onClose}
          className="text-gray-500 hover:bg-gray-100 p-1 rounded"
          aria-label="Close job listing"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button
          onClick={handleApply}
          className="flex items-center gap-1 text-blue-600 font-medium hover:underline"
        >
          Apply <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
};

export default JobListing;