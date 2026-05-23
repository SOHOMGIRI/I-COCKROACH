import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRupeeSign, FaExternalLinkAlt } from 'react-icons/fa';
import API from '../config';
import './BusinessDashboard.css';

const CATEGORY_LABELS = {
  'Social Media': 'Social Media',
  Branding: 'Branding',
  'Video Editing': 'Video/Editing',
  'Growth Outreach': 'Growth/Outreach',
  'Automation Tech': 'Automation/Tech',
  'Research Ops': 'Research/Ops',
};

function BusinessDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingPitches, setLoadingPitches] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchJobs = useCallback(async () => {
    try {
      setLoadingJobs(true);
      const { data } = await axios.get(`${API}/api/jobs`);
      setJobs(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load jobs. Please try again.'
      );
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  const fetchPitches = useCallback(async (jobId) => {
    try {
      setLoadingPitches(true);
      const { data } = await axios.get(`${API}/api/pitches/job/${jobId}`);
      setPitches(Array.isArray(data) ? data : []);
    } catch (err) {
      setPitches([]);
      setError(
        err.response?.data?.message || 'Failed to load pitches for this job.'
      );
    } finally {
      setLoadingPitches(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleJobClick = (job) => {
    if (selectedJob?._id === job._id) {
      setSelectedJob(null);
      setPitches([]);
      setSuccessMsg('');
      return;
    }
    setSelectedJob(job);
    setSuccessMsg('');
    fetchPitches(job._id);
  };

  const handleAccept = async (pitchId) => {
    try {
      setActionLoading(pitchId);
      setSuccessMsg('');
      const { data } = await axios.patch(`${API}/api/pitches/${pitchId}/accept`);
      setPitches(data.pitches || []);
      setJobs((prev) =>
        prev.map((j) =>
          j._id === selectedJob._id ? { ...j, status: 'In Progress' } : j
        )
      );
      setSelectedJob((prev) => (prev ? { ...prev, status: 'In Progress' } : prev));
      setSuccessMsg('✅ Pitch accepted! Job is now In Progress.');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to accept pitch.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (pitchId) => {
    try {
      setActionLoading(pitchId);
      const { data } = await axios.patch(`${API}/api/pitches/${pitchId}/reject`);
      setPitches((prev) =>
        prev.map((p) => (p._id === pitchId ? data : p))
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to reject pitch.'
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatBudget = (n) => Number(n).toLocaleString('en-IN');

  return (
    <div className="business-dashboard">
      <motion.header
        className="biz-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Business Dashboard 🏢</h1>
        <p>Manage your jobs and review student pitches</p>
      </motion.header>

      {error && (
        <motion.div
          className="biz-alert biz-alert-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
          <button type="button" onClick={() => setError('')}>×</button>
        </motion.div>
      )}

      <AnimatePresence>
        {successMsg && (
          <motion.div
            className="biz-alert biz-alert-success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="biz-jobs-section">
        <h2>Your Jobs</h2>

        {loadingJobs ? (
          <div className="biz-loading">
            <span className="biz-spinner" />
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="biz-empty">
            <p>No jobs posted yet.</p>
            <Link to="/post-job" className="btn-post-job">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="jobs-list">
            {jobs.map((job, i) => {
              const isSelected = selectedJob?._id === job._id;
              const catLabel = CATEGORY_LABELS[job.category] || job.category;

              return (
                <motion.div
                  key={job._id}
                  className={`job-card-biz ${isSelected ? 'job-card-selected' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => handleJobClick(job)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleJobClick(job);
                  }}
                >
                  <div className="job-card-top-row">
                    <span className="job-cat-badge">{catLabel}</span>
                    <span className={`job-status-badge status-${job.status?.replace(/\s/g, '-')}`}>
                      {job.status}
                    </span>
                  </div>
                  <h3>{job.title}</h3>
                  <div className="job-card-meta-row">
                    <span className="job-budget">
                      <FaRupeeSign /> ₹{formatBudget(job.budget)}
                    </span>
                    <span className="job-pitch-hint">
                      {isSelected ? '▼ Hide pitches' : '▶ View pitches'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedJob && (
          <motion.section
            className="biz-pitches-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2>
              Pitches for: <span>{selectedJob.title}</span>
            </h2>

            {loadingPitches ? (
              <div className="biz-loading">
                <span className="biz-spinner" />
                <p>Loading pitches...</p>
              </div>
            ) : pitches.length === 0 ? (
              <div className="biz-empty pitches-empty">
                <p>No pitches yet for this job. Students are on their way!</p>
              </div>
            ) : (
              <div className="pitches-list">
                {pitches.map((pitch, i) => (
                  <motion.div
                    key={pitch._id}
                    className={`pitch-card-biz pitch-${pitch.status?.toLowerCase()}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                  >
                    <div className="pitch-card-header">
                      <div>
                        <h4>{pitch.studentName}</h4>
                        <span className="pitch-college">{pitch.college}</span>
                      </div>
                      <span className={`pitch-status-tag tag-${pitch.status?.toLowerCase()}`}>
                        {pitch.status}
                      </span>
                    </div>

                    <div className="pitch-body">
                      <div className="pitch-field">
                        <label>Intro</label>
                        <p>{pitch.intro}</p>
                      </div>
                      <div className="pitch-field">
                        <label>Why Me</label>
                        <p>{pitch.whyMe}</p>
                      </div>
                    </div>

                    <div className="pitch-stats-row">
                      <span className="pitch-cost">
                        <FaRupeeSign /> ₹{formatBudget(pitch.cost)}
                      </span>
                      <span className="pitch-timeline">
                        ⏱ {pitch.timeline} days
                      </span>
                      {pitch.portfolioLink && (
                        <a
                          href={pitch.portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pitch-portfolio"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Portfolio <FaExternalLinkAlt />
                        </a>
                      )}
                    </div>

                    {pitch.status === 'Pending' && (
                      <div className="pitch-actions">
                        <button
                          type="button"
                          className="btn-accept"
                          disabled={actionLoading === pitch._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(pitch._id);
                          }}
                        >
                          {actionLoading === pitch._id ? '...' : '✅ Accept'}
                        </button>
                        <button
                          type="button"
                          className="btn-reject"
                          disabled={actionLoading === pitch._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(pitch._id);
                          }}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BusinessDashboard;
