import { useState, useEffect } from 'react';
import JobListing from './JobListing';
import axios from 'axios';

const JobListingContainer = () => {
    const [jobs, setJobs] = useState([]);
    const [visibleJobs, setVisibleJobs] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const initialDisplayCount = 3;

    useEffect(() => {
        // Fetch jobs data
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/api/jobs');
                const fetchedJobs = response.data || [];
                setJobs(fetchedJobs);
                setVisibleJobs(fetchedJobs.slice(0, initialDisplayCount));
                setError(null);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setError('Failed to load jobs');

                // Fallback to mock data if API fails
                const mockJobs = [
                    {
                        id: 1,
                        title: 'Frontend Developer Intern',
                        company: 'Matrice.ai',
                        location: 'India (Remote)',
                        workplaceType: 'Remote',
                        logo: null,
                        postedTime: null,
                        easyApply: true
                    },
                    {
                        id: 2,
                        title: 'Frontend Developer Intern',
                        company: 'Raniac',
                        location: 'India (Remote)',
                        workplaceType: 'Remote',
                        postedTime: '7 hours ago',
                        logo: null,
                        easyApply: false
                    },
                    {
                        id: 3,
                        title: 'Frontend Developer',
                        company: 'Sors Co',
                        location: 'India (Remote)',
                        workplaceType: 'Remote',
                        postedTime: '7 hours ago',
                        logo: null,
                        easyApply: true
                    }
                ];
                setJobs(mockJobs);
                setVisibleJobs(mockJobs.slice(0, initialDisplayCount));
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleShowAll = () => {
        if (showAll) {
            setVisibleJobs(jobs.slice(0, initialDisplayCount));
        } else {
            setVisibleJobs(jobs);
        }
        setShowAll(!showAll);
    };

    const handleCloseJob = (jobId) => {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        setVisibleJobs(prevVisibleJobs => prevVisibleJobs.filter(job => job.id !== jobId));
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading jobs...</div>;
    }

    if (error && !jobs.length) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!jobs.length) {
        return <div className="p-4 text-center">No jobs available at this time.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-md">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recommended Jobs</h2>
            </div>

            <div className="divide-y divide-gray-200">
                {Array.isArray(visibleJobs) && visibleJobs.length > 0 ? (
                    visibleJobs.map((job) => (
                        <JobListing
                            key={job.id}
                            job={job}
                            onClose={() => handleCloseJob(job.id)}
                        />
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500">No jobs to display</div>
                )}
            </div>

            {jobs.length > initialDisplayCount && (
                <div className="flex justify-center p-4">
                    <button
                        onClick={handleShowAll}
                        className="flex items-center justify-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                    >
                        {showAll ? "Show less" : "Show all"}
                        {!showAll && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <polyline points="19 12 12 19 5 12"></polyline>
                            </svg>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobListingContainer;