import React from 'react';

type IconProps = {
  className?: string;
};

const logoBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAE+AT4DASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAEFB//EABgQAQEBAQEAAAAAAAAAAAAAAAABUWFx/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAEFB//EABYRAQEBAAAAAAAAAAAAAAAAAAABMf/aAAwDAQACEQMRAD8A+zAAAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAACgAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAAAAAKAAAAAAigAAAAACiAAAAoAAAAACgAAAKAAACgAKAAACgAAAKAAAKAAAAigKAAAAAAigKAAAAAAigKAAAAAAigKAAAAAAigKAAAAAAigKAAAAAAigKAAAAAAigKAAAAAAoAAAAACKAAAAAoAAAAAAAAAAAAoAAAAACKAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAKAAAAAAoAAAAAAgKAAAAAAoAAAAACKAAAAAAKAAAAAAIAAAAAACAAAAKAAAAIAAAAAKAAAAAAIAAAACgAAAAAIAAAACgAAAAACAAAAAigKAAAAAAgKAAAAAAoAAAAAAgKAAAAAAigKAAAAAAoAAAAAAgKAAAAAAoAAAAAAgKAAAAAAoAAAAAAoAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAKAAAAAAoAAAAAAAAAAAAoAAAAAAgAAAAAAAAAKAAAAAAAAAAAAAAoAAAAAAAAAAAAoAAAAAAigAAAAAAAAAAAAKAAAAAAAAAAACiAKgKACCgKCCgACCgCCgACCgCCgACCgCCgACCgCCgACCgCCgACCgKCCgAAqAAoAAAAAAAAAKIoAAAAAAAAAAAAAAigAAAAAAAAAAAAACKAAAAAAAAAAAAAAigAAAAAAAAAAAAAAAAAAAAAAAACKIoAAAAAAAAAAAAACKIoAAAAAAAAAAAAACKAAAAAAAAAAAAAAigAAAAAAAAAAAAACKIoAAAAAAAAD//Z";

export const LogoIcon: React.FC<IconProps> = ({ className }) => (
    <img src={logoBase64} alt="NO LIMITS Logo" className={className} />
);


export const DashboardIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
);

export const LoggerIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" />
    </svg>
);

export const PlannerIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" />
    </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c4-4 8-8 8-12a8 8 0 0 0-16 0c0 4 4 8 8 12Z" />
    </svg>
);

export const BrainCircuitIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a2.5 2.5 0 0 0-2.5 2.5v.5A2.5 2.5 0 0 0 12 7.5a2.5 2.5 0 0 1 2.5 2.5v.5a2.5 2.5 0 1 1-5 0v-.5A2.5 2.5 0 0 1 7 7.5a2.5 2.5 0 0 0-2.5-2.5m-2.5 5A2.5 2.5 0 0 0 4.5 12v.5a2.5 2.5 0 1 0 5 0V12A2.5 2.5 0 0 0 7 9.5a2.5 2.5 0 0 1-2.5-2.5M19.5 7.5A2.5 2.5 0 0 0 17 5v-.5a2.5 2.5 0 0 0-5 0v.5A2.5 2.5 0 0 0 14.5 10a2.5 2.5 0 0 1 2.5 2.5v.5a2.5 2.5 0 1 1-5 0V12A2.5 2.5 0 0 1 9.5 9.5M4.5 14.5A2.5 2.5 0 0 0 7 17v.5a2.5 2.5 0 1 0 5 0V17a2.5 2.5 0 0 0-2.5-2.5" /><path d="M17 19.5a2.5 2.5 0 0 1 2.5-2.5v-.5a2.5 2.5 0 1 0-5 0v.5a2.5 2.5 0 0 0 2.5 2.5" />
    </svg>
);

export const CreatePlanIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
    </svg>
);
