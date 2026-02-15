'use client';

import { useState, KeyboardEvent } from 'react';
import { useLanguage } from '@/app/i18n/LanguageContext';

interface ChatInterfaceProps {
  onQuery: (query: string) => void;
  response: string | null;
  isLoading: boolean;
  onClose: () => void;
  queryCount: number;
}

export function ChatInterface({ onQuery, response, isLoading, onClose, queryCount }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleSubmit = () => {
    console.log('ChatInterface handleSubmit called', { inputValue, isLoading });
    if (inputValue.trim() && !isLoading) {
      console.log('Calling onQuery with:', inputValue.trim());
      onQuery(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText('anthony@inga.dev');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/anthonyinga/', '_blank', 'noopener,noreferrer');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="fixed bottom-24 z-50 flex flex-col gap-[16px] w-[658px] left-1/2 -translate-x-1/2">
      {/* AI Response Bubble */}
      {response && (
        <div
          className="backdrop-blur-[2.35px] bg-[rgba(246,246,246,0.9)] flex items-start pb-[66px] pt-[16px] px-[30px] rounded-[15px] relative w-[658px] animate-fadeIn"
          style={{
            minHeight: '80px',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute border border-[#dcdcdc] border-solid inset-[-1px] pointer-events-none rounded-[16px]"
          />
          <div className="flex items-start justify-between gap-2 w-full">
            <p className="font-['Fira_Code'] font-medium leading-[normal] text-[#0b0b0b] text-[15px] w-[598px] whitespace-pre-wrap">
              {response}
            </p>
            <button
              onClick={onClose}
              className="shrink-0 text-[#3d3d3d] hover:text-[#0b0b0b] transition-colors text-[16px] font-bold"
              aria-label="Clear filter"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input Field */}
      <div className="bg-white flex h-[50px] items-center px-[30px] py-[39px] rounded-[15px] relative w-[658px]">
        <div
          aria-hidden="true"
          className="absolute border border-[#dcdcdc] border-solid inset-[-1px] pointer-events-none rounded-[16px] shadow-[0px_3px_14.9px_0px_rgba(0,0,0,0.12)]"
        />
        {queryCount >= 3 ? (
          /* Contact CTAs after 3 queries */
          <div className="flex items-center gap-3 w-full justify-center">
            <button
              onClick={handleEmailClick}
              className="font-['Fira_Code'] font-medium text-[15px] text-[#0b0b0b] hover:text-[#3d3d3d] transition-colors"
            >
              {emailCopied ? t.copied : t.email}
            </button>
            <span className="text-[#dcdcdc]">•</span>
            <button
              onClick={handleLinkedInClick}
              className="font-['Fira_Code'] font-medium text-[15px] text-[#0b0b0b] hover:text-[#3d3d3d] transition-colors"
            >
              {t.linkedin}
            </button>
          </div>
        ) : (
          /* Normal input field */
          <>
            <div className="flex flex-col w-full gap-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder={t.chatPlaceholder}
                className="font-['Fira_Code'] font-normal leading-[normal] text-[15px] w-full bg-transparent border-none outline-none text-[#0b0b0b] placeholder:text-[#8e8281] pr-2"
              />
              <button
                onClick={toggleLanguage}
                className="font-['Fira_Code'] font-medium text-[10px] text-[#8e8281] hover:text-[#0b0b0b] transition-colors self-start uppercase"
                aria-label="Toggle language"
              >
                {t.chatLanguageToggle}
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className="shrink-0 text-[#8e8281] hover:text-[#0b0b0b] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Submit query"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-45"
              >
                <path
                  d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
