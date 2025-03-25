import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, List, AlignJustify } from 'lucide-react';
import axios from 'axios';
import JobListingContainer from './JobListingContainer';

const JobPostingForm = () => {
    const [description, setDescription] = useState(``);
    const [jobTitle, setJobTitle] = useState("Frontend Developer");
    const [company, setCompany] = useState("");
    const [workplaceType, setWorkplaceType] = useState("On-site");
    const [jobLocation, setJobLocation] = useState("Bhubaneswar, Odisha, India");
    const [jobType, setJobType] = useState("Full-time");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const editorRef = useRef(null);

    useEffect(() => {
        const editor = editorRef.current;
        if (editor) {
            editor.innerHTML = description.replace(/\n/g, '<br>');
        }
    }, []);

    const handleInput = (e) => {
        const content = e.currentTarget.innerHTML;
        setDescription(content.replace(/<br>/g, '\n'));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.execCommand('insertLineBreak');
        }
    };

    const handleFormat = (command) => {
        document.execCommand(command === 'bold' ? 'bold' : 'italic', false, null);
    };

    const handleBullet = () => {
        document.execCommand('insertUnorderedList', false, null);
    };

    const handleClear = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
            setDescription('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus('loading');

        const jobData = {
            title: jobTitle,
            company: company,
            workplaceType: workplaceType,
            location: jobLocation,
            jobType: jobType,
            description: description,
        };

        try {
            // For development/demo purposes - simulate a successful response
            if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                console.log('Development mode: Job posted (simulated)', jobData);
                setIsSubmitted(true);
                setSubmitStatus('success');
                
                // Optionally clear form
                setJobTitle("");
                setCompany("");
                setDescription("");
                if (editorRef.current) {
                    editorRef.current.innerHTML = '';
                }
            } else {
                // In production, use the actual endpoint
                const response = await axios.post('/hr/job', jobData);
                console.log('Job posted successfully:', response.data);
                setIsSubmitted(true);
                setSubmitStatus('success');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            setSubmitStatus('error');
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
                    <div className="text-sm text-gray-500">* Indicates required</div>

                    {/* Status messages */}
                    {submitStatus === 'success' && (
                        <div className="bg-green-50 text-green-800 p-4 rounded-md">
                            Job posted successfully! Your job listing is now live.
                        </div>
                    )}
                    
                    {submitStatus === 'error' && (
                        <div className="bg-red-50 text-red-800 p-4 rounded-md">
                            There was an error posting the job. Please try again later.
                            <p className="text-sm mt-1 text-red-600">
                                (Note: For local development, form submission is simulated)
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h2 className="text-lg md:text-xl font-semibold">Job details*</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm md:text-base">
                                    Job title
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">?</div>
                                </label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm md:text-base">Company</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm md:text-base">Workplace type</label>
                                    <select
                                        value={workplaceType}
                                        onChange={(e) => setWorkplaceType(e.target.value)}
                                        className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 bg-white text-sm md:text-base"
                                    >
                                        <option>On-site</option>
                                        <option>Hybrid</option>
                                        <option>Remote</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm md:text-base">
                                        Job location
                                        <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs">?</div>
                                    </label>
                                    <input
                                        type="text"
                                        value={jobLocation}
                                        onChange={(e) => setJobLocation(e.target.value)}
                                        className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm md:text-base">Job type</label>
                                <select
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                    className="mt-1 w-full border border-gray-300 rounded px-2 py-1.5 md:px-3 md:py-2 bg-white text-sm md:text-base"
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Temporary</option>
                                    <option>Internship</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button 
                        type="button"
                        className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 md:px-4 md:py-2 hover:bg-gray-50 text-sm md:text-base transition-colors"
                    >
                        <span>✨</span>
                        Write new with AI
                    </button>

                    <div className="space-y-4">
                        <h2 className="text-lg md:text-xl font-semibold">Description*</h2>

                        <div className="border border-gray-300 rounded">
                            <div className="border-b border-gray-300 p-1.5 md:p-2 flex items-center gap-2 md:gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleFormat('bold')}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Bold"
                                >
                                    <Bold size={18} className="md:w-5 md:h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFormat('italic')}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Italic"
                                >
                                    <Italic size={18} className="md:w-5 md:h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBullet}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Bullet List"
                                >
                                    <List size={18} className="md:w-5 md:h-5" />
                                </button>
                                <button
                                    type="button"
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Justify"
                                >
                                    <AlignJustify size={18} className="md:w-5 md:h-5" />
                                </button>
                            </div>

                            <div
                                ref={editorRef}
                                contentEditable
                                className="p-3 md:p-4 text-sm md:text-base min-h-[300px] focus:outline-none whitespace-pre-wrap"
                                onInput={handleInput}
                                onKeyDown={handleKeyDown}
                                style={{ lineHeight: '1.5' }}
                                required="required"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs md:text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                We added a template to help you.
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-blue-600 hover:underline transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                            <div>{description.replace(/<[^>]*>/g, '').length}/10,000</div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button 
                            type="submit" 
                            className={`px-4 py-2 rounded text-white transition-colors ${
                                submitStatus === 'loading' 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                            disabled={submitStatus === 'loading'}
                        >
                            {submitStatus === 'loading' ? 'Posting...' : 'Post Job'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Job Listings Section */}
            <JobListingContainer />
        </div>
    );
};

export default JobPostingForm;