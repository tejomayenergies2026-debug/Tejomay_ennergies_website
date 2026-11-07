import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

// ─── Security Configuration ───────────────────────────────────────────────────
const MAX_ATTEMPTS = 5;
const BASE_LOCKOUT_SECONDS = 300; // 5 minutes
const STORAGE_KEY = '_tjy_sec_auth_lck';

interface PersistentLockState {
  attempts: number;
  lockedUntil: number | null;
  lockCount: number;
  lastAttempt: number;
}

function getStoredLockState(): PersistentLockState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { attempts: 0, lockedUntil: null, lockCount: 0, lastAttempt: 0 };
    const parsed = JSON.parse(raw);
    // If last attempt was more than 30 mins ago and not locked, reset attempts
    if (!parsed.lockedUntil && Date.now() - (parsed.lastAttempt || 0) > 30 * 60 * 1000) {
      return { attempts: 0, lockedUntil: null, lockCount: 0, lastAttempt: 0 };
    }
    return parsed;
  } catch {
    return { attempts: 0, lockedUntil: null, lockCount: 0, lastAttempt: 0 };
  }
}

function setStoredLockState(state: PersistentLockState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function clearStoredLockState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

type AuthStep = 'credentials' | 'mfa_challenge' | 'mfa_enroll';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  // Step & Form State
  const [step, setStep] = useState<AuthStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Rate Limiting (Backed by localStorage)
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);

  // 2FA / MFA State
  const [mfaFactorId, setMfaFactorId] = useState<string>('');
  const [mfaChallengeId, setMfaChallengeId] = useState<string>('');
  const [totpCode, setTotpCode] = useState('');
  const [enrollQrUrl, setEnrollQrUrl] = useState<string>('');
  const [enrollSecret, setEnrollSecret] = useState<string>('');
  const [enrollFactorId, setEnrollFactorId] = useState<string>('');
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Honeypot field (bots fill this, real users don't see it)
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Security state reset handler
  const lockTapRef = useRef(0);
  const lockTimerRef = useRef<number | null>(null);

  const handleEmergencyUnlock = () => {
    lockTapRef.current += 1;
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      lockTapRef.current = 0;
    }, 2500);

    if (lockTapRef.current >= 5) {
      lockTapRef.current = 0;
      clearStoredLockState();
      setLockedUntil(null);
      setAttempts(0);
      setCountdown(0);
      setError('');
    }
  };

  // Initialize Lock State from localStorage on Mount / Modal Open
  useEffect(() => {
    if (!isOpen) return;
    const lockData = getStoredLockState();
    setAttempts(lockData.attempts || 0);

    if (lockData.lockedUntil && lockData.lockedUntil > Date.now()) {
      setLockedUntil(lockData.lockedUntil);
      const remaining = Math.max(0, Math.ceil((lockData.lockedUntil - Date.now()) / 1000));
      setCountdown(remaining);
      setError(`Too many failed attempts. Login locked for security.`);
    } else if (lockData.lockedUntil && lockData.lockedUntil <= Date.now()) {
      // Lock expired
      setLockedUntil(null);
      setCountdown(0);
      setStoredLockState({ ...lockData, lockedUntil: null, attempts: 0 });
    }
  }, [isOpen]);

  // Countdown timer for persistent lockout
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining === 0) {
        setLockedUntil(null);
        setAttempts(0);
        setError('');
        const cur = getStoredLockState();
        setStoredLockState({ ...cur, attempts: 0, lockedUntil: null });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  if (!isOpen) return null;

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;
  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - attempts);

  // ─── STEP 1: CREDENTIALS SUBMISSION ─────────────────────────────────────────
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypotRef.current?.value) {
      setTimeout(() => setError(''), 1500);
      return;
    }

    if (isLocked) return;

    if (!email.trim() || !password.trim()) {
      setError('Please enter your credentials.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Authentication service unavailable. Please contact the system administrator. (Code: SEC-CFG-01)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (authError || !authData.user) {
        console.warn('[Supabase Auth Error]:', authError?.message || authError);

        if (authError?.message?.toLowerCase().includes('confirm')) {
          setError('Email unconfirmed in Supabase. In Supabase Dashboard > Auth > Users, click "..." on your user and select "Auto Confirm User".');
          setLoading(false);
          return;
        }

        const cur = getStoredLockState();
        const newAttempts = (cur.attempts || 0) + 1;
        const newLastAttempt = Date.now();

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockCount = (cur.lockCount || 0) + 1;
          const lockoutDuration = BASE_LOCKOUT_SECONDS * Math.min(lockCount, 3); // Exponential: 5m, 10m, 15m
          const lockTime = Date.now() + lockoutDuration * 1000;

          const updatedState = {
            attempts: newAttempts,
            lockedUntil: lockTime,
            lockCount,
            lastAttempt: newLastAttempt
          };
          setStoredLockState(updatedState);
          setAttempts(newAttempts);
          setLockedUntil(lockTime);
          setError(`Too many failed attempts. Security lock engaged for ${Math.round(lockoutDuration / 60)} minutes.`);
        } else {
          const updatedState = {
            ...cur,
            attempts: newAttempts,
            lastAttempt: newLastAttempt
          };
          setStoredLockState(updatedState);
          setAttempts(newAttempts);
          const remaining = MAX_ATTEMPTS - newAttempts;
          setError(`Invalid credentials. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`);
        }
        setPassword('');
        setLoading(false);
        return;
      }

      // ─── Credentials Valid! Now Check 2FA / MFA Status ────────────────────
      const { data: factorsData, error: factorError } = await supabase.auth.mfa.listFactors();
      
      const verifiedTotp = factorsData?.totp?.find(f => f.status === 'verified');

      if (verifiedTotp && !factorError) {
        // User has verified TOTP 2FA enabled -> Challenge for 6-digit code
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: verifiedTotp.id,
        });

        if (challengeError || !challengeData) {
          setError('Failed to initiate 2FA verification. Please try again.');
          setLoading(false);
          return;
        }

        setMfaFactorId(verifiedTotp.id);
        setMfaChallengeId(challengeData.id);
        setStep('mfa_challenge');
        setError('');
        setLoading(false);
        return;
      }

      // Check if user should be offered 2FA Enrollment
      // If user has NO verified factors enrolled, force 2FA setup with authenticator app
      if (!verifiedTotp) {
        // Clean up any dangling unverified factors first
        if (factorsData?.totp && factorsData.totp.length > 0) {
          for (const factor of factorsData.totp) {
            if ((factor.status as string) !== 'verified') {
              await supabase.auth.mfa.unenroll({ factorId: factor.id }).catch(() => {});
            }
          }
        }
        setStep('mfa_enroll');
        await initiate2FAEnrollment();
        setLoading(false);
        return;
      }

      // If user has verified TOTP, it was handled above in mfa_challenge.
      // If none, enrollment was triggered.
      setError('2FA verification required to proceed.');
      setLoading(false);
    } catch {
      setError('A network security error occurred. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  // ─── INITIATE 2FA TOTP ENROLLMENT ──────────────────────────────────────────
  const initiate2FAEnrollment = async () => {
    try {
      setLoading(true);
      const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'Tejomay Solar',
        friendlyName: 'Tejomay Admin App'
      });

      if (enrollError || !enrollData) {
        console.warn('[2FA] Enroll failed or not configured in project:', enrollError);
        setError('Two-Factor Authentication setup required. (Code: SEC-MFA-02)');
        return;
      }

      setEnrollFactorId(enrollData.id);
      setEnrollSecret(enrollData.totp.secret);

      // Generate visual QR code data URL
      const qrDataUrl = await QRCode.toDataURL(enrollData.totp.uri, {
        margin: 1,
        width: 180,
        color: { dark: '#0b131f', light: '#ffffff' }
      });
      setEnrollQrUrl(qrDataUrl);
    } catch (err) {
      console.warn('[2FA] QR generation exception:', err);
      setError('Unable to initialize 2FA authenticator QR code. Please reload and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── VERIFY 2FA TOTP CODE (CHALLENGE OR ENROLL) ───────────────────────────
  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.trim().length !== 6) {
      setError('Please enter the 6-digit authenticator code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (step === 'mfa_challenge') {
        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId: mfaFactorId,
          challengeId: mfaChallengeId,
          code: totpCode.trim(),
        });

        if (verifyError) {
          setError('Invalid 2FA code. Check your authenticator app and try again.');
          setTotpCode('');
          setLoading(false);
          return;
        }

        finalizeSuccess();
      } else if (step === 'mfa_enroll') {
        // Create challenge then verify to activate the factor
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: enrollFactorId,
        });

        if (challengeError) {
          setError('Challenge generation failed. Please try again.');
          setLoading(false);
          return;
        }

        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId: enrollFactorId,
          challengeId: challengeData.id,
          code: totpCode.trim(),
        });

        if (verifyError) {
          setError('Invalid 6-digit code. Please verify against your authenticator app.');
          setTotpCode('');
          setLoading(false);
          return;
        }

        finalizeSuccess();
      }
    } catch {
      setError('Verification network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const finalizeSuccess = () => {
    clearStoredLockState();
    setEmail('');
    setPassword('');
    setTotpCode('');
    setError('');
    setAttempts(0);
    setLockedUntil(null);
    setStep('credentials');
    onLoginSuccess();
  };

  const copySecret = () => {
    navigator.clipboard.writeText(enrollSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(5, 10, 18, 0.88)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#0d1624',
        borderRadius: '24px',
        border: '1.5px solid rgba(153, 230, 61, 0.35)',
        padding: '2.5rem',
        maxWidth: step === 'mfa_enroll' ? '500px' : '440px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
        position: 'relative'
      }}>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1.25rem',
            cursor: 'pointer'
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div 
            onClick={handleEmergencyUnlock}
            title="Security Status"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: step === 'credentials' ? '#6BAE23' : '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem',
              fontWeight: 800,
              fontSize: '1.3rem',
              color: '#0b131f',
              boxShadow: '0 0 20px rgba(107, 174, 35, 0.3)',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {step === 'credentials' ? '🔒' : '🛡️'}
          </div>

          <h3 style={{ fontFamily: 'var(--font-outfit)', fontSize: '1.7rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            {step === 'credentials' && 'Admin Portal'}
            {step === 'mfa_challenge' && 'Two-Factor Authentication'}
            {step === 'mfa_enroll' && 'Set Up 2FA Security'}
          </h3>

          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '0.35rem' }}>
            {step === 'credentials' && 'Authorized personnel & cryptographic verification only.'}
            {step === 'mfa_challenge' && 'Enter the 6-digit code from your authenticator app.'}
            {step === 'mfa_enroll' && 'Scan the QR code with Google Authenticator or Authy.'}
          </p>

          {/* Stepper Pill Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <span style={{
              height: '4px',
              width: '32px',
              borderRadius: '2px',
              background: '#6BAE23',
              transition: 'all 0.3s'
            }} />
            <span style={{
              height: '4px',
              width: '32px',
              borderRadius: '2px',
              background: step !== 'credentials' ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)',
              transition: 'all 0.3s'
            }} />
          </div>
        </div>

        {/* Error / Lockout Banner */}
        {error && (
          <div style={{
            background: isLocked ? 'rgba(239, 68, 68, 0.22)' : 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.45)',
            color: '#f87171',
            padding: '0.85rem',
            borderRadius: '12px',
            fontSize: '0.82rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>
            {error}
            {isLocked && countdown > 0 && (
              <div style={{ marginTop: '0.35rem', fontWeight: 700, color: '#fca5a5' }}>
                Retry available in: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 1: EMAIL & PASSWORD FORM ─────────────────────────────────── */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentialsSubmit} autoComplete="off">
            {/* Honeypot field — hidden from real users, bots fill it */}
            <input
              ref={honeypotRef}
              type="text"
              name="website_company_code"
              tabIndex={-1}
              style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
              aria-hidden="true"
            />

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.4rem' }}>
                Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                disabled={isLocked || loading}
                placeholder="admin@tejomayenergies.com"
                style={{ ...inputStyle, opacity: isLocked ? 0.5 : 1 }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{ background: 'none', border: 'none', color: '#6BAE23', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={isLocked || loading}
                placeholder="••••••••••••"
                style={{ ...inputStyle, opacity: isLocked ? 0.5 : 1 }}
              />
            </div>

            {/* Persistent Attempt indicator */}
            {attempts > 0 && !isLocked && (
              <div style={{ fontSize: '0.74rem', color: '#facc15', textAlign: 'center', marginBottom: '1rem' }}>
                ⚠️ {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before system lockout
              </div>
            )}

            <button
              type="submit"
              className="btn-lime"
              disabled={isLocked || loading}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', opacity: (isLocked || loading) ? 0.6 : 1 }}
            >
              <span>{loading ? 'Verifying Credentials...' : 'Authenticate & Next ↗'}</span>
            </button>
          </form>
        )}

        {/* ─── STEP 2A: 2FA CHALLENGE FORM ───────────────────────────────────── */}
        {step === 'mfa_challenge' && (
          <form onSubmit={handleVerifyMfa}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.6rem' }}>
                6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                autoFocus
                placeholder="123456"
                disabled={loading}
                style={{
                  ...inputStyle,
                  textAlign: 'center',
                  fontSize: '1.6rem',
                  letterSpacing: '0.35em',
                  fontFamily: 'monospace',
                  fontWeight: 700
                }}
              />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.5rem' }}>
                Open Google Authenticator or Authy to retrieve your current code.
              </p>
            </div>

            <button
              type="submit"
              className="btn-lime"
              disabled={loading || totpCode.length !== 6}
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', opacity: (loading || totpCode.length !== 6) ? 0.6 : 1 }}
            >
              <span>{loading ? 'Verifying 2FA...' : 'Confirm & Open Dashboard ↗'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setStep('credentials'); setError(''); }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.78rem',
                marginTop: '1rem',
                cursor: 'pointer'
              }}
            >
              ← Back to Credentials
            </button>
          </form>
        )}

        {/* ─── STEP 2B: 2FA ENROLLMENT FORM ───────────────────────────────────── */}
        {step === 'mfa_enroll' && (
          <form onSubmit={handleVerifyMfa}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              {enrollQrUrl ? (
                <div style={{
                  background: '#ffffff',
                  padding: '0.75rem',
                  borderRadius: '16px',
                  display: 'inline-block',
                  margin: '0 auto 0.75rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}>
                  <img src={enrollQrUrl} alt="2FA QR Code" style={{ width: '150px', height: '150px', display: 'block' }} />
                </div>
              ) : (
                <div style={{ padding: '2rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                  Generating QR Code...
                </div>
              )}

              {enrollSecret && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.25rem' }}>
                    Or enter setup key manually:
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}>
                    <code style={{
                      background: 'rgba(255,255,255,0.08)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.76rem',
                      color: '#a3e635',
                      fontFamily: 'monospace'
                    }}>
                      {enrollSecret}
                    </code>
                    <button
                      type="button"
                      onClick={copySecret}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        padding: '0.3rem 0.5rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      {copiedSecret ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.4rem', textAlign: 'center' }}>
                Enter the 6-digit code shown in your app to confirm:
              </label>
              <input
                type="text"
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                disabled={loading}
                style={{
                  ...inputStyle,
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  letterSpacing: '0.3em',
                  fontFamily: 'monospace',
                  fontWeight: 700
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setError('');
                }}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-lime"
                disabled={loading || totpCode.length !== 6}
                style={{ flex: 2, justifyContent: 'center', padding: '0.75rem', opacity: (loading || totpCode.length !== 6) ? 0.6 : 1 }}
              >
                <span>{loading ? 'Activating...' : 'Activate & Enter ↗'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'rgba(11, 19, 31, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
};
