import React from 'react'
import { useTranslation } from 'react-i18next';

const ClearButton: React.FC = () => {
    const { t } = useTranslation('translation');

    return (
        <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </div>
    )
}

export default ClearButton