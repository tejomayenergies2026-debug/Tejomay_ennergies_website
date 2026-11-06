import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';

interface TwoFactorManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MfaStep = 'status' | 'verify_current' | 'enroll_new' | 'success';

interface FactorInfo {
  id: string;
  friendlyName?: string;
  status: 'verified' | 'unverified';
  createdAt?: string;
}

export default function TwoFactorManagerModal({ isOpen, onClose }: TwoFactorManagerModalProps) {
  const [step, setStep] = useState<MfaStep>('status');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeFactor, setActiveFactor] = useState<FactorInfo | null>(null);

  // Step-Up Verification (Current Device)
  const [currentTotpCode, setCurrentTotpCode] = useState('');
  const [currentChallengeId, setCurrentChallengeId] = useState('');
  const [verifyAttempts, setVerifyAttempts] = useState(0);

  // New Enrollment (New Device)
  const [newFactorId, setNewFactorId] = useState('');
  const [newSecret, setNewSecret] = useState('');
  const [newQrUrl, setNewQrUrl] = useState('');
  const [newTotpCode, setNewTotpCode] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Load Current 2FA Status on Open
  useEffect(() => {
    if (!isOpen) return;
    loadActiveFactors();
  }, [isOpen]);

  const loadActiveFactors = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: factorsErr } = await supabase.auth.mfa.listFactors();
      if (factorsErr) {
        setError('Failed to query current MFA status.');
        return;
      }

      const verified = data?.totp?.find(f => f.status === 'verified');
      if (verified) {
        setActiveFactor({
          id: verified.id,
          friendlyName: verified.friendly_name || 'Google Authenticator Device',
          status: 'verified',
          createdAt: verified.created_at
        });
      } else {
        setActiveFactor(null);
      }
      setStep('status');
    } catch {
      setError('Network error checking security state.');
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 1: INITIATE RE-AUTHENTICATION / ATTACH ───────────────────────────
  const handleStartSetup = async () => {
    setError('');
    setLoading(true);

    if (activeFactor) {
      // Step-Up Security Check: User must verify current device first
      try {
        const { data: challengeData, error: challengeErr } = await supabase.auth.mfa.challenge({
          factorId: activeFactor.id
        });

        if (challengeErr || !challengeData) {
          setError('Could not initiate authorization challenge with current device.');
          setLoading(false);
          return;
        }

        setCurrentChallengeId(challengeData.id);
        setCurrentTotpCode('');
        setStep('verify_current');
      } catch {
        setError('Security initialization exception occurred.');
      } finally {
        setLoading(false);
      }
    } else {
      // No active factor, jump straight to new enrollment
      await initiateNewEnrollment();
    }
  };

  // ─── STEP 2: VERIFY CURRENT DEVICE (STEP-UP AUTH) ──────────────────────────
  const handleVerifyCurrentDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTotpCode.trim().length !== 6) {
      setError('Enter your active 6-digit authenticator code.');
      return;
    }

    if (verifyAttempts >= 3) {
      setError('Too many failed authorization attempts. Operation locked for security.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!activeFactor) throw new Error('No active factor found');

      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId: activeFactor.id,
        challengeId: currentChallengeId,
        code: currentTotpCode.trim()
      });

      if (verifyErr) {
        const newAttempts = verifyAttempts + 1;
        setVerifyAttempts(newAttempts);
        setError(`Invalid 6-digit code. ${3 - newAttempts} authorization attempt(s) remaining.`);
        setCurrentTotpCode('');
        setLoading(false);
        return;
      }

      // Authorization granted! Proceed to generate new QR code for replacement
      setVerifyAttempts(0);
      await initiateNewEnrollment();
    } catch {
      setError('Device authorization failed.');
      setLoading(false);
    }
  };

  // ─── STEP 3: GENERATE NEW TOTP FACTOR & QR CODE ────────────────────────────
  const initiateNewEnrollment = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: enrollData, error: enrollErr } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'Tejomay Solar',
        friendlyName: `Admin Device (${new Date().toLocaleDateString('en-GB')})`
      });

      if (enrollErr || !enrollData) {
        setError('Failed to generate new 2FA secret.');
        setLoading(false);
        return;
      }

      setNewFactorId(enrollData.id);
      setNewSecret(enrollData.totp.secret);

      const qrUrl = await QRCode.toDataURL(enrollData.totp.uri, {
        margin: 1,
        width: 180,
        color: { dark: '#0b131f', light: '#ffffff' }
      });
      setNewQrUrl(qrUrl);
      setNewTotpCode('');
      setStep('enroll_new');
    } catch {
      setError('Failed to generate visual QR code.');
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 4: VERIFY NEW DEVICE & ATOMICALLY DEACTIVATE OLD ─────────────────
  const handleVerifyNewDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTotpCode.trim().length !== 6) {
      setError('Enter the 6-digit code from your NEW authenticator app.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create Challenge for new factor
      const { data: challengeData, error: challengeErr } = await supabase.auth.mfa.challenge({
        factorId: newFactorId
      });

      if (challengeErr || !challengeData) {
        setError('Could not create challenge for new device.');
        setLoading(false);
        return;
      }

      // 2. Verify Code for new factor
      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId: newFactorId,
        challengeId: challengeData.id,
        code: newTotpCode.trim()
      });

      if (verifyErr) {
        setError('Invalid 6-digit code. Check your new authenticator app.');
        setNewTotpCode('');
        setLoading(false);
        return;
      }

      // 3. ATOMIC DEACTIVATION: If there was an old factor, unenroll it now
      if (activeFactor && activeFactor.id !== newFactorId) {
        try {
          await supabase.auth.mfa.unenroll({
            factorId: activeFactor.id
          });
        } catch (unenrollErr) {
          console.warn('[2FA] Old factor unenroll warning:', unenrollErr);
        }
      }

      // 4. Reload Active Factors
      await loadActiveFactors();
      setStep('success');
    } catch {
      setError('Failed to activate new authenticator device.');
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(newSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCloseModal = () => {
    setStep('status');
    setError('');
    setCurrentTotpCode('');
    setNewTotpCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleCloseModal}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5, 10, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#0d1829',
          border: '1.5px solid rgba(107, 174, 35, 0.35)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🛡️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                Google Authenticator (2FA) Manager
              </h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#6BAE23', fontWeight: 600 }}>
                Bank-Grade TOTP Device Key Management
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.75rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ─── STAGE 1: CURRENT STATUS OVERVIEW ─────────────────────────── */}
          {step === 'status' && (
            <div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                    Active 2FA Protection:
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    background: activeFactor ? 'rgba(68, 217, 68, 0.18)' : 'rgba(239, 68, 68, 0.18)',
                    color: activeFactor ? '#44D944' : '#ef4444',
                    border: `1px solid ${activeFactor ? '#44D944' : '#ef4444'}`
                  }}>
                    {activeFactor ? '● ACTIVE & BOUND' : '● NOT CONFIGURED'}
                  </span>
                </div>

                {activeFactor ? (
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                    <div><strong>Device:</strong> {activeFactor.friendlyName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.3rem' }}>
                      Key ID: {activeFactor.id}
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5 }}>
                    No authenticator device is linked. Anyone with your password could potentially sign in. Attach Google Authenticator immediately to secure the portal.
                  </p>
                )}
              </div>

              <div style={{ background: 'rgba(107, 174, 35, 0.08)', border: '1px solid rgba(107, 174, 35, 0.25)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.82)', lineHeight: 1.6 }}>
                <strong>🔒 Security Policy:</strong> To prevent unauthorized device transfer or session hijacking, transferring to a new phone requires you to enter the 6-digit code from your <em>currently active</em> device before any new QR code is revealed.
              </div>

              <button
                onClick={handleStartSetup}
                disabled={loading}
                className="btn-lime"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 8px 24px rgba(107, 174, 35, 0.25)'
                }}
              >
                {loading ? 'Initializing Security...' : activeFactor ? 'Transfer / Attach New Authenticator 🔄' : 'Attach Google Authenticator Now 🛡️'}
              </button>
            </div>
          )}

          {/* ─── STAGE 2: STEP-UP RE-AUTHENTICATION (EXISTING DEVICE) ───────── */}
          {step === 'verify_current' && (
            <form onSubmit={handleVerifyCurrentDevice}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
                <h4 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem' }}>
                  Authorize Device Replacement
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.82rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
                  Enter the <strong>current 6-digit code</strong> from your active Google Authenticator app to prove physical ownership before a new device can be attached.
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  maxLength={6}
                  value={currentTotpCode}
                  onChange={(e) => setCurrentTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1.5px solid #6BAE23',
                    borderRadius: '12px',
                    padding: '0.85rem',
                    color: '#ffffff',
                    fontSize: '1.6rem',
                    textAlign: 'center',
                    letterSpacing: '0.4em',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setStep('status')}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || currentTotpCode.length !== 6}
                  className="btn-lime"
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  {loading ? 'Verifying...' : 'Authorize Replacement ➔'}
                </button>
              </div>
            </form>
          )}

          {/* ─── STAGE 3: SCAN QR ON NEW DEVICE & VERIFY ────────────────────── */}
          {step === 'enroll_new' && (
            <form onSubmit={handleVerifyNewDevice}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <h4 style={{ margin: 0, color: '#ffffff', fontSize: '1.05rem' }}>
                  Scan with NEW Authenticator App
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                  Open Google Authenticator on your new phone and scan this QR code.
                </p>
              </div>

              {/* QR Code Container */}
              {newQrUrl && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <div style={{
                    background: '#ffffff',
                    padding: '12px',
                    borderRadius: '16px',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
                  }}>
                    <img src={newQrUrl} alt="2FA QR Code" style={{ width: '160px', height: '160px', display: 'block' }} />
                  </div>
                </div>
              )}

              {/* Manual Secret Key */}
              {newSecret && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '0.6rem 0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)' }}>Manual Secret:</span>
                  <code style={{ fontSize: '0.75rem', color: '#6BAE23', letterSpacing: '0.08em' }}>{newSecret}</code>
                  <button
                    type="button"
                    onClick={copySecret}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6BAE23',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {copiedSecret ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              )}

              {/* Verify New Code */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.35rem', textAlign: 'center' }}>
                  Enter the 6-Digit Code from Your NEW Authenticator:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={newTotpCode}
                  onChange={(e) => setNewTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1.5px solid #6BAE23',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    textAlign: 'center',
                    letterSpacing: '0.35em',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setStep('status')}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || newTotpCode.length !== 6}
                  className="btn-lime"
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  {loading ? 'Activating...' : 'Verify & Lock to New Phone 🔒'}
                </button>
              </div>
            </form>
          )}

          {/* ─── STAGE 4: SUCCESS CONFIRMATION ──────────────────────────────── */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
              <h4 style={{ margin: 0, color: '#44D944', fontSize: '1.25rem', fontWeight: 800 }}>
                2FA Successfully Linked!
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Your new Google Authenticator device is now the sole registered factor. Any previous devices have been atomically deactivated.
              </p>
              <button
                onClick={handleCloseModal}
                className="btn-lime"
                style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem 2rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

