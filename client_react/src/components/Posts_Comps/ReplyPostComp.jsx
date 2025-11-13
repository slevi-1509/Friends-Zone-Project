import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faTimes, faUser, faClock, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import '../../styles/Posts.css';

export const ReplyPostComp=({show, onHide, post, replyPost}) => {
    const [reply, setReply] = useState({});
    const [charCount, setCharCount] = useState(0);
    const postId = post._id;
    const maxChars = 500;

    const setReplyDetails = (e) => {
        let { value, name } = e.target;
        setReply({...reply, [name]: value})
        setCharCount(value.length);
    }

    const handleSubmit = () => {
        if (reply.body && reply.body.trim()) {
            replyPost(reply, postId);
            setReply({});
            setCharCount(0);
        }
    }

    const handleClose = () => {
        setReply({});
        setCharCount(0);
        onHide();
    }

    useEffect (() => {
        // Handle Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (show) {
            // Lock body scroll when modal is open
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            // Restore body scroll when modal closes
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscape);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show])

    if (!show) return null;

    // Render modal using portal to document body
    return createPortal(
        <div className="modern-modal-overlay" onClick={handleClose}>
            <div className="modern-modal-container reply-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header-modern">
                    <div className="modal-title-section">
                        <div className="modal-icon-wrapper">
                            <FontAwesomeIcon icon={faReply} />
                        </div>
                        <div>
                            <h2 className="modal-title-text">Reply to Post</h2>
                            <p className="modal-subtitle-text">Share your thoughts</p>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Original Post Preview */}
                <div className="reply-original-post-preview">
                    <div className="preview-header">
                        <div className="preview-author">
                            <div className="preview-avatar">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="preview-author-info">
                                <span className="preview-author-name">{post.username}</span>
                                <span className="preview-post-date">
                                    <FontAwesomeIcon icon={faClock} />
                                    {new Date(post.date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="preview-content">
                        <p className="preview-text">{post.body}</p>
                    </div>
                </div>

                {/* Reply Form */}
                <div className="modal-body-modern">
                    <div className="reply-form-section">
                        <label className="modern-field-label">
                            <FontAwesomeIcon icon={faReply} />
                            Your Reply
                        </label>
                        <textarea
                            className="modern-textarea"
                            id="body"
                            name="body"
                            placeholder="Write your reply here..."
                            onChange={setReplyDetails}
                            maxLength={maxChars}
                            rows="6"
                            required
                        />
                        <div className="textarea-footer">
                            <span className={`char-counter ${charCount > maxChars * 0.9 ? 'warning' : ''}`}>
                                {charCount}/{maxChars}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer-modern">
                    <button className="modal-btn-secondary" onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className="modal-btn-primary"
                        onClick={handleSubmit}
                        disabled={!reply.body || !reply.body.trim()}
                    >
                        <FontAwesomeIcon icon={faPaperPlane} />
                        <span>Send Reply</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
  }