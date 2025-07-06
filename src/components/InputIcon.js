import React from 'react';
import { FaUser, FaLock, FaAt, FaGraduationCap, FaLockOpen, FaEnvelope } from 'react-icons/fa';

const iconStyle = { 
  width: 16, 
  height: 16, 
  color: 'inherit' 
};

export function EmailIcon() {
  return <FaEnvelope style={iconStyle} />;
}

export function PasswordIcon() {
  return <FaLock style={iconStyle} />;
}

export function UserIcon() {
  return <FaUser style={iconStyle} />;
}

export function AtIcon() {
  return <FaAt style={iconStyle} />;
}

export function MailIcon() {
  return <FaEnvelope style={iconStyle} />;
}

export function GraduationIcon() {
  return <FaGraduationCap style={iconStyle} />;
}

export function ConfirmPasswordIcon() {
  return <FaLockOpen style={iconStyle} />;
}
